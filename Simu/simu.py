#!/usr/bin/python2.7
# -*- coding : Utf-8 -*

import pygame,pylygon
from pygame.locals import *
from numpy import array

from classes import *
from constantes import *


#ouverture de la fenetre avec les constantes
simulation=pygame.display.set_mode((hauteur,largeur))

#Icone
icone=pygame.image.load(icone)
pygame.display.set_icon(icone)

pygame.display.set_caption(titre)

#boucle du simulateur
continuer=1
while continuer :

    #Limitation vitesse
    pygame.time.Clock().tick(30)
    for event in pygame.event.get():
        if event.type==QUIT :
            continuer=0
