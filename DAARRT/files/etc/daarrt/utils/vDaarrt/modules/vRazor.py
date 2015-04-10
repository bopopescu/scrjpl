import struct
from multiprocessing import Process,Manager


class vRazorIO():
    def __init__(self):
        manager=Manager()
        self.changeSonar=manager.list()
        self.changeSonar.append(0.0)

    def getAngles(self):

        try :
            output=struct.pack("fff",self.changeSonar[-1],0.0,0.0)
            if len(self.changeSonar)>2:
                self.changeSonar.pop()
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
