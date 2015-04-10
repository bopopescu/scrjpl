'''
@auhtor : Corentin R
@date : February 2015

This file contains the function called by the programm when running on simulation

'''


import pygame,pylygon,threading,sys,time
from pygame.locals import *

from modules.daarrt2d import *
from modules.world import *
from modules.constantes import *
from modules.info import *


def simulate(ns,package,changeData,changeSonar):

    #creation of objects required
    daarrt2d=DAARRT2d()
    myWorld=World(worldName)
    worldLenght=myWorld.generer()
    pygame.init()
    simu=pygame.display.set_mode((worldLenght[0]+windowWidth,worldLenght[1]))
    info=Info(worldLenght)
    bg=pygame.image.load(background).convert()
    pygame.display.set_caption(titre)

    #first printing
    myWorld.afficher(simu,True)

    #simulation loop
    pygame.key.set_repeat(400, 30)
    runSimu=True
    display=0

    while(runSimu==True) :
        #Limitation vitesse
        pygame.time.Clock().tick(speed)
        simu.blit(bg,(0,0))
        myWorld.afficher(simu,False)
        package,changeData=cleanBus(package,changeData)
        runSimu=daarrt2d.update(package,myWorld,changeSonar)
        info.afficher(simu,daarrt2d,display)
        daarrt2d.draw(simu)
        pygame.display.flip()
        for event in pygame.event.get():
            if event.type == pygame.QUIT :
                runSimu = False
            if event.type == pygame.MOUSEBUTTONDOWN and event.pos[0]<worldLenght[0] + 40 and event.pos[0] > worldLenght[0] + 10 and event.pos[1] < worldLenght[1] - 30 and event.pos[1] > worldLenght[1] - 60 :
                display += 1
                if display >= 2 :
                    display = 0
            if event.type == KEYDOWN and event.key == K_l :

                if display == 2 :

                    display = 0

                else :

                    display = 2

    print "Ending Simulation..."
    pygame.quit()
    ns.isAlive=False

def cleanBus(package,changeData):
    '''
    return the package updated and the element change Data cleaned

    args :
        package : dictionnary corresponding to the bus
        changeData : list of elements which changed since the last update
    '''

    while(len(changeData)>0):
        package[changeData[-1][0]]=changeData[-1][1]
        changeData.pop()
    return package,changeData
