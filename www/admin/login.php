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
            <i class="login-icon<?php if (@$_GET['auth'] == "fail") echo " auth_fail"; ?>"></i>
            <form action="db/proceed.php" method="POST">
                <input id="password" name="password" type="password" placeholder="Password" autofocus/>
            </form>
        </div>
    </div>
</body>
</html>
