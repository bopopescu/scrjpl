<?php
    session_start();
    if (@$_SESSION['isRegistered']) {header("location: index.php");}
 ?>
<!doctype html>
<html lang="fr">
<head>
    <meta charset="utf-8">

    <title>Authentification</title>
    <meta name="description" content="Base de donnée d'information sur les DAARRT">
    <meta name="author" content="Brian">

    <link rel="stylesheet" href="res/css/styles.css">
    <link rel="stylesheet" href="res/css/login.css">
    <script language="javascript" src="res/js/login.js"></script>
</head>

<body onload="resize()" onresize="fireResize()">
    <nav class="topbar">
        <div class="topbar-title">DAARRT Manager</div>
    </nav>
    <div id="login_wrapper">
        <div id="login_box">
            <i class="login-icon<?php if (@$_SESSION['try'] >= 1) echo " auth_fail"; ?>"></i>
            <i class="login-icon<?php if (@$_SESSION['try'] >= 2) echo " auth_fail"; ?>"></i>
            <i class="login-icon<?php if (@$_SESSION['try'] >= 3) echo " auth_fail"; ?>"></i>
            <i class="login-icon<?php if (@$_SESSION['try'] >= 4) echo " auth_fail"; ?>"></i>
            <form action="db/proceed.php" method="POST">
                <?php
                    if (isset($_SESSION['fail_start'])) {
                        if ($_SESSION['fail_start'] + 300 <= time()) {
                            unset($_SESSION['fail_start'], $_SESSION['try']);
                            header("location: login.php");
                        }
                        else {
                            $wait = round(($_SESSION['fail_start'] + 300 - time())/60);
                            echo "<input id=\"password\" name=\"password\" type=\"text\" placeholder=\"Password\" value=\"Patientez {$wait} minutes\" disabled/>";
                        }
                    }
                    else {
                        echo '<input id="password" name="password" type="password" placeholder="Password" autofocus/>';
                    }
                ?>
            </form>
        </div>
    </div>
</body>
</html>
