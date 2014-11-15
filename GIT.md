INSTALLER GIT
=============
GitHub est un outil de travail en ligne permettant de mettre en commun des modifications effectuées par plusieurs personnes sur un projet donné.

GitHub pour Windows: https://windows.github.com
GitHub pour Mac : https://mac.github.com
Git pour Linux - Solaris : http://git-scm.com

CONFIGURATION DES OUTILS
========================
Configurer les informations de l'utilisateur pour tous les dépôts locaux

**git config --global user.name "[nom]"**  
Définir le nom que vous voulez associer à toutes vos opérations de commit

**git config --global user.email "[adresse email]"**  
Définir l'email que vous voulez associer à toutes vos opérations de commit

**git config --global http.proxy http://192.168.1.17:8080**
Définir le proxy de l’école à utiliser

**git config --global –unset http.proxy**  
Réinitialiser la valeur du proxy à utiliser

CRÉER/CLONER DES DÉPÔTS
=======================
Démarrer un nouveau dépôt ou en obtenir un depuis une URL existante

**git init [nom-du-projet]**  
Créer un dépôt local à partir du nom spécifié

**git clone [url]**  
Télécharger un projet et tout son historique de versions (faire un clone en local)

EFFECTUER DES CHANGEMENTS
=========================
Consulter les modifications et effectuer une opération de commit

**git status**  
Lister tous les nouveaux fichiers et les fichiers modifiés à commiter

**git add [fichier]**  
Ajouter un instantané du fichier, en préparation pour le suivi de version

**git reset [fichier]**  
Enlever le fichier de l'index, mais conserve son contenu

**git diff**  
Montrer les modifications de fichier qui ne sont pas encore indexées

**git commit -m "[message descriptif]"**  
Enregistrer des instantanés de fichiers de façon permanente dans l'historique des versions

**git commit -a -m "[message descriptif]"**  
Enregistrer des instantanés de tous les fichiers modifiés de façon permanente dans l'historique des versions

GROUPER DES CHANGEMENTS
=======================
Nommer une série de commits et combiner les résultats de travaux terminés

**git branch**  
Lister toutes les branches locales dans le dépôt courant

**git branch [nom-de-branche]**  
Créer une nouvelle branche

**git checkout [nom-de-branche]**  
Basculer sur la branche spécifiée et mettre à jour le répertoire de travail

**git merge [nom-de-branche]**  
Combiner dans la branche courante l'historique de la branche spécifiée

**git branch -d [nom-de-branche]**  
Supprimer la branche spécifiée

VÉRIFIER L'HISTORIQUE DES VERSIONS
==================================
Suivre et inspecter l'évolution des fichiers du projet

**git log**  
Montrer l'historique des versions pour la branche courante

**git log --follow [fichier]**  
Montrer l'historique des versions, y compris les actions de renommage, pour le fichier spécifié

**git diff [premiere-branche]...[deuxieme-branche]**  
Montrer les différences de contenu entre deux branches

**git show [commit]**  
Montrer les modifications de métadonnées et de contenu inclues dans le commit spécifié

DÉFAIRE DES COMMITS
===================
Corriger des erreurs et gérer l'historique des corrections

**git reset [commit]**  
Annuler tous les commits après [commit], en conservant les modifications localement

**git reset --hard [commit]**  
Supprimer tout l'historique et les modifications effectuées après le commit spécifié

SYNCHRONISER LES CHANGEMENTS
============================
Référencer un dépôt distant et synchroniser l'historique de versions

**git fetch [nom-de-depot]**  
Récupérer tout l'historique du dépôt nommé (mais ne pas faire la fusion)

**git merge [nom-de-depot]/[branche]**  
Fusionner la branche du dépôt dans la branche locale courante

**git push [vers --> alias d'un remote] [branche locale]**  
Envoyer tous les commits de la branche locale vers un dépôt GitHub distant

**git pull [alias d'un remote] [sur --> branche locale]**  
Récupérer tout l'historique du dépôt distant et fusionner les modifications avec la branche locale

**git remote add [mon_alias] https://github.com/[mon_login]/spid.git**  
Ajouter un dépôt distant à partir duquel on pourra faire des pull et des push. L'alias permet de le désigner facilement.
