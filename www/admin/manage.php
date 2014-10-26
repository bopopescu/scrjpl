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
        <div id="infobox-zone"></div>

        <div class="item-zone">
            <div class="item-zone-wrapper"></div>
        </div>
    </div>

</body>
<!-- Début de la partie de test -->
<script language="javascript">
    <?php
        $elem = 4;
        for ($i = 1 ; $i <= $elem ; $i++) {
            echo "setTimeout(function () {
                insertDaarrt({$i}, ".rand(0, 5).")}, ({$i}-1) * 100);\n";
        }
        $elem++;
    echo "setTimeout(function () {insertNewDaarrt({$elem}, ".rand(0, 5).");}, 2000);";
    ?>
    insertBox('2', "ceci est un message d'avertissement", "warning");
    insertBox('3', "ceci est un message d'erreur", "error");
</script>
<!-- Fin de la partie de test -->
</html>
