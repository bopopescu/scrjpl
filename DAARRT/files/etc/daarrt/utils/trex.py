#!/usr/bin/python -OO

import sys
import time
from trexio import TrexIO

def printb(string):
    '''
    Print bold text to screen
    '''
    print('\033[1m' + string + '\033[0m')

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


def high_low_int(high_byte, low_byte):
    '''
    Convert low and low and high byte to int
    '''
    return (high_byte << 8) + low_byte



class Trex():
    def __init__(self, addr = 0x07):
        self.trex_bus = TrexIO(addr)

        self.ADDRESS = addr#0x07
        self.voltage_f = 8
        self.motor_last_change = 0
        self.trex_bus.reset()

        # Init the trex controller byte array
        self.package = {
        	'start_byte' : 15,                     # Start byte
        	'pwm_freq' : 6,                        # PWMfreq
        	'lm_speed_high_byte' : 0,              # Left speed high byte
        	'lm_speed_low_byte' : 0,               # Left Speed low byte
        	'lm_brake' : 0,                        # Left brake
        	'rm_speed_high_byte' : 0,                     # Right Speed high byte
        	'rm_speed_low_byte' : 0,               # Right Speed low byte
        	'rm_brake' : 0,                        # Right brake
        	'servo_1_high_byte' : 0,               # Servo 1 high byte
        	'servo_1_low_byte' : 0,                # Servo 1 low byte
        	'servo_2_high_byte' : 0,               # Servo 2 high byte
        	'servo_2_low_byte' : 0,                # Servo 2 low byte
        	'servo_3_high_byte' : 0,               # Servo 3 high byte
        	'servo_3_low_byte' : 0,                # Servo 3 low byte
        	'servo_4_high_byte' : 0,               # Servo 4 high byte
        	'servo_4_low_byte' : 0,                # Servo 4 low byte
        	'servo_5_high_byte' : 0,               # Servo 5 high byte
        	'servo_5_low_byte' : 0,                # Servo 5 low byte
        	'servo_6_high_byte' : 0,               # Servo 6 high byte
        	'servo_6_low_byte' : 0,                # Servo 6 low byte
        	'devibrate' : 50,                      # Devibrate
        	'impact_sensitivity_high_byte' : 0,    # Impact sensitivity high byte
        	'impact_sensitivity_low_byte' : 50,    # Impact sensitivity low byte
        	'battery_high_byte' : 0,               # Battery voltage high byte
        	'battery_low_byte' : 50,               # Battery voltage low byte
        	'i2c_address' : 7,                     # I2C slave address
        	'i2c_clock' : 0                       # I2C clock frequency
        }

    def status(self):
        '''
        Read status from trex
        Return as a byte array
        '''
        # answer = self.trex_bus.i2c_read()
        # return map(ord, answer)
        raw_status = self.trex_bus.i2cRead()
        return struct.unpack(">cchhhhhhhhhhh", raw_status)[2:]


    def reset(self):
        '''
        Reset the trex controller to default
        Stop dc motors...
        '''
        self.trex_bus.reset()


    def motor(self, left, right):
        '''
        Set speed of the dc motors
        left and right can have the folowing values: -255 to 255
        -255 = Full speed astern
        0 = stop
        255 = Full speed ahead
        '''
        self.motor_last_change = time.time()*1000
        left = int(left)
        right = int(right)
        self.package['lm_speed_high_byte'] = high_byte(left)
        self.package['lm_speed_low_byte'] = low_byte(left)
        self.package['rm_speed_high_byte'] = high_byte(right)
        self.package['rm_speed_low_byte'] = low_byte(right)
        self.trex_bus.i2cWrite(self.package)


    def servo(self, servo, position):
        '''
        Set servo position
        Servo = 1 to 6
        Position = Typically the servo position should be a value between 1000 and 2000 although it will vary depending on the servos used
        '''
        servo = str(servo)
        position = int(position)
        self.package['servo_' + servo + '_high_byte'] = high_byte(position)
        self.package['servo_' + servo + '_low_byte'] = low_byte(position)
        self.trex_bus.i2cWrite(self.package)

    def voltage_fix(self, value):
        '''
        My trex shows 1 volt wrong for some reason
        1v = 100
        '''
        self.voltage_f = value

def trex_help():
    print("")
    printb("trex status")
    print("Battery voltage")
    print("Motor current")
    print("Accelerometer")
    print("Impact")
    print("")
    printb("trex motor <left> <right>")
    print("Set speed of the dc motors")
    print("Left, right: -255 to 255")
    print("")
    printb("trex servo <servo_number> <position>")
    print("Servo number: 1 to 6")
    print("Position: Typically the servo position should be a value between 0 and 180 degrees")
    print("")

if __name__ == '__main__':
    if len(sys.argv)==1:
        help()
    else:
        trex = Trex(0x07)
        if sys.argv[1] == "motor":
            trex.motor(sys.argv[2], sys.argv[3])
            print "Motor speed left: " + sys.argv[2]
            print "Motor speed right: " + sys.argv[3]
        elif sys.argv[1] == "servo":
            trex.servo(sys.argv[2], sys.argv[3])
            print "Servo number: " + sys.argv[2]
            print "Position: " + sys.argv[3]
        elif sys.argv[1] == "status":
            battery_voltage, left_motor_current, left_motor_encoder, right_motor_current, right_motor_encoder, accelerometer_x, accelerometer_y, accelerometer_z, impact_x, impact_y, impact_z = trex.status()
            print "Battery voltage: " + str(battery_voltage)
            print "Left motor current: " + str(left_motor_current)
            print "Left motor encoder: " + str(left_motor_encoder)
            print "Right motor current: " + str(right_motor_current)
            print "Right motor encoder: " + str(right_motor_encoder)
            print "Accelerometer X-axis: " + str(accelerometer_x)
            print "Accelerometer Y-axis : " + str(accelerometer_y)
            print "Accelerometer Z-axis : " + str(accelerometer_z)
            print "Impact X-axis: " + str(impact_x)
            print "Impact Y-axis: " + str(impact_y)
            print "Impact Z-axis: " + str(impact_z)
        else:
            trex_help()
