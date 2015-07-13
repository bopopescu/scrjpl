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
* `docx2txt` : permet la conversion de documents Word 201X en texte brut.

Pour les installer il suffit d'exécuter la commande :

`sudo apt-get install pdftotext odt2txt antiword docx2txt`

#### Python :
L'ensemble du projet est basé sur Python 2.7.8. Concernant l'interface, le seul module supplémentaire à installer est MySQLdb. Il peut s'installer par la commande :

`sudo apt-get install python-mysqldb`

### Configuration MySQL :

#### Installation de la base :
Pour mettre en place la structure de la base de données, on utilise le fichier `daarrt.sql` fournit.
Pour cela il suffit d'exécuter la commande suivate :

`mysql -u [user] -p [password] < daarrt.sql`

#### Configuration de la base SQL :
Il est nécéssaire de configurer la recherche *full-text* pour le moteur de recherche de documents. Pour cela ouvrir `/etc/mysql/my.cnf` avec un editeur comme nano ou gedit et insérer `ft_min_word_len = 3` dans la section `[mysqld]`.Cela permet d'effectuer la recherche sur les mot d'au moins 3 caractères.

### Configuration Apache :

#### Emplacement des fichers :
Les fichiers contenant le code du site peut être placé n'importe ou. L'ensemble du dossier doit cependant avoir les droits de lecture et d'éxécution pour tous les utilisateurs. Il est possible de faire un réglage plus fin par soucis de sécurité en faisant de l'utilisateur `www-data` (utilisé par apache) le proprietaire du dossier et en lui donnant les droits `rx`.

Le code de la partie suivante considère néanmoins que le dossier contenant les sites de trouve dans `/var/www/`. Il suffit cependant d'y placer un lien symbolique renvoyant vers le dossier.

A titre d'exemple, voici le résultat de la commande `ls -l /var/www/` pour que tout fonctionne bien (on remarquera que lors du développement, je ne m'étais pas embêté avec les droits, ce qui est mal) :

    brian@debian:~$ ls -l /var/www/
    total 4
    lrwxrwxrwx 1 root root   37 janv. 13 15:51 admin_scrjpl -> /home/brian/dev/git/scrjpl/www/admin/
    lrwxrwxrwx 1 root root   37 févr.  8 13:52 eleve_scrjpl -> /home/brian/dev/git/scrjpl/www/eleve/


#### Fichiers de configuration

##### Fichier /etc/apache2/sites-avaible/admin_scrjpl.conf

Ce fichier est la configuration apache du site `admin.scrjpl.fr`.

`/etc/apache2/sites-available/admin_scrjpl.conf`

    <VirtualHost *:80>
    	ServerName admin.scrjpl.fr

    	DocumentRoot /var/www/admin_scrjpl
    	Options +FollowSymLinks -SymLinksIfOwnerMatch

    	<Directory /var/www/admin_scrjpl>
            	Options Indexes FollowSymLinks
            	AllowOverride All

    		Order allow,deny
    		Allow from all
            	Require all granted

    		Satisfy Any
    	</Directory>

    	<Directory />
    	        Options FollowSymLinks
            	AllowOverride None
    	</Directory>

    	ErrorLog ${APACHE_LOG_DIR}/error.log
    	CustomLog ${APACHE_LOG_DIR}/access.log combined
    </VirtualHost>

##### Fichier /etc/apache2/sites-avaible/eleve_scrjpl.conf

Ce fichier est la configuration apache du site `eleve.scrjpl.fr`.

`/etc/apache2/sites-available/eleve_scrjpl.conf`

    <VirtualHost *:80>
    ServerName eleve.scrjpl.fr

    DocumentRoot /var/www/eleve_scrjpl
    Options +FollowSymLinks -SymLinksIfOwnerMatch

    <Directory /var/www/eleve_scrjpl>
            Options Indexes FollowSymLinks
            AllowOverride All

        Order allow,deny
        Allow from all
            Require all granted

        Satisfy Any
    </Directory>

    <Directory />
            Options FollowSymLinks
            AllowOverride None
    </Directory>

    ErrorLog ${APACHE_LOG_DIR}/error.log
    CustomLog ${APACHE_LOG_DIR}/access.log combined

    </VirtualHost>

#### Mise en ligne des sites

Il suffit de taper :

    sudo a2ensite admin_scrjpl eleve_scrjpl
    sudo service apache2 restart
