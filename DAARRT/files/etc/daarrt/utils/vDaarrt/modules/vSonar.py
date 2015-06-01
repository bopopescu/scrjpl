from multiprocessing import Process,Manager

HIGH    = "1"
LOW     = "0"
INPUT   = "0"
OUTPUT  = "1"

class vSonar():

    def __init__(self, id, GPIO_ECHO, GPIO_TRIGGER):
        self.id = id
        self.GPIO_ECHO = vGPIO(GPIO_ECHO)
        self.GPIO_TRIGGER = vGPIO(GPIO_TRIGGER)

        manager=Manager()
        if(id == 1):
            self.changeSonarLeft=manager.list()

        elif (id == 2):
            self.changeSonarRight=manager.list()

        elif (id == 3):
            self.changeSonarFront=manager.list()

        elif (id == 4):
            self.changeSonarBack=manager.list()
        else :
            pass

    def getValue(self) :
        try :
            if(self.id==1):
                return self.changeSonarLeft[-1]
            elif (self.id == 2):
                return self.changeSonarRight[-1]

            elif (self.id == 3):
                return self.changeSonarFront[-1]

            elif (self.id == 4):
                return self.changeSonarBack[-1]
            else :
                pass
        except :
            return -1


class vGPIO():
    def __init__(self, i) :
        pass

    def set(self, state) :
        pass

    def read(self) :
        pass

    def write(self, state) :
        pass

    def clean(self) :
        pass
