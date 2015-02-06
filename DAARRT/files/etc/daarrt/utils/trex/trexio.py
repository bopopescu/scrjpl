'''
Controll the Trex robot controller
http://www.dagurobot.com/goods.php?id=135
 - Control CD motors
 - Control Servos
 - Read impact and accelerometer
 - Read Battery voltage
 - Read DC motor current draw

I use both quick2wire and smbus.
smbus to send command
quick2wire to read status
I can not get both functions operate on one of the librarys.
Smbus can not read multipple bytes from the bus without sending a register command.
And I did not get quick2wire to work when write to the slave.

Dependencies
------------
1. Enable I2C on the Raspberry PI
The file /etc/modules shall have the following lines
i2c-bcm2708
i2c-dev

2. Change the baudrate on The Raspberry Pi
Create a new file: /etc/modprobe.d/i2c.conf
And add:
options i2c_bcm2708 baudrate=9600

3. Install smbus:
sudo apt-get install python-smbus

4. Install quick2wire:
Add the following to /etc/apt/sources.list
deb http://dist.quick2wire.com/raspbian wheezy main
deb-src http://dist.quick2wire.com/raspbian wheezy main

sudo apt-get update
sudo apt-get install install quick2wire-gpio-admin quick2wire-python3-api
sed -i '/^assert sys.version_info.major/d' /usr/lib/python3/dist-packages/quick2wire/i2c.py

5. If you use python2 add the following to /etc/profile.d/pythonpath.sh
export PYTHONPATH=/usr/lib/python3/dist-packages

NOTE! When you execute this from the command line it execute outside of steelsquid daemon, and may interrupt for example the LCD, DAC, ADC or extra GPIO.
It is meant to be used inside the steelsquid daemon (see http://www.steelsquid.org/steelsquid-kiss-os-development)

@organization: Steelsquid
@author: Andreas Nilsson
@contact: steelsquid@gmail.com
@license: GNU Lesser General Public License v2.1
@change: 2014-11-23 Created
'''

import os
import sys
import smbus
import ctypes
import struct
import threading
import ConfigParser

# If the python3 packages not is in path (quick2wire)
sys.path.append("/usr/lib/python3/dist-packages")
import trex.quick2wire.i2c as i2c
from trex.quick2wire.i2c import I2CMaster, writing_bytes, reading

class TrexIO():
    def __init__(self, addr = 0x07):
        self.i2c_write_bus = smbus.SMBus(2)
        self.i2c_read_bus = i2c.I2CMaster(2)

        self.ADDRESS = addr

        self.lock = threading.Lock()
        self.package = [None] * 26
        self.__trex_reset()

    def __trex_reset(self):
        '''
        Reset the trex controller byte array
        '''
        self.start_byte = 15
        self.package[0] = 6    # PWMfreq
        self.package[1] = 0    # Left speed high byte
        self.package[2] = 0    # Left Speed low byte
        self.package[3] = 0    # Left brake
        self.package[4] = 0    # Right Speed high byte
        self.package[5] = 0    # Right Speed low byte
        self.package[6] = 0    # Right brake
        self.package[7] = 0    # Servo 1 high byte
        self.package[8] = 0    # Servo 1 low byte
        self.package[9] = 0    # Servo 2 high byte
        self.package[10] = 0   # Servo 2 low byte
        self.package[11] = 0   # Servo 3 high byte
        self.package[12] = 0   # Servo 3 low byte
        self.package[13] = 0   # Servo 4 high byte
        self.package[14] = 0   # Servo 4 low byte
        self.package[15] = 0   # Servo 5 high byte
        self.package[16] = 0   # Servo 5 low byte
        self.package[17] = 0   # Servo 6 high byte
        self.package[18] = 0   # Servo 6 low byte
        self.package[19] = 50  # Devibrate
        self.package[20] = 0   # Impact sensitivity high byte
        self.package[21] = 50  # Impact sensitivity low byte
        self.package[22] = 0   # Battery voltage high byte
        self.package[23] = 50  # Battery voltage low byte
        self.package[24] = 7   # I2C slave address
        self.package[25] = 0   # I2C clock frequency

    def __map(self, data):
        self.start_byte = data['start_byte']
        self.package[0] = data['pwm_freq']
        self.package[1] = data['lm_speed_high_byte']
        self.package[2] = data['lm_speed_low_byte']
        self.package[3] = data['lm_brake']
        self.package[4] = data['rm_speed_high_byte']
        self.package[5] = data['rm_speed_low_byte']
        self.package[6] = data['rm_brake']
        self.package[7] = data['servo_1_high_byte']
        self.package[8] = data['servo_1_low_byte']
        self.package[9] = data['servo_2_high_byte']
        self.package[10] = data['servo_2_low_byte']
        self.package[11] = data['servo_3_high_byte']
        self.package[12] = data['servo_3_low_byte']
        self.package[13] = data['servo_4_high_byte']
        self.package[14] = data['servo_4_low_byte']
        self.package[15] = data['servo_5_high_byte']
        self.package[16] = data['servo_5_low_byte']
        self.package[17] = data['servo_6_high_byte']
        self.package[18] = data['servo_6_low_byte']
        self.package[19] = data['devibrate']
        self.package[20] = data['impact_sensitivity_high_byte']
        self.package[21] = data['impact_sensitivity_low_byte']
        self.package[22] = data['battery_high_byte']
        self.package[23] = data['battery_low_byte']
        self.package[24] = data['i2c_address']
        self.package[25] = data['i2c_clock']

    def __updateStatus(self, raw_status):
        conf = ConfigParser.ConfigParser()
        conf.read("/var/www/html/daarrt.conf")

        status = struct.unpack(">cchhhhhhhhhhh", raw_status)

        if not conf.has_section("trex") : conf.add_section("trex")

        conf.set("trex", "battery", status[2])

        conf.set("trex", "left_motor", status[3])
        conf.set("trex", "left_encoder", status[4])

        conf.set("trex", "right_motor", status[5])
        conf.set("trex", "right_encoder", status[6])

        conf.set("trex", "accelerometer_x", status[7])
        conf.set("trex", "accelerometer_y", status[8])
        conf.set("trex", "accelerometer_z", status[9])

        fd = open("/var/www/html/daarrt.conf", 'w')
        conf.write(fd)
        fd.close()

    def i2cRead(self):
        '''
        Read status from trex
        Return as a byte array
        '''
        status = i2c_read_bus.transaction(i2c.reading(self.ADDRESS, 24))[0]
        self.__updateStatus(status)

        return status


    def i2cWrite(self, data):
        '''
        Write I2C data to T-Rex
        '''
        self.__map(data)
        self.lock.acquire()
        try:
            self.i2c_write_bus.write_i2c_block_data(self.ADDRESS, self.start_byte, self.package)
        finally:
            self.lock.release()

    def reset(self):
        '''
        Reset the trex controller to default
        Stop dc motors...
        '''
        self.lock.acquire()
        try:
            self.__trex_reset()
            self.i2c_write_bus.write_i2c_block_data(self.ADDRESS, self.start_byte, self.package)
        finally:
            self.lock.release()
