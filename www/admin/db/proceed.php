<?php
    include 'connect.php';


    $db = connect();


    if (@$_GET["td"] == "modify") {

        // TODO : A améliorer !

        $query = $db->query("INSERT INTO td (id, title, subtitle, enonce, ressources, correction) VALUES
                    (".$db->real_escape_string($_POST['id']).",
                     \"".$db->real_escape_string($_POST['title'])."\",
                     \"".$db->real_escape_string($_POST['subtitle'])."\",
                     \"".$db->real_escape_string($_POST['eno'])."\",
                     \"".$db->real_escape_string($_POST['res'])."\",
                     \"".$db->real_escape_string($_POST['cor'])."\");");

        if ($query) {
            echo "0";
        }
        elseif (!$db->query("UPDATE td SET title=\"".$_POST['title']."\",
        subtitle=\"".$_POST['subtitle']."\",
        enonce=\"".$_POST['eno']."\",
        ressources=\"".$_POST['res']."\",
        correction=\"".$_POST['cor']."\" WHERE id=".$_POST['id'].";")) {
            echo "ERROR";
        }
    }
    elseif (@$_GET["search"] != "") {
        // On échappe les caractères de la requête
        $search = $db->real_escape_string($_GET["search"]);

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
            AGAINST(\"{$search}\") {$searchOptions};");
        $result = array();

        while ($row = $query->fetch_assoc()) {
            array_push($result, $row);
        }

        echo json_encode($result);
    }
    elseif (@$_GET["td"] == "delete") {
        $id = $db->real_escape_string($_POST["id"]);
        $query = $db->query("DELETE FROM td WHERE id={$id} LIMIT 1;");

        if (!$query) {
            echo "ERROR";
        }
    }
?>
