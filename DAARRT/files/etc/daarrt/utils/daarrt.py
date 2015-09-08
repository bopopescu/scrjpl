#!/usr/bin/python
# -*- coding: utf8 -*-

import os
import time
import math
import struct
# import sys

def high_low_int(high_byte, low_byte):
    '''
    Convert low and low and high byte to int
    '''
    return (high_byte << 8) + low_byte

def high_byte(integer):
    '''
    Get the high byte from a int
    '''
    return integer >> 8


def low_byte(integer):
    '''
    Get the low byte from a int
    '''
    return integer & 0xFF

class Daarrt():
    def __init__(self):

        self.motor_last_change = 0

        if os.access("/var/www/daarrt.conf", os.F_OK) :
            print "Real DAARRT creation"

            # Import modules
            from drivers.trex import TrexIO
            from drivers.razor import RazorIO
            from drivers.hcsr04 import SonarIO, PIN_MAP
            # self.trex = TrexIO(0x07)
            # self.razor = RazorIO()
            self.sonar = [SonarIO(i[0], i[1]) for i in PIN_MAP] # [Arriere, Droite, Avant, Gauche]
            # self.sonar = [SonarIO(2, 3), SonarIO(4, 5), SonarIO(6, 7), SonarIO(8, 9)] # [Arriere, Droite, Avant, Gauche]

        else :
            print "Create virtual DAARRT"

            from multiprocessing import Process,Manager
            import vDaarrt.simulation as simulation
            import vDaarrt.modules.vTrex as vTrex
            import vDaarrt.modules.vSonar as vSonar
            import vDaarrt.modules.vRazor as vRazor

            global simuProc

            manager = Manager()
            self.ns = manager.Namespace()
            self.trex = vTrex.vTrex()
            self.razor = vRazor.vRazorIO()
            self.sonarLeft = vSonar.vSonar(1,0,0)
            self.sonarRight = vSonar.vSonar(2,0,0)
            self.sonarFront = vSonar.vSonar (3,0,0)
            self.sonarBack = vSonar.vSonar(4,0,0)
            self.sonar = [self.sonarBack,self.sonarRight,self.sonarFront,self.sonarLeft]
            self.ns.isAlive = True
            simuProc = Process(target = simulation.simulate,args = (self.ns,self.trex.package,self.trex.changeData,self.trex.changeDataEnco,self.sonarLeft.changeSonarLeft,self.sonarRight.changeSonarRight,self.sonarFront.changeSonarFront,self.sonarBack.changeSonarBack,self.razor.changeCap))
            simuProc.start()

            print "Running Simulation"


    ###########################
    ##          T-REX        ##
    ###########################

    def status(self):
        '''
        Read status from trex
        Return as a byte array
        '''
        raw_status = self.trex.i2cRead()
        return struct.unpack(">cchhHhHhhhhhh", raw_status)[2:]


    def reset(self):
        '''
        Reset the trex controller to default
        Stop dc motors...
        '''
        self.trex.reset()


    def motor(self, left, right):
        '''
        Set speed of the dc motors
        left and right can have the folowing values: -255 to 255
        -255 = Full speed astern
        0 = stop
        255 = Full speed ahead
        '''
        self.motor_last_change = time.time()*1000

        try : lsign = left / abs(left)
        except ZeroDivisionError, e : lsign = 1

        try : rsign = right / abs(right)
        except ZeroDivisionError, e : rsign = 1

        left, right = lsign * min(abs(left), 255), rsign * min(abs(right), 255)

        left = int(left)
        right = int(right)
        self.trex.package['lm_speed_high_byte'] = high_byte(left)
        self.trex.package['lm_speed_low_byte'] = low_byte(left)
        self.trex.package['rm_speed_high_byte'] = high_byte(right)
        self.trex.package['rm_speed_low_byte'] = low_byte(right)
        self.trex.i2cWrite()


    def servo(self, servo, position):
        '''
        Set servo position
        Servo = 1 to 6
        Position = Typically the servo position should be a value between 1000 and 2000 although it will vary depending on the servos used
        '''
        servo = str(servo)
        position = int(position)
        self.trex.package['servo_' + servo + '_high_byte'] = high_byte(position)
        self.trex.package['servo_' + servo + '_low_byte'] = low_byte(position)
        self.trex.i2cWrite()


    ###########################
    ##    Razor 9-DOF IMU    ##
    ###########################

    def getAngles(self):
        '''
        Return angles measured by the Razor (yaw/pitch/roll calculated automatically from the 9-axis data).
        '''
        return struct.unpack('fff', self.razor.getAngles())

    def getSensorData(self):
        """
            Output SENSOR data of all 9 axes in text format.
            One frame consist of three 3x3 float values = 36 bytes. Order is: acc x/y/z, mag x/y/z, gyr x/y/z.
        """
        return struct.unpack('fffffffff', self.razor.getRawSensorData())

    def getCalibratedSensorData(self):
        """
            Output CALIBRATED SENSOR data of all 9 axes in text format.
            One frame consist of three 3x3 float values = 36 bytes. Order is: acc x/y/z, mag x/y/z, gyr x/y/z.
        """
        return struct.unpack('fffffffff', self.razor.getCalibratedSensorData())

    ###########################
    ##     Sonar HC-SR04     ##
    ###########################

    def getSonars(self):
        '''
        Return angles measured by the Razor (calculated automatically from the 9-axis data).
        '''
        dist = [(s.id, s.getValue()) for s in self.sonar]
        for name, val in dist :
            if val == -1 : print name + "range <= 5 cm"
            else : print name + "%.1f" % val
        return dist


if __name__ == "__main__":
    # Placer le code à executer ici
    d = Daarrt()
    d.motor(0, 0)
