<?php
    session_start();
    if (!$_SESSION['isRegistered']) {header("location: login.php");}
 ?>
<!doctype html>
<html lang="fr">
<head>
    <meta charset="utf-8">

    <title>Documentation des DAARRT</title>
    <meta name="description" content="Base de donnée d'information sur les DAARRT">
    <meta name="author" content="Brian">

    <link rel="stylesheet" href="res/css/styles.css">
    <link rel="stylesheet" href="res/css/search.css">
    <script language="javascript" src="res/js/konami.js"></script>
    <script language="JavaScript" src="res/js/infobox.js"></script>
    <script language="JavaScript" src="res/js/itemBox.js"></script>
    <script language="JavaScript" src="res/js/search.js"></script>
</head>

<body onkeypress="if (event.keyCode == 13) search()">
    <nav class="topbar">
        <div class="topbar-title">DAARRT Manager</div>
    </nav>
    <ul class="navbar">
        <li>
            <a href="index.php"><i class="navbar-icon navbar-icon-dashboard"></i>Dashboard</a>
        </li>
        <li>
            <a href="manage.php"><i class="navbar-icon navbar-icon-network"></i>Manager</a>
        </li>
        <li>
            <a href="groups.php"><i class="navbar-icon navbar-icon-groups"></i>Groupes</a>
        </li>
        <li>
            <a href="td.php"><i class="navbar-icon navbar-icon-td"></i>Gestion des TD</a>
        </li>
        <li>
            <a href="documentation.php"><i class="navbar-icon navbar-icon-doc"></i>Documentation</a>
        </li>
        <li>
            <a href="logout.php"><i class="navbar-icon navbar-icon-logout"></i>Déconnexion</a>
        </li>
    </ul>
    <div class="wrapper">
        <div id="search-form">
            <input id="search_input" type="text" placeholder="Rechercher" autofocus/>
            <a href="javascript:search()"><i class="search-icon"></i></a>
            <a href="javascript:showSearchOptions()"><i class="search-icon-settings"></i></a>

            <p id="search-options-title" class="section-title">Options de recherche :</p>
            <table id="advanced-search-options">
                <tr>
                    <td>
                        <label for="datasheet">
                            <input name="datasheet" id="datasheet" type="checkbox" checked/>
                            Inclure les datasheets
                        </label>
                    </td>
                    <td>
                        <label for="wiki">
                            <input name="wiki" id="wiki" type="checkbox" checked/>
                            Inclure le wiki
                        </label>
                    </td>
                    <td>
                        <label for="tuto">
                            <input name="tuto" id="tuto" type="checkbox" checked/>
                            Inclure les tutoriels
                        </label>
                    </td>
                </tr>
            </table>
            <p id="search-syntax-title" class="section-title">Synthaxe de recherche :</p>
            <table id="search-syntax-help">
                <tr>
                    <td>
                        <dd><b>+ :</b> un plus placé devant un mot indique que celui-ci doit être présent dans chaque résultat retourné.</dd>
                    </td>
                    <td>
                        <dd><b>- :</b> un moins placé devant un mot indique que celui-ci doit être présent dans aucun des résultats retournés.</dd>
                    </td>
                </tr>
                <tr>
                    <td>
                        <dd><b>< > :</b> change la contribution d'un mot à la pertinence du résultat final. L'opérateur > accroît la contribution et l'opérateur < la diminue.</dd>
                    </td>
                    <td>
                        <dd><b>( ) :</b> les parenthèses permettent de regrouper des mots en sous-expressions. Les groupes de parenthèses peuvent être imbriquées.</dd>
                    </td>
                </tr>
                <tr>
                    <td>
                        <dd><b>~ :</b> le tilde, placé devant un mot, est un opérateur de négation permettant de diminuer la pertinence (et donc le classement) d'un résultat contenant ce mot.</dd>
                    </td>
                    <td>
                        <dd><b>* :</b> opérateur de troncature. Placé à la fin d'un mot il permet de chercher tous les mots ayant le même préfix.</dd>
                    </td>
                </tr>
                <tr>
                    <td>
                        <dd><b>" :</b> le tilde, placé devant un mot, est un opérateur de négation permettant de diminuer la pertinence (et donc le classement) d'un résultat contenant ce mot.</dd>
                    </td>
                    <td></td>
                </tr>
            </table>
        </div>
        <hr />
        <div id="infobox-zone"></div>
        <div id="search_results" class="item-zone">
            <div class="item-zone-wrapper"></div>
        </div>

    </div>
    <script language="JavaScript">
        insertNewDocButton();
        <?php
            if (@$_GET['err'] == "db")
                echo "insertBox(\"Une erreur est survenue lors de l'ajout du document à la base de données.\", \"error\");";
            else if (@$_GET['err'] == "parser")
                echo "insertBox(\"Impossible d'extraire le texte de ce document ! Son contenu ne sera pas indexé.\", \"warning\");";
        ?>
    </script>
</body>
</html>
