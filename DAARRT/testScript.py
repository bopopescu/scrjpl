#!/usr/bin/python
# -*- encoding: utf-8 -*-

import os
os.path.append('/etc/daarrt/utils')

import time
from daarrt import *

d = Daarrt()

d.motor(0, 0)
d.motor(170, 170)
d.servo(1, 90)
d.servo(2, 90)
time.sleep(2)
d.motor(0, 0)
time.sleep(1)

d.servo(2, 1)
d.servo(2, 0)
d.motor(-170, -170)
time.sleep(2)
d.motor(0, 0)
time.sleep(1)
d.servo(1, 10)
d.motor(-200, 200)
time.sleep(3)

d.motor(0, 0)
d.servo(1, 0)
d.servo(2, 0)

