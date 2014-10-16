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
</head>

<body>
    <nav class="topbar">
        <div class="topbar-title">Bienvenue sur le DART Manager</div>
    </nav>
    <ul class="navbar">
        <li>
            <a href="index.php"><i class="navbar-icon navbar-icon-dashboard"></i>Dashboard</a>
        </li>
        <li>
            <a href="index.php"><i class="navbar-icon navbar-icon-network"></i>Manager</a>
        </li>
        <li>
            <a href="docu.php"><i class="navbar-icon navbar-icon-doc"></i>Documentation</a>
        </li>
        <li>
            <a href="logout.php"><i class="navbar-icon navbar-icon-logout"></i>Déconnexion</a>
        </li>
    </ul>
    <div class="wrapper">
        <div class="panel panel-blue">
            <div class="panel-container">
                <div class="panel-top">
                    <i class="panel-top-icon"></i>
                </div>
                <a href="detail.php">
                    <div class="panel-bottom">Détails<i class="panel-detail-icon"></i></div>
                </a>
            </div>
        </div>
        <div class="panel panel-red">
            <div class="panel-container">
                <div class="panel-top">
                    <i class="panel-top-icon"></i>
                </div>
                <a href="detail.php">
                    <div class="panel-bottom">Détails<i class="panel-detail-icon"></i></div>
                </a>
            </div>
        </div>
        <div class="panel panel-green">
            <div class="panel-container">
                <div class="panel-top">
                    <i class="panel-top-icon"></i>
                </div>
                <a href="detail.php">
                    <div class="panel-bottom">Détails<i class="panel-detail-icon"></i></div>
                </a>
            </div>
        </div>
        <div class="panel panel-yellow">
            <div class="panel-container">
                <div class="panel-top">
                    <i class="panel-top-icon"></i>
                </div>
                <a href="detail.php">
                    <div class="panel-bottom">Détails<i class="panel-detail-icon"></i></div>
                </a>
            </div>
        </div>
    </div>
    <!-- <script src="js/scripts.js"></script> -->
</body>
</html>
