#!/usr/bin/python

import sys
import time
import _mysql
import socket
import ConfigParser


HOST = "admin.scrjpl.fr"
USR = "daarrt"
PASS = "daarrtuser"
DB = "daarrt"
CONFIG = "/var/www/daarrt.conf"

def get_ip():
	try :
		ip = ([(s.connect((HOST, 80)), s.getsockname()[0], s.close()) for s in [socket.socket(socket.AF_INET, socket.SOCK_DGRAM)]][0][1])
		return ip
	except :
		time.sleep(2)
		return get_ip()

if __name__ == "__main__":
	sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
	sockfd = sock.fileno()

	conf = ConfigParser.ConfigParser()
	conf.read(CONFIG)

	ip = get_ip()
	id = conf.get('global', 'id')
	name = conf.get('global', 'name')
	grp = conf.get('global', 'groups')
	
	db = _mysql.connect(host=HOST, user=USR, passwd=PASS, db=DB)

	if sys.argv[1] == "start" :
		while True :
			try :
				# Getting the number of groups using the DAARRT:
				# SELECT * FROM (SELECT g.id, g.id_ori, g.name, g.daarrt from groups g, (SELECT MAX(id) as maxi FROM `groups` GROUP BY id_ori) t WHERE g.id=t.maxi ORDER BY g.name) unigroups WHERE daarrt LIKE '%0%'
				db.query("INSERT INTO online (id, name, address, groups) VALUES (" + id + ", \"" + name + "\", \"" + ip + "\", " + grp + ");")

				break
			except Exception, e :
				if str(e) == "(1062, \"Duplicate entry '" + id + "' for key 'id'\")" : break
				time.sleep(2)
				continue
	elif sys.argv[1] == "stop":
        	db.query("DELETE FROM online WHERE id=" + id + ";")

        db.close()
	sys.exit(0)
