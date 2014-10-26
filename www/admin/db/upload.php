<?php
    include 'connect.php';

    if ($_FILES['document']['error'] == 0) {
        include('class.pdf2text.php');

        $path = mysql_real_escape_string("../documentation/".$_POST['title'].".pdf");
        move_uploaded_file($_FILES['document']['tmp_name'], "../documentation/".$_POST['title'].".pdf");
        $text = shell_exec("pdf2txt.py ".getcwd()."\\".$path);


        $db = connect();
        $title = mysql_real_escape_string($_POST['title']);
        $subtitle = mysql_real_escape_string($_POST['subtitle']);
        $type = mysql_real_escape_string($_POST['type']);
        $tags = "";
        $text = mysql_real_escape_string($text);

        $db->query("INSERT INTO documents (title, subtitle, type, tags, path, raw_data)
        VALUES (\"{$title}\", \"{$subtitle}\", \"{$type}\", \"{$tags}\",
        \"{$type}\", \"{$text}\")");

    }


?>
