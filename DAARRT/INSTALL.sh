#!/bin/bash

###########################
# DAARRT script installer #
###########################

# ATTENTION ! DOIT ETRE EXECUTE EN TANT QUE root

## TODO :
#	conf VNC

ssid="DAARRT";
psk="josbidboksautsowtud9";

if [[ $EUID -ne 0 ]]; then
	echo "ATTENTION ! Ce script doit etre executé en tant que root !" 1>&2
    exit 1
fi

# Mise à jour
read -p "Quel est l'ID du DAARRT ?" id
read -p "Quel est le nom du DAARRT ?" name
read -p "Voulez vous faire la mise à jour du système (très long la premiere fois) ? (O/n)" sysUpdate
read -p "Installer nano ? (O/n)" nano
read -p "Installer les paquets nécessaires au DAARRT ? (O/n)" minimal
read -p "Installer et configurer les composants du DAARRT (drivers, service et réseau) ? (O/n)" system


case $sysUpdate in
	[YyOo]* )
		apt-get update && apt-get upgrade
	;;
	[Nn]* )
		echo "Les mise à jours système n'ont pas été effectuées"
	;;
esac

case $nano in
	[YyOo]* )
		apt-get install nano
	;;
esac

case $minimal in
	[YyOo]* )
		apt-get install apache2 shellinabox python3 python-mysqldb python-smbus i2c-tools
		apt-get -f install
		apt-get install apache2 shellinabox python3 python-mysqldb python-smbus i2c-tools

		# On fixe les problèmes de dépendence
		apt-get -f install
	;;
	[Nn]* )
		echo "Les composants minimum requis n'ont pas été installés !"
	;;
esac

case $system in
	[YyOo]* )
		# Copie des fichiers
		echo "Installation et configuration des drivers du DAARRT..."
		cp -R files/* /
		sed -i '/^assert sys.version_info.major/d' /etc/daarrt/utils/drivers/quick2wire/i2c.py

		# Installation des scripts de démarrage et d'arrêt
		chmod +x /etc/daarrt/daarrt-service
		ln -s /etc/daarrt/daarrt-service /etc/init.d/daarrt
		update-rc.d daarrt start 95 2 3 4 5 . stop 01 0 1 6 .

		# Configuration réseau
		echo "Parametrage reseaux"

		echo "Configuration du point d'accès"
		wpa_passphrase $ssid $psk > /etc/wpa_supplicant/daarrt.conf

		if [[ $id < 9 ]];
			then ip="192.168.0.10$id";
			else ip="192.168.0.1$id";
		fi
		echo "Configuration IP ($ip)"

		echo "Edition des interfaces réseaux"
		cat > /etc/network/interfaces <<EOL
# interfaces(5) file used by ifup(8) and ifdown(8)
auto lo
iface lo inet loopback

auto wlan5
iface wlan5 inet static
	address $ip
	netmask 255.255.255.0
	gateway 192.168.0.50
	wpa-conf /etc/wpa_supplicant/daarrt.conf
EOL

		echo "Création du fichier /var/www/daarrt.conf"
		cat > /var/www/daarrt.conf <<EOL
[general]
id=$id
name=$name
groups=0
EOL

		# Configuration apache
		echo "Configuration d'Apache"
		cat >> /etc/apache2/apache2.conf <<EOL

# Redirect shellinabox for DAARRT web interface
<Location /shell>
	ProxyPass http://localhost:4200/
	Order allow,deny
	Allow from all
</Location>
EOL
		service apache2 restart

	;;
esac
