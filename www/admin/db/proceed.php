<?php
    session_start();

    include 'connect.php';
    $db = connect();

    if (isset($_POST['password']) && !isset($_SESSION['fail_start'])) {
        $pass = $db->query("SELECT value FROM config WHERE var=\"password\" LIMIT 1;")->fetch_assoc();

        if (sha1($_POST['password']) == $pass['value']) {
            $_SESSION['isRegistered'] = true;
            header("location: ../index.php");
        }
        else {
            if (!isset($_SESSION['try'])) $_SESSION['try'] = 0;
            $_SESSION['try']++;
            if ($_SESSION['try'] == 4) { $_SESSION['fail_start'] = time(); }
            header("location: ../login.php?auth=fail");
        }
    }
    elseif (isset($_POST['password']) && isset($_SESSION['fail_start'])) {
        header("location: ../login.php?auth=fail");
    }
    elseif (!$_SESSION['isRegistered']) {header("location: login.php");}
    else {
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
        elseif (@$_GET['daarrts'] == "update") {
            $daarrts = json_decode($_POST['daarrts']);
            $query = $db->query("SELECT * FROM active");

            $global = array();
            $toAdd = array();
            while ($row = $query->fetch_assoc()) {
                if (!in_array($row['id'], $daarrts))
                    array_push($toAdd, $row);

                array_push($global, $row['id']);
            }

            $toRemove = array();
            foreach ($daarrts as $id) {
                if (!in_array($id, $global)) {
                    array_push($toRemove, $id);
                }
            }

            echo json_encode($toAdd)."||".json_encode($toRemove);
        }
    }
?>
