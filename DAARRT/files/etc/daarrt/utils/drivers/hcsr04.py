
#!/usr/bin/env python
# -*- encoding: utf-8 -*-

import os
import time
import ConfigParser

## For simplicity's sake, we'll create a string for our paths.
GPIO_MODE_PATH = os.path.normpath('/sys/devices/virtual/misc/gpio/mode/')
GPIO_PIN_PATH  = os.path.normpath('/sys/devices/virtual/misc/gpio/pin/')
GPIO_FILENAME  = "gpio"

## Create a few strings for file I/O equivalence
HIGH    = "1"
LOW     = "0"
INPUT   = "0"
OUTPUT  = "1"

class SonarIO():
    def __init__(self, id, GPIO_ECHO, GPIO_TRIGGER):
        self.id = id
        self.GPIO_ECHO = GPIO(GPIO_ECHO)
        self.GPIO_TRIGGER = GPIO(GPIO_TRIGGER)

        self.GPIO_ECHO.set(INPUT)
        self.GPIO_TRIGGER.set(OUTPUT)

        #self.GPIO_TRIGGER.set(HIGH)
        self.GPIO_TRIGGER.set(LOW)

        # Allow module to settle
        time.sleep(0.5)

    def getValue(self):
        self.GPIO_TRIGGER.clean()
        self.GPIO_TRIGGER.set(OUTPUT)

        # Send 10us pulse to trigger
        self.GPIO_TRIGGER.set(HIGH)
        time.sleep(0.00001)
        self.GPIO_TRIGGER.set(LOW)

        start = time.time()
        #while self.GPIO_ECHO.read() == LOW:
        #    start = time.time()

        while self.GPIO_ECHO.read() == HIGH :
            stop = time.time()
            if (stop - start > .29) : break

        try :
            # Calculate pulse length
            elapsed = stop-start

            # Distance pulse travelled in that time is time
            # multiplied by the speed of sound (cm/s)
            distance = elapsed * 34000

            # That was the distance there and back so halve the value
            distance = distance / 2

            self.__update(distance)
            print "Distance : %.1f" % distance

            return distance

        except UnboundLocalError :
            self.__update("<= 5")
            print "Sonar " + str(self.id) + " : range <= 5 cm"
            return -1

    def __update(self, value):

        conf = ConfigParser.ConfigParser()
        conf.read("/var/www/daarrt.conf")
        if not conf.has_section("sonar") : conf.add_section("sonar")

        conf.set("sonar", "sonar_" + str(self.id), str(value) + " cm")

        fd = open("/var/www/daarrt.conf", 'w')
        conf.write(fd)
        fd.close()

class GPIO():
    def __init__(self, i) :
        self.__mode = os.path.join(GPIO_MODE_PATH, 'gpio'+str(i))
        self.__data = os.path.join(GPIO_PIN_PATH, 'gpio'+str(i))

        self.clean()

    def set(self, state) :
        with open(self.__mode, 'w+') as f:
            f.write(state)

    def read(self) :
        with open(self.__data, 'r') as f:
            return f.read(1)

    def write(self, state) :
        with open(self.__data, 'w') as f:
            f.write(state)

    def clean(self) :
        self.set(OUTPUT)
        self.write(LOW)
