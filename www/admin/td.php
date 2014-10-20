<?php

 ?>
<!doctype html>
<html lang="fr">
<head>
    <meta charset="utf-8">

    <title>Gestion des TD</title>
    <meta name="description" content="Gestion des TD">
    <meta name="author" content="Brian">

    <link rel="stylesheet" href="res/css/styles.css">
    <link rel="stylesheet" href="res/css/td.css">
    <script language="javascript" src="res/js/infobox.js"></script>
    <script language="javascript" src="res/js/itemBox.js"></script>
</head>

<body onload="setBoxWrapperSize()" onresize="setBoxWrapperSize()">
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
    insertTd(1, "Initiation", 1, 0, 1);
    setTimeout(function () {insertTd(2, "Sujet du TD 2", 1, 1, 1);}, 100);
    setTimeout(function () {insertTd(3, "Sujet du TD 3", 1, 1, 0);}, 200);
    setTimeout(function () {insertTd(4, "Sujet du TD 4", 1, 1, 0);}, 300);
    setTimeout(insertAddTdItem, 400);
</script>
<!-- Fin de la partie de test -->
</html>
