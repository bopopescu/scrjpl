#!/usr/bin/python

import os
import sys

try : os.chdir(os.path.dirname(__file__)) # On se place dans le dossier du script
except OSError : pass

sys.path.append('trex')
from trex.trexio import TrexIO

class RealDaarrt():
    def __init__():
        self.trex = TrexIO()
