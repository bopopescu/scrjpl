import time, math, sys
import pygame,pylygon
from pygame.locals import *
from numpy import array

from constantes import *



class DAARRT2d:

    def __init__(self):
        self.nom=nomRobot
        self.posX=0.0
        self.posY=0.0
        self.cap=90.0
        self.image=pygame.image.load(imageRobot).convert_alpha()
        self.imageBase=pygame.image.load(imageRobot).convert_alpha()
        self.longueur=longueurRobot
        self.largeur=largeurRobot

    def sonar(self):
        pass

    def draw(self,simulation):
        simulation.blit(self.image,(self.posX,self.posY))


    def rotate(self,angle):
        self.image=pygame.transform.rotate(self.imageBase,angle)
        rect = self.image.get_rect()
        rect_origine=self.imageBase.get_rect()
        rect.center=rect_origine.center



class World :
    def __init__(self,fichier):
        self.nom=fichier
        self.structure=0
        self.mur=pygame.image.load(mur).convert_alpha()

    def generer(self):
        with open(self.nom,"r") as fichier :
            structure_monde=[]
            for ligne in fichier :
                ligne_monde=[]
                for element in ligne :
                    if element !='\n':
                        ligne_monde.append(element)
                structure_monde.append(ligne_monde)
            self.structure=structure_monde

    def afficher(self,simulation):
        num_ligne=0
        for ligne in self.structure :
            num_case=0
            for element in ligne :
                x=num_case*taille_element
                y=num_ligne*taille_element
                if element=='m':
                    simulation.blit(self.mur,(x,y))
                num_case+=1
            num_ligne+=1
