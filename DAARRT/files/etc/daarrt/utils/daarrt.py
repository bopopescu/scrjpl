#!/usr/bin/python

import os
# import sys

class Daarrt():
    def __init__(self, ):
        if os.access("/var/www/html/daarrt.conf", os.F_OK) :
            print "Real DAARRT creation"

            # Import modules
            from trex.trexio import TrexIO

            self.trex = TrexIO()
        else :
            print "Create virtual DAARRT"

            # Import modules
            from trex.trexio import TrexIO



if __name__ == "__main__":
    Daarrt()
