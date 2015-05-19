#!/bin/bash

###########################
# DAARRT installer script #
###########################

# ATTENTION ! DOIT ETRE EXECUTE EN TANT QUE root

## TODO :
#	conf VNC

ssid="DAARRT"
psk="josbidboksautsowtud9"

if [[ $EUID -ne 0 ]]; then
	echo "ATTENTION ! Ce script doit etre executé en tant que root !" 1>&2
    exit 1
fi


echo "Début de la configuration du DAARRT..."
echo "Cette utilitaire aura besoin de l'utilisateur lors de la configuration du clavier (pour selectionner le layout) et lors des questions initiales."
echo ""
echo "Le temps d'installation des mises à jours la premiere fois peut atteindre 2h voir 3h. Il est donc conseillé de prévoir de quoi s'occuper en attendant."
echo ""
echo ""


re_int='^[0-9]{1,2}$'
re_ans='^[OoYyNn]{1}$'

while ! [[ $id =~ $re_int ]]
do
	read -p "Quel est l'ID du DAARRT ? " id
	if ! [[ $id =~ $re ]] ; then
		echo "Merci de rentrer un nombre entre 0 et 99."
	fi
done

read -p "Quel est le nom du DAARRT ? " name

while ! [[ $sysUpdate =~ $re_ans ]]
do
	read -p "Voulez vous faire la mise à jour du système (très long la premiere fois) ? (O/n) " sysUpdate
done
while ! [[ $nano =~ $re_ans ]]
do
	read -p "Installer nano ? (O/n) " nano
done
while ! [[ $minimal =~ $re_ans ]]
do
	read -p "Installer les paquets nécessaires au DAARRT ? (O/n) " minimal
done
while ! [[ $system =~ $re_ans ]]
do
	read -p "Installer et configurer les composants du DAARRT (drivers, service et réseau) ? (O/n) " system
done


echo "Configuration du clavier..."
dpkg-reconfigure keyboard-configuration

case $sysUpdate in
	[YyOo]* )
		apt-get update && apt-get upgrade
	;;
	[Nn]* )
		echo "Les mise à jours système n'ont pas été effectuées !"
	;;
esac

case $nano in
	[YyOo]* )
		apt-get install nano
	;;
esac

case $minimal in
	[YyOo]* )
		apt-get install apache2 shellinabox python3 python-mysqldb python-smbus i2c-tools python-serial vlc
		apt-get -f install
		apt-get install apache2 shellinabox python3 python-mysqldb python-smbus i2c-tools python-serial vlc

		# On fixe les problèmes de dépendence
		apt-get -f install

		dpkg -i shellinabox_2.14-1_armhf.deb
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
		chmod -R 777 /etc/daarrt/

		sed -i '/^assert sys.version_info.major/d' /etc/daarrt/utils/drivers/quick2wire/i2c.py
		sed -i 's/SHELLINABOX_ARGS="--no-beep"/SHELLINABOX_ARGS="--no-beep --disable-ssl"/g' /etc/default/shellinabox

		# Installation des scripts de démarrage et d'arrêt
		chmod +x /etc/daarrt/daarrt-service
		ln -s /etc/daarrt/daarrt-service /etc/init.d/daarrt
		update-rc.d daarrt start 95 2 3 4 5 . stop 01 0 1 6 .

		# Configuration réseau
		echo "Parametrage reseaux..."

		echo "Configuration du point d'accès WiFi..."
		wpa_passphrase $ssid $psk > /etc/wpa_supplicant/daarrt.conf

		if [[ $id < 10 ]];
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

		echo "Edition du fichier hosts"
		sed -i 's/127.0.0.1\tlocalhost/127.0.0.1\tlocalhost.localdomain localhost ubuntu/g' /etc/hosts
		sed -i 's/127.0.1.1/# 127.0.1.1/g' /etc/hosts
		cat >> /etc/hosts <<EOL

# Configuration de l'interface web du DAARRT
192.168.0.1	admin.scrjpl.fr
192.168.0.1	eleve.scrjpl.fr
EOL

		echo "Création du fichier /var/www/daarrt.conf"
		cat > /var/www/daarrt.conf <<EOL
[general]
id=$id
name=$name
groups=0
EOL

		# Configuration apache
		a2enmod proxy
		echo "Configuration d'Apache"
		cat >> /etc/apache2/apache2.conf <<EOL

# Redirect shellinabox for DAARRT web interface
<Location /shell>
	ProxyPass http://localhost:4200/
	Order allow,deny
	Allow from all
</Location>
EOL
		mkdir /var/log/apache2

		service apache2 restart
		service shellinabox restart
	;;
esac
