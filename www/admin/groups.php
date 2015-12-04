<?php
    session_start();
    if (!$_SESSION['isRegistered']) {header("location: login.php");}
?>
<!doctype html>
<html lang="fr">
<head>
    <meta charset="utf-8">

    <title>Choix d'un groupe</title>
    <meta name="description" content="Choix d'un groupe de travail.">
    <meta name="author" content="Brian">

    <link rel="stylesheet" href="res/css/styles.css">
    <link rel="stylesheet" href="res/css/groups.css">
    <script language="JavaScript" src="res/js/infobox.js"></script>
    <script language="JavaScript" src="res/js/itemBox.js"></script>
    <script language="JavaScript" src="res/js/groups.js"></script>
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
        <div id="infobox-zone"></div>

        <div class="search-group">
            <i class="search-icon"></i>
            <input id="search_input" name="search_input" type="text" placeholder="Rechercher" oninput="searchGroup(this.value)"/>
        </div>

        <div class="item-zone">
            <div class="item-zone-wrapper"></div>
        </div>

    </div>

</body>

<script language="javascript">
    <?php
    include 'db/connect.php';
    $db = connect();

    $res = $db->query("SELECT g.id, g.id_ori, g.name, g.members, g.daarrt, g.date from groups g, (SELECT MAX(id) as maxi FROM `groups` GROUP BY id_ori) t WHERE g.id=t.maxi ORDER BY g.name");


    $elem = 0;
    while ($row = $res->fetch_assoc()) {
        echo "setTimeout(function () {
            insertGroup('".$db->real_escape_string(json_encode($row))."');
        }, ({$elem}) * 100);\n";
        if ($row['id_ori'] == @$_COOKIE['group']) {echo "setTimeout(function () {toggleGroup(".$_COOKIE['group'].");}, ({$elem}) * 100);\n";}
        $elem++;
    }
    $db->close();

    if (isset($_GET['error'])) {
        if (@$_GET['error'] == "createGroup")
        echo "insertBox(\"Impossible de créer le groupe ".$_GET['name'].".\", \"error\");";
        if (@$_GET['error'] == "selectGroup" && !isset($_COOKIE['group']))
        echo "insertBox(\"Veuillez choisir un groupe pour accéder à cette page.\", \"warning\");";
    }
    ?>
</script>
</html>
