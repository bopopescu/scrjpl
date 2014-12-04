<?php
	session_start();
	if (!$_SESSION['isRegistered']) {header("location: ../login.php");}
?>
<!doctype html>
<html lang="fr">
<head>
	<meta charset="utf-8">

	<title>Documentation des DAARRT</title>
	<meta name="description" content="Base de donnée d'information sur les DAARRT">
	<meta name="author" content="Brian">

	<link rel="stylesheet" href="../res/css/styles.css">
</head>

<body onkeypress="if (event.keyCode == 13) search()" >
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
	<div class="wrapper" style="overflow:hidden">
		<embed src="webcam.asx" height="370" width="400">
	</div>
</body>
</html>
