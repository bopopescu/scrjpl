#!/usr/bin/env python
import serial
import os

VALID_STATES = ["#ob", "#osrb", "#oscb"]

class RazorIO():
    def __init__(self):

        # Setting GPIO 0 & 1 in UART mode
        os.system("sudo modprobe gpio")
        os.system('echo "3" > /sys/devices/virtual/misc/gpio/mode/gpio0')
        os.system('echo "3" > /sys/devices/virtual/misc/gpio/mode/gpio1')

        self.bus = serial.Serial('/dev/ttyS1', 9600, timeout = 10)
        self.state = "#ob"
        self.bus.write("#ob")

    def __setState(self, state):
        self.state = state
        if state in VALID_STATES : self.bus.write(state)


    def getAngles(self):
        """
            Output angles in BINARY format (yaw/pitch/roll as binary float, so one output frame
            is 3x4 = 12 bytes long)
        """
        if self.state != '#ob': self.__setState('#ob')
        self.bus.write("#f")
        return self.bus.read(12)

    def getRawSensorData(self):
        """
            Output RAW SENSOR data of all 9 axes in BINARY format.
            One frame consist of three 3x3 float values = 36 bytes. Order is: acc x/y/z, mag x/y/z, gyr x/y/z.
        """
        if self.state != '#osrb': self.__setState('#osrb')
        self.bus.write("#f")
        return self.bus.read(36)

    def getCalibratedSensorData(self):
        """
            Output CALIBRATED SENSOR data of all 9 axes in BINARY format.
            One frame consist of three 3x3 float values = 36 bytes. Order is: acc x/y/z, mag x/y/z, gyr x/y/z.
        """
        if self.state != '#oscb': self.__setState('#oscb')
        self.bus.write("#f")
        return self.bus.read(36)
