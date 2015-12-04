#!/usr/bin/python

import sys
import ConfigParser

print sys.argv

cnf = ConfigParser.ConfigParser()
cnf.read("daarrt.conf")
grp = int(cnf.get('global', 'groups'))
# print grp, ' -> ', ((grp + 1) if (sys.argv[1] == 'add') else (grp - 1))

if sys.argv[1] == 'add':
    cnf.set('global', 'groups', grp + 1)
elif sys.argv[1] == 'del':
    cnf.set('global', 'groups', grp - 1)

with open("daarrt.conf", 'wb') as fd:
    cnf.write(fd)
