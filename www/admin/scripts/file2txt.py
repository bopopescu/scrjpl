#!/usr/bin/python
# -*- coding: UTF-8 -*-

from subprocess import Popen, PIP

import os
import sys

def file2text(file_path):
    ext = file_path.split('.')[-1]

    if ext == "doc":
        # DEPRECATED
        # Traitement des fichiers antérieurs à Word 2010
        os.chdir('antiword')
        cmd = ['antiword', file_path]
        p = Popen(cmd, stdout=PIPE)
        stdout, stderr = p.communicate()
        return stdout.decode('ascii', 'ignore')

    elif ext == "docx":
        # Traitement des fichiers Word 2010 et +
        return os.system('docx2txt <' + file_path)

    elif ext == "odt":
        # Traitement des fichiers OpenDocument Text
        cmd = ['odt2txt', '--stdout', file_path]
        p = Popen(cmd, stdout=PIPE)
        stdout, stderr = p.communicate()
        return stdout

    elif ext == "pdf":
        # Traitement des fichiers PDF
        cmd = ['pdftotext', file_path, '-']
        p = Popen(cmd, stdout=PIPE)
        stdout, stderr = p.communicate()
        return stdout

    elif ext in ["cnf", "ini", "log", "md", "txt"] :
        # Traitement des fichiers bruts
        fp = open(file_path, 'r')
        data = fp.read()
        fp.close()
        return data

    else :
        return ""

if __name__ == "__main__":
    if (len(sys.argv) == 2) :
        # Initialisation
        try : os.chdir(os.path.dirname(__file__)) # On se place dans le dossier du script
        except OSError : pass # If already in directory, __file__ == ''

        print file2text(sys.argv[1]) # On affiche le texte du document
