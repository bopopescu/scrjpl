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
        // On échappe les caractères de la requête
        $search = mysql_real_escape_string($_GET["search"]);

        if ($_GET['datasheet'] == "true" && $_GET['wiki'] == "true" && $_GET['tuto'] == "true") {
            $searchOptions = "";
        }
        else if ($_GET['datasheet'] == "false" && $_GET['wiki'] == "false" && $_GET['tuto'] == "false"){
            $searchOptions = "";
        }
        else {
            $searchOptions = " AND (";
            $el = array();
            if ($_GET['datasheet'] == "true")
                array_push($el, "type='datasheet'");
            if ($_GET['wiki'] == "true")
                array_push($el, "type='wiki'");
            if ($_GET['tuto'] == "true")
                array_push($el, "type='tuto'");

            $searchOptions = $searchOptions."".implode(" OR ", $el).")";
        }


        $query = $db->query("SELECT id, title, subtitle, type, tags, path
            FROM documents WHERE MATCH(title, subtitle, tags, raw_data)
            AGAINST(\"$search\") {$searchOptions};");
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
