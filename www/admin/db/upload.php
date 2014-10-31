<?php
    if ($_FILES['document']['error'] == 0) {
        include 'connect.php';
        $db = connect();

        $md5 = md5_file($_FILES['document']['tmp_name']);
        $name = "{$md5}_".$_FILES['document']['name'];
        $path = $db->real_escape_string("documentation/{$name}");

        move_uploaded_file($_FILES['document']['tmp_name'], "../documentation/{$name}");
        $text = shell_exec("\"../scripts/file2txt.py\" \"".getcwd()."\\..\\".$path."\"");

        $title = $db->real_escape_string($_POST['title']);
        $subtitle = $db->real_escape_string($_POST['subtitle']);
        $type = $db->real_escape_string($_POST['type']);
        $tags = $db->real_escape_string($_POST['tags']);
        $path = 'http://'.$_SERVER['SERVER_NAME']."".dirname(dirname($_SERVER["REQUEST_URI"]))."/".$path;
        $text = $db->real_escape_string($text);

        $db->query("SET NAMES UTF8");

        $q = $db->query("INSERT INTO documents (title, subtitle, type, tags, path, raw_data)
        VALUES (\"{$title}\", \"{$subtitle}\", \"{$type}\", \"{$tags}\",
        \"{$path}\", \"{$text}\")");

        if (!$text) {
            header("location: ../documentation.php?err=parser");
        }
        else if (!$q) {
            header("location: ../documentation.php?err=db");
        }
        else {
            header("location: ../documentation.php");
        }
    }


?>
