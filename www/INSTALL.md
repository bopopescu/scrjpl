Instructions d'instalation
==========================

Le développement de l'interface s'est effectué sur Debian Testing (Jessie) et il est recommandé d'utiliser un système Linux pour une installation optimale.

Linux (Debian)
--------------

### Prérequis :

#### Système :
Certains paquets sont nécessaires au bon fonctionnement des scripts, notament pour l'extraction de texte à partir de documents Word, PDF, ODT, ... Ces paquets sont :

* `pdftotext` : permet la conversion de PDF en texte brut
* `odt2txt` : permet la conversion de documents OpenOffice en texte brut.
* `antiword` : permet la conversion de documents Word en texte brut.

Pour les installer il suffit d'exécuter la commande :

`sudo apt-get install pdftotext odt2txt antiword`

#### Python :
L'ensemble du projet est basé sur Python 2.7.8, certains modules supplémentaires ont été nécéssaires.

### Configuration MySQL :

#### Installation de la base :
Pour mettre en place la structure de la base de données, on utilise le fichier `daarrt.sql` fournit.
Pour cela il suffit d'exécuter la commande suivate :

`mysql -u [user] -p [password] < daarrt.sql`

**TODO :** Fichier SQL de structure

#### Configuration de la base :
Il est nécéssaire de configurer la recherche *full-text* pour le moteur de recherche de documents. Pour cela ouvrir `/etc/mysql/my.cnf` avec un editeur comme nano ou gedit et insérer `ft_min_word_len = 3` dans la section `[mysqld]`.Cela permet d'effectuer la recherche sur les mot d'au moins 3 caractères.
