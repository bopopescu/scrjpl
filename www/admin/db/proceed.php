<?php
    include 'connect.php';


    $db = connect();

    if (@$_GET["td"] == "modify") {
        $query = $db->query("INSERT INTO td (id, title, subtitle) VALUES
                    (".mysql_real_escape_string($_POST['id']).",
                     \"".mysql_real_escape_string($_POST['title'])."\",
                    \"".mysql_real_escape_string($_POST['subtitle'])."\");");

        if ($query) {
            echo "0";
        }
        elseif (!$db->query("UPDATE td SET title=\"".$_POST['title']."\",
        subtitle=\"".$_POST['subtitle']."\" WHERE id=".$_POST['id'].";")) {
            echo "ERROR";
        }
    }
    elseif (@$_GET["search"] != "") {
        $search = mysql_real_escape_string($_GET["search"]);
        $query = $db->query("SELECT * FROM documents WHERE title LIKE \"%{$search}%\"
            OR subtitle LIKE \"%{$search}%\" OR tags LIKE \"%{$search}%\"
            OR raw_data LIKE \"%{$search}%\"
            ORDER BY title DESC;");

        $result = array();

        while ($row = $query->fetch_assoc()) {
            array_push($result, $row);
        }

        echo json_encode($result);
    }
    elseif (@$_GET["td"] == "delete") {
        $id = mysql_real_escape_string($_POST["id"]);
        $query = $db->query("DELETE FROM td WHERE id={$id} LIMIT 1;");

        if (!$query) {
            echo "ERROR";
        }
    }
?>
