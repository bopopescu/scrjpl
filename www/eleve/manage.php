<?php
    // session_start();
    // if (!$_SESSION['isRegistered']) {header("location: login.php");}
    if (!isset($_COOKIE['group'])) { header('location: ../index.php?error=selectGroup'); }
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
            <a href="index.php"><i class="navbar-icon navbar-icon-groups"></i>Groupes</a>
        </li>
        <li>
            <a href="groups/manage.php"><i class="navbar-icon navbar-icon-manage-grp"></i>Gérer le groupe</a>
        </li>
        <li>
            <a href="manage.php"><i class="navbar-icon navbar-icon-network"></i>Manager</a>
        </li>
        <li>
            <a href="td.php"><i class="navbar-icon navbar-icon-td"></i>Liste des TD</a>
        </li>
        <li>
            <a href="documentation.php"><i class="navbar-icon navbar-icon-doc"></i>Documentation</a>
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

        $daarrtUsed = $db->query("SELECT daarrt FROM groups WHERE id_ori=".$_COOKIE['group']." ORDER BY id DESC LIMIT 1");
        $daarrtUsed = $daarrtUsed->fetch_assoc();
        $res = $db->query("SELECT * FROM online WHERE id IN (".$daarrtUsed['daarrt'].") ORDER BY id ASC");
        $db->close();

        $elem = 1;
        while ($row = $res->fetch_assoc()) {
            echo "setTimeout(function () {
                insertDaarrt('".json_encode($row)."');
            }, {$elem} * 100);\n";
            $elem++;
        }

        if (@$_GET['offline'] == "true") {
            if (@$_GET['origin'] == "details")
                echo "insertBox(\"Impossible de récupérer les détails de ".$_GET['name'].", le DAARRT semble déconnecté\", \"error\");";
            if (@$_GET['origin'] == "shell")
                echo "insertBox(\"Impossible de se connecter au shell de ".$_GET['name'].", le DAARRT semble déconnecté\", \"error\");";
        }
    ?>
</script>
</html>
