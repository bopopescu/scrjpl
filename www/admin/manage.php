<?php

 ?>
<!doctype html>
<html lang="fr">
<head>
    <meta charset="utf-8">

    <title>Panneau de contrôle</title>
    <meta name="description" content="Panneau de contrôle des DAART">
    <meta name="author" content="Brian">

    <link rel="stylesheet" href="res/css/styles.css">
    <script language="javascript" src="res/js/infobox.js"></script>
    <script language="javascript" src="res/js/itemBox.js"></script>
</head>

<body onload="setBoxWrapperSize(3, 0.31)" onresize="setBoxWrapperSize(3, 0.31)">
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
        <div id="infobox-zone">
        </div>

        <div class="item-zone">
            <div class="item-zone-wrapper"></div>
        </div>
    </div>

</body>
<!-- Début de la partie de test -->
<script language="javascript">
    insertDaarrt(1, "1");
    insertDaarrt(2, 4);
    insertDaarrt(3, 1);
    insertDaarrt(4, 3);
    insertDaarrt(5, 2);
    setTimeout(function () {insertNewDaarrt(6, 0);}, 2000);
    insertBox('2', "ceci est un message d'avertissement", "warning");
    insertBox('3', "ceci est un message d'erreur", "error");
</script>
<!-- Fin de la partie de test -->
</html>
