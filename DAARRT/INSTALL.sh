#!/bin/sh

###########################
# DAARRT script installer #
###########################

## TODO :
#	daarrt.conf à rajouter / modifier
#	conf apache
#	conf réseau (ip fixe, ...)
#	conf VNC


# Mise à jour
read -p "Voulez vous faire la mise à jour du système (très long la premiere fois) ? (O/n)" sysUpdate
read -p "Installer nano ? (O/n)" nano
read -p "Installer des paquets nécessaires au DAARRT ? (O/n)" minimal
read -p "Installer les composants systeme (service et réseau) ? (O/n)" system
read -p "Quel est l'ID du DAARRT ?" id


case $sysUpdate in
	[YyOo]* )
		sudo apt-get update && sudo apt-get upgrade
	;;
esac

case $nano in
	[YyOo]* )
		sudo apt-get install nano
	;;
esac

case $minimal in
	[YyOo]* )
		sudo apt-get install apache2 shellinabox python3 python-mysqldb python-smbus i2c-tools
	;;
esac

case $system in
	[YyOo]* )
		# Copie des fichiers
		sudo cp -R files/* /
		sed -i '/^assert sys.version_info.major/d' /etc/daarrt/utils/trex/quick2wire/i2c.py

		# Installation des scripts de démarrage et d'arrêt
		sudo chmod +x /etc/daarrt/daarrt-service
		sudo ln -s /etc/daarrt/daarrt-service /etc/init.d/daarrt
		sudo update-rc.d daarrt start 95 2 3 4 5 . stop 01 0 1 6 .

		# Configuration réseau

		# Configuration apache
	;;
esac

# On fix les problèmes de dépendence
sudo apt-get -f install
