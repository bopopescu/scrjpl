#!/usr/bin/python
# -*- coding: UTF-8 -*-

from subprocess import Popen, PIPE
# from docx import opendocx, getdocumenttext

import os
import sys

def file2text(file_path):
    ext = file_path.split('.')[-1]

    if ext == "doc":
        # Traitement des fichiers antérieurs à Word 2010
        os.chdir('antiword')
        cmd = ['antiword', file_path]
        p = Popen(cmd, stdout=PIPE)
        stdout, stderr = p.communicate()
        return stdout.decode('ascii', 'ignore')

    elif ext == "docx":
        # Traitement des fichiers Word 2010 et +
        document = opendocx(file_path)
        paratextlist = getdocumenttext(document)
        newparatextlist = []

        for paratext in paratextlist:
            newparatextlist.append(paratext.encode("utf-8"))

        return '\n\n'.join(newparatextlist)

    elif ext == "odt":
        # Traitement des fichiers OpenDocument Text
        cmd = ['odt2txt', '--stdout', file_path]
        p = Popen(cmd, stdout=PIPE)
        stdout, stderr = p.communicate()
        #r = [x.decode('iso-8859-1').encode('utf-8') for x in p.stdout.readlines()]
        return stdout

    elif ext == "pdf":
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

if __name__ == "__main__":
    if (len(sys.argv) == 2) :
        os.chdir(os.path.dirname(__file__)) # On se place dans le dossier du script
        print file2text(sys.argv[1]) # On affiche le texte du document
