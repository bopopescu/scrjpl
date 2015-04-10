<?php
	session_start();
	if (!$_SESSION['isRegistered']) {header("location: ../login.php");}
    else {
		include '../db/connect.php';

		$db = connect();
		$daarrt = $db->query("SELECT * FROM online WHERE id=".$_GET['id'])->fetch_assoc();
		$db->close();
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
</head>

<body>
    <embed type="application/x-vlc-plugin" pluginspage="http://www.videolan.org"  width="100%"  height="100%" id="vlc" loop="yes" autoplay="yes" target="http://<?php echo $daarrt['address']; ?>:8080/webcam.wmv" style="border: none"></embed>
</body>
</html>
