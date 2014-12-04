<?php
    session_start();
    if (!$_SESSION['isRegistered']) {header("location: login.php");}
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
<script language="javascript">
    <?php
        include 'db/connect.php';
        $db = connect();

        $res = $db->query("SELECT * FROM active ORDER BY id ASC");
        $db->close();

        $elem = 1;
        while ($row = $res->fetch_assoc()) {
            echo "setTimeout(function () {
                insertDaarrt('".json_encode($row)."');
            }, {$elem} * 100);\n";
            $elem++;
        }
        echo "setTimeout(checkNewDaarrt, {$elem} * 100);";
    ?>
    // insertBox("ceci est un message d'avertissement", "warning");
    // insertBox("ceci est un message d'erreur", "error");
</script>
</html>
