<?php
	session_start();
	if (!$_SESSION['isRegistered']) {header("location: ../login.php");}
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

	<title>Console de <?php echo $daarrt['name']; ?></title>
	<meta name="description" content="Base de donnée d'information sur les DAARRT">
	<meta name="author" content="Brian">

	<link rel="stylesheet" href="../res/css/styles.css">
	<link rel="stylesheet" href="../res/css/shell.css">
	<script language="javascript">
		function exportShell(url, title, w, h) {
			var left = (screen.width/2)-(w/2);
			var top = (screen.height/2)-(h/2);
			window.open(url, title, 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, copyhistory=no, width='+w+', height='+h+', top='+top+', left='+left);
			document.location = "../manage.php";
		}
	</script>
	<script language="javascript" src="../res/js/konami.js"></script>
</head>

<body>
	<nav class="topbar">
		<div class="topbar-title">DAARRT Manager

		</div>
	</nav>
	<a href="javascript:exportShell('http://
	<?php echo $daarrt['address']; ?>/shell','shell_<?php echo $daarrt['id']; ?>
	', 900, 400);"><i class="export-icon"></i></a>

	<ul class="navbar">
		<li>
			<a href="../index.php"><i class="navbar-icon navbar-icon-dashboard"></i>Dashboard</a>
		</li>
		<li>
			<a href="../manage.php"><i class="navbar-icon navbar-icon-network"></i>Manager</a>
		</li>
		<li>
			<a href="../groups.php"><i class="navbar-icon navbar-icon-groups"></i>Groupes</a>
		</li>
		<li>
			<a href="../td.php"><i class="navbar-icon navbar-icon-td"></i>Gestion des TD</a>
		</li>
		<li>
			<a href="../documentation.php"><i class="navbar-icon navbar-icon-doc"></i>Documentation</a>
		</li>
		<li>
			<a href="../logout.php"><i class="navbar-icon navbar-icon-logout"></i>Déconnexion</a>
		</li>
	</ul>
	<div class="console">
		<iframe src="http://<?php echo $daarrt['address']; ?>/shell" width="100%" height="100%"></iframe>
	</div>
</body>
</html>
