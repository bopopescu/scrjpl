<!doctype html>
<html lang="fr">
<head>
    <meta charset="utf-8">

    <title>Choix d'un groupe</title>
    <meta name="description" content="Choix d'un groupe de travail.">
    <meta name="author" content="Brian">

    <link rel="stylesheet" href="res/css/styles.css">
    <link rel="stylesheet" href="res/css/home.css">
    <link rel="stylesheet" href="res/css/td.css">
    <script language="JavaScript" src="res/js/infobox.js"></script>
    <script language="JavaScript" src="res/js/itemBox.js"></script>
    <script language="JavaScript" src="res/js/home.js"></script>
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

        <div class="new-group">
            <i class="new-group-icon"></i>
            <br>Nouveau Groupe
        </div>

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

        $res = $db->query("SELECT id, id_ori, name, members, daarrt, date from groups g, (SELECT MAX(date) as maxi FROM `groups` GROUP BY id_ori) t WHERE g.date=t.maxi ORDER BY g.name");


        $elem = 0;
        while ($row = $res->fetch_assoc()) {
            echo "setTimeout(function () {
                insertGroup('".$db->real_escape_string(json_encode($row))."');
            }, ({$elem}) * 100);\n";
            $elem++;
        }
        $db->close();
    ?>
</script>
</html>
