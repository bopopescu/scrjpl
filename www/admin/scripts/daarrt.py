#!/usr/bin/python
# -*- coding: UTF-8 -*-

import os
import socket
import urllib
import threading
import ConfigParser

TIMEOUT = 50 # Timeout in ms
daarrtList = ["192.168.0.101"] # Possible DAARRT IP list
pool = [] # Threads pool
result = {}

# Try to fetch and parse config file for the giver ip address
def proceed(ip):
	data = {}
	path = "../tmp/" + ip + ".conf"

	# Try to reach host
	try :
		urllib.urlretrieve("http://" + ip + "/daarrt.conf", path)

		conf = ConfigParser.ConfigParser()
		conf.read(path)
		data["id"] = int(conf.get("global", "id"))
		data["name"] = conf.get("global", "name")
		data["groups"] = int(conf.get("global", "groups"))


		result[ip] = data
	except :
		result[ip] = "offline" # if can't reach -> set offline

if __name__ == "__main__" :
	# Initialisation
	os.chdir(os.path.dirname(__file__))
	socket.setdefaulttimeout(TIMEOUT)

	# Fetch config file in separate threads
	for ip in daarrtList :
		thread = threading.Thread(target = proceed, args = (ip, ))
		thread.start()
		pool.append(thread)

	# Wait the threads to terminate
	for thread in pool :
		thread.join()

	print result
