import time, math, sys,struct
import pygame,pylygon
from pygame.locals import *
from numpy import array
import math
import os
import geometry as geo

from constantes import *

def high_low_signed_int(high_byte, low_byte):
    '''
    Convert low and low and high byte to signed int
    '''

    return (high_byte << 8) + low_byte


class DAARRT2d:

    def __init__(self):

        #variable values
        self.posX = 350.0
        self.posY = 220.0
        self.leftSpeed = 0.0
        self.rightSpeed = 0.0
        self.robotCap =0.0#angle between 0 and 360
        self.clawOpening = 0.0 #angle between 0 and 180 (0 close/180 open)
        self.clawHeight = 0.0 #angle between 0 and 180 (0 up/180 bottom)

        self.cmdClawOpening = 0.0
        self.cmdClawHeight = 0.0

        #geometry constant

        self.clawLenght = clawLenght
        self.clawWidthOpened = clawWidthOpened
        self.clawWidthClosed = clawWidthClosed
        self.clawBase=clawBase

        self.robotLenght = robotLenght
        self.robotWidth = robotWidth

        self.wheelLenght = wheelLenght
        self.wheelWidth = wheelWidth
        self.wheelRadius = wheelRadius

        self.sonarAngle= sonarAngle
        self.sonarLenght = sonarLenght
        self.nFrontSonar = nFrontSonar
        self.nLeftSonar = nLeftSonar
        self.nRightSonar = nRightSonar
        self.nBackSonar = nBackSonar

        #creating the robot

        self.daarrt = geo.createRobot(self)
        self.sonar = geo.createSonar(self)

    def sonarCollide(self,world):
        dist=[]
        for beam in self.sonar:
            for obstacle in world.obstacle :
                if not beam.collidepoly(obstacle) is False :
                    tmp=1000
                    i=0
                    for beamPoint in beam.P :
                        distance=(math.sqrt((beamPoint[0]-self.posX)*(beamPoint[0]-self.posX) + (beamPoint[1]-self.posY)*(beamPoint[1]-self.posY)))
                        if distance<tmp :
                            index=i
                            tmp=distance
                        i+=1
                    x0=beam.P[index][0]
                    y0=beam.P[index][1]
                    ply=pylygon.Polygon([(x0,y0)])
                    tmp=ply.distance(obstacle)
                    dist.append(math.sqrt(tmp[0]*tmp[0] + tmp[1]*tmp[1]))
        try :
            return min(dist)
        except :
            return 0.0


    def update(self , package , world,changeSonar):
        dt = 1.0
        self.updateSpeed(package)
        self.updateClaw(package)
        theta=self.robotCap*math.pi/180.0
        self.posX += (((self.rightSpeed+self.leftSpeed)/self.robotWidth)*math.cos(theta))*dt
        self.posY += (((self.rightSpeed+self.leftSpeed)/self.robotWidth)*math.sin(theta))*dt
        self.robotCap += (self.leftSpeed-self.rightSpeed)*dt/self.robotWidth
        self.daarrt = geo.createRobot(self)
        self.sonar=geo.createSonar(self)

        changeSonar.append(self.robotCap)

        if(self.collide(world)):
            print "Collision detectee"
            return False
        print self.sonarCollide(world)

        return True

    def updateClaw(self,package):
        cHeight=high_low_signed_int(package['servo_1_high_byte'],package['servo_1_low_byte'])
        cOpening=high_low_signed_int(package['servo_2_high_byte'],package['servo_2_low_byte'])
        if cHeight<=0:
            self.cmdClawHeight=0.0
        else :
            if cHeight>180 :
                self.cmdClawHeight=180.0
            else :
                self.cmdClawHeight=cHeight
        if cOpening<=0 :
            self.cmdClawOpening=0.0
        else :
            if cOpening>180 :
                self.cmdClawOpening=180.0
            else :
                self.cmdClawOpening=cOpening
        if self.clawHeight<self.cmdClawHeight-1 :
            self.clawHeight+=0.5
        elif self.clawHeight>self.cmdClawHeight+1:
            self.clawHeight-=0.5
        if self.clawOpening<self.cmdClawOpening-1 :
            self.clawOpening+=0.5
        elif self.clawOpening>self.cmdClawOpening-1 :
            self.clawOpening-=0.5

    def updateSpeed(self , package):
        lSpeed=high_low_signed_int(package['lm_speed_high_byte'],package['lm_speed_low_byte'])
        rSpeed=high_low_signed_int(package['rm_speed_high_byte'],package['rm_speed_low_byte'])
        a=200.0/(255.0-80.0)
        b=-80.0*a
        if(lSpeed < 80 and lSpeed>-80):
            self.leftSpeed = 0.0
        elif(lSpeed>=0) :
            self.leftSpeed = a*lSpeed + b
        else :
            self.leftSpeed= a*lSpeed -b

        if(rSpeed < 80 and rSpeed>-80):
            self.rightSpeed=0.0
        elif(rSpeed>=0) :
            self.rightSpeed=a*rSpeed + b
        else :
            self.rightSpeed=a*rSpeed -b

    def collide(self,world):
        for element in self.daarrt:
            for obstacle in world.obstacle :
                try :
                    (bool)(element.collidepoly(obstacle))
                except :
                    return 1
        return 0

    def draw(self,simulation):
        i=0
        for element in self.daarrt :
            if(i==6 or i==7):
                pygame.draw.polygon(simulation,(0,0,255),element.P,0)
            elif(i!=0):
                pygame.draw.polygon(simulation,(255,0,0),element.P,0)
            else:
                pygame.draw.polygon(simulation,(255,0,0),element.P,1)
            i+=1
        for sonar in self.sonar :
            pygame.draw.polygon(simulation,(40,100,83),sonar.P,1)
