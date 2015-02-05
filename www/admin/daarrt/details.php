<?php
	session_start();
	if (!$_SESSION['isRegistered']) {header("location: ../login.php");}
	else {
		include '../db/connect.php';

		$db = connect();
		$daarrt = $db->query("SELECT * FROM active WHERE id=".$_GET['id'])->fetch_assoc();
		$db->close();
	}
?>
<!doctype html>
<html lang="fr">
<head>
	<meta charset="utf-8">

	<title>Détails de <?php echo $daarrt['name']; ?></title>
	<meta name="description" content="Base de donnée d'information sur les DAARRT">
	<meta name="author" content="Brian">

	<link rel="stylesheet" href="../res/css/styles.css">
	<script language="javascript" src="res/js/konami.js"></script>
</head>

<body>
	<nav class="topbar">
		<div class="topbar-title">DAARRT Manager

		</div>
	</nav>

	<ul class="navbar">
		<li>
			<a href="../index.php"><i class="navbar-icon navbar-icon-dashboard"></i>Dashboard</a>
		</li>
		<li>
			<a href="../manage.php"><i class="navbar-icon navbar-icon-network"></i>Manager</a>
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
	<div class="wrapper">
		<?php
			$details = json_decode(stripslashes(shell_exec("../scripts/daarrt.py ".$daarrt['id'])), TRUE);

			$details = $details[$daarrt['id']];
			//if ($details == "offline") header("location: ../manage.php?offline=true&origin=details&name=".$daarrt['name']);
			foreach ($details as $section => $params) {
				echo "<p class='section-title'>".ucfirst($section)." :</p>";
				foreach ($params as $name => $value) {
					echo "<dd>".ucfirst($name)." : {$value}</dd>";
				}
			}

		?>
	</div>
</body>
</html>
