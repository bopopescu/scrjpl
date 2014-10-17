<?php

 ?>
<!doctype html>
<html lang="fr">
<head>
    <meta charset="utf-8">

    <title>Panneau de contrôle</title>
    <meta name="description" content="Panneau de contrôle des JOG">
    <meta name="author" content="Brian">

    <link rel="stylesheet" href="res/css/styles.css">
    <script src="res/js/infobox.js"></script>
</head>

<body>
    <nav class="topbar">
        <div class="topbar-title">Bienvenue sur le DAARRT Manager</div>
    </nav>
    <ul class="navbar">
        <li>
            <a href="index.php"><i class="navbar-icon navbar-icon-dashboard"></i>Dashboard</a>
        </li>
        <li>
            <a href="manage.php"><i class="navbar-icon navbar-icon-network"></i>Manager</a>
        </li>
        <li>
            <a href="documentation.php"><i class="navbar-icon navbar-icon-doc"></i>Documentation</a>
        </li>
        <li>
            <a href="logout.php"><i class="navbar-icon navbar-icon-logout"></i>Déconnexion</a>
        </li>
    </ul>
    <div class="wrapper">
        <div id="infobox-zone">
            <div id="1" class="infobox infobox-info">
                <i class="infobox-icon"></i>
                Info infobox
                <a href="javascript:closeBox('1')"><i class="infobox-close-icon"></i></a>
            </div>
            <div id="2" class="infobox infobox-warning">
                <i class="infobox-icon"></i>
                Warning infobox
                <a href="javascript:closeBox('2')"><i class="infobox-close-icon"></i></a>
            </div>
            <div id="3" class="infobox infobox-error">
                <i class="infobox-icon"></i>
                Error infobox
                <a href="javascript:closeBox('3')"><i class="infobox-close-icon"></i></a>
            </div>
        </div>
    </div>

</body>
</html>
