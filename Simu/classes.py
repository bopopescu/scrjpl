import time, math, sys
import pygame,pylygon
from pygame.locals import *
from numpy import array

from constantes import *

def poly_translate (p, tx, ty):
    pp = p.P
    ppt = array([(x+tx,y+ty) for (x,y) in pp])
    p.P = ppt
    return pylygon.Polygon(p)

def poly_rotate (p, theta):
    thetar = theta*math.pi/180.0
    pp = p.P
    ppr = array([(x*math.cos(thetar)-y*math.sin(thetar),
                  x*math.sin(thetar)+y*math.cos(thetar)) for (x,y) in pp])
    p.P = ppr
    return pylygon.Polygon(p)


class DAARRT2d:

    def __init__(self):
        self.nom=nomRobot
        self.posX=0.0
        self.posY=0.0
        self.cap=90.0
        self.longueur=longueurRobot
        self.largeur=largeurRobot

    def sonar():
        pass

    def draw():
        pass


class World :
    def__init__(self,fichier):
        self.nom=fichier
        self.structure=0

    def generer(self):
        with open(self.fichier,"r") as fichier :
            structure_monde=[]
            for ligne in fichier :
                ligne_monde=[]
                for element in ligne :
                    if element !='\n':
                        ligne_monde.append(element)
                structure_monde.append(ligne_monde)
            self.structure=structure_monde

    def afficher(self,simulation):
        mur=pygame.image.load(mur).convert_alpha()

        num_ligne=0
        for ligne in self.structure :
            num_case=0
            for element in ligne :
                x=num_case*taille_element
                y=num_ligne*taille_element
                if element='m':
                    simulation.blit(mur,(x,y))
            num_case+=1
        num_ligne+=1
