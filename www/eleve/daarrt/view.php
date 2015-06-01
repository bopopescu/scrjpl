<?php
	if (!isset($_COOKIE['group'])) {header("location: ../index.php");}
	else {
		include '../db/connect.php';

		$db = connect();
		$daarrt = $db->query("SELECT * FROM online WHERE id=".$_GET['id'])->fetch_assoc();
		$db->close();

		$alive = json_decode(shell_exec("../scripts/daarrt.py ".$daarrt['id']), true);
		$alive = $alive[$daarrt['id']];
		if ($alive == "offline") header("location: ../manage.php?offline=true&origin=shell&name=".$daarrt['name']);
	}
?>
<!doctype html>
<html lang="fr">
<head>
	<meta charset="utf-8">


	<title>Webcam de <?php echo $daarrt['name']; ?></title>
	<meta name="description" content="Interface de gestion des DAARRT">
	<meta name="author" content="Brian">

	<link rel="stylesheet" href="../res/css/styles.css">
	<link rel="stylesheet" href="../res/css/shell.css">
	<script language="javascript" src="../res/js/exportWindow.js"></script>
</head>

<body>
	<nav class="topbar">
		<div class="topbar-title">DAARRT Manager</div>
	</nav>
	<a href="javascript:exportShell('stream.php?id=<?php echo $daarrt['id']; ?>','webcam_<?php echo $daarrt['id']; ?>
	', 600, 600);"><i class="export-icon"></i></a>

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
		<iframe class="mjpg-streamer" src="http://<?php echo $daarrt['address']; ?>:8090/?action=stream" width="650px" height="500px"></iframe>
	</div>
</body>
</html>
