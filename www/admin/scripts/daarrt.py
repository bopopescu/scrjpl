#!/usr/bin/python
# -*- coding: UTF-8 -*-

import os
import sys
import json
import socket
import urllib
import MySQLdb as mdb
import threading
import ConfigParser

# ERREURS
NOT_IN_DATABASE = -1
DAARRT_NOT_RESPONDING = 1


TIMEOUT = 5 # Timeout in s set by default (reset with value in database)
daarrtList = sys.argv[1:] # DAARRT IP list given by arguments
pool = [] # Threads pool
result = {}

# Try to fetch and parse config file for the giver ip address
def proceed(id):
	cur = db.cursor()
	cur.execute("SELECT address FROM active WHERE id=" + id + " LIMIT 1")
	data = cur.fetchone()
	
	try : ip = data[0]
	except :
		cur.close()
		result[id] = "offline"
		return NOT_IN_DATABASE

	data = {}
	path = "../tmp/" + ip + ".conf"

	# Remove previous conf file (if exists)
	try : os.remove(path)
	except : pass
	# Try to reach host
	try :
		urllib.urlretrieve("http://" + ip + "/daarrt.conf", os.getcwd() + '/' + path)

		conf = ConfigParser.ConfigParser()
		conf.read(path)

		sections = conf.sections()
		sections.reverse()

		for s in sections :
			data[s] = {}
			for p in conf.options(s) :
				data[s][p] = conf.get(s, p)

		result[id] = data

		cur.close()
		return 0

	except :
		# On supprime de la bdd le DAARRT qui semble déconnecté
		result[id] = "offline" # if can't reach -> set offline
		#cur.execute("DELETE FROM active WHERE id=" + id + " LIMIT 1")
		db.commit()
		cur.close()
		return DAARRT_NOT_RESPONDING

if __name__ == "__main__" :
	# Initialisation
	try : os.chdir(os.path.dirname(__file__))
	except OSError : pass # If already in directory, __file__ == ''


	db = mdb.connect("admin.scrjpl.fr", "daarrt", "daarrtuser", db="daarrt")
	cur = db.cursor()
	cur.execute("SELECT value FROM config WHERE var=\"timeout\" LIMIT 1")
	data = cur.fetchone()
	cur.close()

	try : TIMEOUT = float(data[0])
	except : pass

	socket.setdefaulttimeout(TIMEOUT)

	if len(daarrtList) == 1 :
		proceed(daarrtList[0])
	else :
		import time
		# Fetch config file in separate threads
		for id in daarrtList :
			thread = threading.Thread(target = proceed, args = (id, ))
			thread.start()
			pool.append(thread)
			time.sleep(0.05) # permet de le pas acceder en meme temps à db, à améliorer avec un lock

		# Wait the threads to terminate
		for thread in pool :
			thread.join()

	db.close()
	print json.dumps(result)
