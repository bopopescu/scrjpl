<!doctype html>
<html lang="fr">
<head>
    <meta charset="utf-8">

    <title>Création d'un groupe</title>
    <meta name="description" content="Création d'un groupe de travail.">
    <meta name="author" content="Brian">

    <link rel="stylesheet" href="/res/css/styles.css">
    <link rel="stylesheet" href="/res/css/groups.css">
    <script language="JavaScript" src="/res/js/infobox.js"></script>
    <script language="JavaScript" src="/res/js/itemBox.js"></script>
    <script language="JavaScript" src="/res/js/groups.js"></script>
</head>

<body onload="setBoxWrapperSize()" onresize="setBoxWrapperSize()">
    <nav class="topbar">
        <div class="topbar-title">DAARRT Manager</div>
    </nav>
    <ul class="navbar">
        <li>
            <a href="../index.php"><i class="navbar-icon navbar-icon-groups"></i>Groupes</a>
        </li>
        <li>
            <a href="manage.php"><i class="navbar-icon navbar-icon-manage-grp"></i>Gérer le groupe</a>
        </li>
        <li>
            <a href="../manage.php"><i class="navbar-icon navbar-icon-network"></i>Manager</a>
        </li>
        <li>
            <a href="../td.php"><i class="navbar-icon navbar-icon-td"></i>Liste des TD</a>
        </li>
        <li>
            <a href="../documentation.php"><i class="navbar-icon navbar-icon-doc"></i>Documentation</a>
        </li>
    </ul>
    <div class="wrapper">
        <div id="infobox-zone"></div>
        <table class="two-columns">
            <tr>
                <td class="left-column">
                    <form method="post" action="../db/proceed.php?group=new&action=create">
                        <label for="name">
                            <p class="section-title">Nom du groupe :</p>
                            <input id="name" name="name" type="text" placeholder="Entrez le nom du groupe" required/>
                        </label>

                        <p class="section-title">Membres :</p>
                        <input id="user_1" name="user_1" type="text" placeholder="Nom du 1er membre" required/><br>
                        <input id="user_2" name="user_2" type="text" placeholder="Nom du 2eme membre"/><br>
                        <i class="add-icon" onclick="javascript:addMemberInput()"></i>

                        <p class="section-title">DAARRT utilisé(s) :</p>
                        <input id="daarrt_names" name="daarrt_names" type="text" placeholder="Cliquez sur les DAARRT à droite" disabled/>
                        <input id="daarrt_list" name="daarrt_list" type="hidden"/>
                        <br>
                        <button class="submit-button" value="submit">Valider</button>
                    </td>
                </form>

                <td class="right-column">
                    <div class="item-zone">
                        <div class="item-zone-wrapper"></div>
                    </div>
                </td>
            </tr>
        </table>

    </div>

</body>

<script language="javascript">
    <?php
    include '../db/connect.php';
    $db = connect();

    $res = $db->query("SELECT * FROM active ORDER BY id ASC");
    $db->close();

    $elem = 1;
    while ($row = $res->fetch_assoc()) {
        echo "setTimeout(function () {
            insertSelectableDaarrt('".json_encode($row)."');
        }, {$elem} * 100);\n";
        $elem++;
    }
    echo "setTimeout(checkNewDaarrt, {$elem} * 100);";
    ?>
</script>
</html>
