Projet scrjpl
=============
Quelques petits conseils pour installer et utiliser la bête...

## Les fichiers

### Fichiers à mettre sur le robots

Le **dossier DAARRT** contient l'intégralité des fichiers devant être installé sur chaque robot.
Pour ce faire, il faut copier le dossier sur la PCDuino (dans n'importe quel répertoire) puis lancer en mode root le script INSTALL.sh qui s'y trouve.

### La documentation

Le **dossier doc** contient l'ensemble de la documentation. L'interface web est livrée "vide" donc il faudra rajouter ces fichiers manuellement à la base de donnée de l'interface (via le formulaire d'upload présent sur cette même interface).

### Les codes Arduino

Le **dossier drivers** contient le code Arduino des cartes T-Rex et Razor. Ce code est à "téléverser" sur les cartes la première fois et en cas de "bug" assez violent et incompréhensible d'une carte. En effet il est arrivé que la T-Rex perde son adresse I2C pour une raison inconnue par exemple...
Petite précision :
* pour la T-Rex il s'agit du code du dossier TREX/TREX_controller
* pour la razor c'est le dossier Razor/Arduino/Razor_AHRS, et les codes du dossier Razor/Processing servent à la calibration du magnetomètre

### Le simulateur

Le **dossier simulateur** contient le simulateur (qui utilise PyGame et PyLygon)

### L'interface web
Le **dossier www** contient l'interface web. A sa racine se trouve un README détaillant la procédure d'installation.


## Utilisation du robot

### Le service daarrt
Une fois le script d'install exécuté et le robot redémarré, il y aura un service daarrt qui permet :
* **au démarrage :** d'inscrire le DAARRT dans la base SQL de l'interface web, démarrer le serveur de streaming et redémarrer apache2. En effet apache bug car le dossier contenant ses log est supprimé à chaque démarrage et il a besoin que ce dossier existe pour démarrer correctement. Ainsi le script crée ce dossier puis redémarre le service apache2.
* **à l'arrêt :** désinscription auprès de l'interface et arrêt du serveur de streaming (et de apache2)

Ce service s'utilise de la manière suivante :

    service daarrt {star|stop|restart}

### Executer un code sur le robot
Les codes sont dans le dossier /etc/daarrt/utils. De manière simple, pour utiliser le robot, on se place à l'aide d'un terminal dans ce dossier puis on lance python. Les commandes suivantes permettent d'utiliser les capteurs du robots :

    from daarrt import *
    d = Daarrt()    # Initialisation du robot
    d.getAngles()   # Renvoie le cap/assiette/roulis calculés par la Razor
    d.getStatus()   # Renvoie l'état de la carte T-Rex
    d.getSonars()   # Renvoie la valeurs donné par chaque Sonar
    d.motor(70, 70) # Allume les moteur (valeur (gaauche, droite) comprise entre -255 et 255)
    ... pour les autres commandes regarder le code du fichier daarrt.py
