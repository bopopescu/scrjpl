import struct
from multiprocessing import Process,Manager


class vRazorIO():
    def __init__(self):
        manager=Manager()
        self.changeCap=manager.list()
        self.changeCap.append(0.0)

    def getAngles(self):

        try :
            output=struct.pack("fff",self.changeCap[-1],0.0,0.0)

        except:
            print "Can't get value"
            output=struct.pack("fff",0.0,0.0,0.0)
        return output

    def getRawSensorData(self):
        output=struct.pack("fffffffff",0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0)
        return output

    def getCalibratedSensorData(self):
        output=struct.pack("fffffffff",0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0)
        return output
