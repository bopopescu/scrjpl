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
	<meta name="description" content="Base de donnée d'information sur les DAARRT">
	<meta name="author" content="Brian">

	<link rel="stylesheet" href="../res/css/styles.css">
	<link rel="stylesheet" href="../res/css/shell.css">
</head>

<body>
	<iframe class="mjpg-streamer" src="http://<?php echo $daarrt['address']; ?>:8090/?action=stream" width="650px" height="500px"></iframe>
</body>
</html>
