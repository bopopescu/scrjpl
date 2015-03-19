
#!/usr/bin/env python
# -*- encoding: utf-8 -*-

import os
import time
import ConfigParser

## For simplicity's sake, we'll create a string for our paths.
GPIO_MODE_PATH= os.path.normpath('/sys/devices/virtual/misc/gpio/mode/')
GPIO_PIN_PATH=os.path.normpath('/sys/devices/virtual/misc/gpio/pin/')
GPIO_FILENAME="gpio"

## Create a few strings for file I/O equivalence
HIGH = "1"
LOW =  "0"
INPUT = "0"
OUTPUT = "1"

class SonarIO():
    def __init__(self, id, GPIO_ECHO, GPIO_TRIGGER):
        self.id = id
        self.GPIO_ECHO = GPIO(GPIO_ECHO)
        self.GPIO_TRIGGER = GPIO(GPIO_TRIGGER)

        self.GPIO_ECHO.set(INPUT)
        self.GPIO_TRIGGER.set(OUTPUT)

    def getValue(self):
        # Allow module to settle
        time.sleep(0.5)

        # Send 10us pulse to trigger
        GPIO_TRIGGER.set(HIGH)
        time.sleep(0.00001)
        GPIO_TRIGGER.set(LOW)

        start = time.time()
        while GPIO_ECHO.read()[0] == LOW:
            start = time.time()

        while GPIO_ECHO.read()[0] == HIGH:
            stop = time.time()

        # Calculate pulse length
        elapsed = stop-start

        # Distance pulse travelled in that time is time
        # multiplied by the speed of sound (cm/s)
        distance = elapsed * 34000

        # That was the distance there and back so halve the value
        distance = distance / 2

        print "Distance : %.1f" % distance

    def __update(self, raw_data):

        conf = ConfigParser.ConfigParser()
        conf.read("/var/www/daarrt.conf")
        if not conf.has_section("sonar") : conf.add_section("razor")

        fd = open("/var/www/daarrt.conf", 'w')
        conf.write(fd)
        fd.close()

class GPIO():
    def __init__(self, i) :
        self.__mode = os.path.join(GPIO_MODE_PATH, 'gpio'+str(i))
        self.__data = os.path.join(GPIO_DATA_PATH, 'gpio'+str(i))

        self.clean()

    def set(self, state) :
        file = open(self.__mode, 'r+')
        file.write(state)      ## set the mode of the pin
        file.close()

    def read(self) :
        file = open(self.__data, 'r')
        return file.read()       ## fetch the pin state

    def write(self, state) :
        file = open(self.__data, 'r+')
        file.write(state)
        file.close()

    def clean(self) :
        file = open(self.__mode, 'r+')  ## open the file in r/w mode
        file.write(OUTPUT)
        file.close()

        file = open(self.__data, 'r+')
        file.write(LOW)
        file.close()
