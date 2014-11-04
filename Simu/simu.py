#!/usr/bin/python2.7
# -*- coding : Utf-8 -*

import pygame,pylygon
from pygame.locals import *
from numpy import array

from classes import *
from constantes import *

pygame.init()
simulation=pygame.display.set_mode((hauteur,largeur))

myWorld=World("world1.txt")
myDAARRT2d=DAARRT2d()
myWorld.generer()



#ouverture de la fenetre avec les constantes

#Icone
icone=pygame.image.load(icone)
pygame.display.set_icon(icone)
bg=pygame.image.load(background).convert()

pygame.display.set_caption(titre)

#boucle du simulateur
pygame.key.set_repeat(400, 30)
continuer=1
angle=10
while continuer :

    #Limitation vitesse
    pygame.time.Clock().tick(30)
    for event in pygame.event.get():
        if event.type==QUIT :
            continuer=0
        if event.type == KEYDOWN:
            if event.key==K_r:
                myDAARRT2d.cap+=10
                myDAARRT2d.cap=myDAARRT2d.cap%360
                myDAARRT2d.rotate(myDAARRT2d.cap)
            if event.key==K_m:
                myDAARRT2d.move()

    simulation.blit(bg,(0,0))
    myWorld.afficher(simulation)
    myDAARRT2d.draw(simulation)
    pygame.display.flip()
