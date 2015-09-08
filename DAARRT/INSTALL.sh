#!/bin/bash

###########################
# DAARRT installer script #
###########################

# ATTENTION ! DOIT ETRE EXECUTE AVEC LES DROITS ROOT
# @author: Brian

## TODO :
#	conf VNC
#	conf passwd

ssid="DAARRT"
psk="josbidboksautsowtud9"

netmask="255.255.255.0"
gateway="192.168.0.50"

if [[ $EUID -ne 0 ]]; then
	echo "ATTENTION ! Ce script doit etre executé en tant que root !" 1>&2
    exit 1
fi


echo "Début de la configuration du DAARRT..."
echo "Cet utilitaire aura besoin de l'utilisateur lors de la configuration du clavier, afin de selectionner le layout (il s'agit de la première étape de l'installateur)."
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
	read -p "Voulez vous faire la mise à jour du système (très long la premiere fois) ? (O/N) " sysUpdate
done
while ! [[ $minimal =~ $re_ans ]]
do
	read -p "Installer les paquets nécessaires au DAARRT ? (O/N) " minimal
done
while ! [[ $system =~ $re_ans ]]
do
	read -p "Installer et configurer les composants du DAARRT (drivers, service et réseau) ? (O/N) " system
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

case $minimal in
	[YyOo]* )
		apt-get install nano apache2 shellinabox python3 python-mysqldb python-smbus i2c-tools python-serial libv4l-dev libjpeg8-dev subversion imagemagick # vlc
		dpkg -i shellinabox_2.14-1_armhf.deb

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
		chmod -R 777 /etc/daarrt/

		sed -i '/^assert sys.version_info.major/d' /etc/daarrt/utils/drivers/quick2wire/i2c.py
		sed -i 's/SHELLINABOX_ARGS="--no-beep"/SHELLINABOX_ARGS="--no-beep --disable-ssl"/g' /etc/default/shellinabox

		# Chargement de la config audio
		echo "Configuration d'alsamixer (audio)..."
		alsactl restore

		# Configuration du serveur de streaming
		echo "Configuration du serveur de streaming (mjpg-streamer) :"
		echo "Recuperation de mjpg-streamer..."
		svn co https://svn.code.sf.net/p/mjpg-streamer/code/ mjpg-streamer &> /dev/null

		echo "Installation de mjpg-streamer..."
		cd mjpg-streamer/mjpg-streamer
		make USE_LIBV4L2=true clean all &> /dev/null
		make DESTDIR=/usr install &> /dev/null

		echo "Nettoyage de l'installation de mjpg-streamer..."
		cd ../..
		rm -rf mjpg-streamer/
		apt-get purge subversion

		# Installation des scripts de démarrage et d'arrêt
		echo "Installation du daemon communicant avec l'interface web..."
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
		service networking stop
		service network-manager stop
		cat > /etc/network/interfaces <<EOL
# interfaces(5) file used by ifup(8) and ifdown(8)
auto lo
iface lo inet loopback

auto wlan5
iface wlan5 inet static
	address $ip
	netmask $netmask
	gateway $gateway
	wpa-conf /etc/wpa_supplicant/daarrt.conf
EOL

		echo "Edition du fichier hosts"
		sed -i 's/127.0.0.1\tlocalhost/127.0.0.1\tlocalhost.localdomain localhost ubuntu/g' /etc/hosts
		sed -i 's/127.0.1.1/# 127.0.1.1/g' /etc/hosts

		# On édite le fichier hosts du robot pour ajouter manuellement l'adresse de l'interface.
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
		chmod 777 /var/www/daarrt.conf

		# Configuration apache
		echo "Configuration d'Apache"
		a2enmod proxy proxy_http
		cat >> /etc/apache2/apache2.conf <<EOL

# Redirect shellinabox for DAARRT web interface
<Location /shell>
	ProxyPass http://localhost:4200/
	Order allow,deny
	Allow from all
</Location>
EOL
		mkdir /var/log/apache2/

		service networking start
		service apache2 restart
		service shellinabox restart
	;;
esac
