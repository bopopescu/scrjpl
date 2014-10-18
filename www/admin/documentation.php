<?php

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
    <script language="JavaScript" src="res/js/search.js"></script>
</head>

<body>
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
            <input class="search-input" type="text" placeholder="Rechercher"/>
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
                        <label for="td">
                            <input name="td" id="td" type="checkbox"/>
                            Inclure les TD
                        </label>
                    </td>
                    <td>
                    <label for="correction_td">
                        <input name="correction_td" id="correction_td" type="checkbox"/>
                        Inclure les corrections de TD
                    </label>
                    </td>
                </tr>
            </table>
        </div>
        <hr />

    </div>
</body>
</html>
