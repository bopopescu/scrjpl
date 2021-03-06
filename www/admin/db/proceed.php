<?php
    session_start();

    include 'connect.php';
    $db = connect();
    $db->query("SET NAMES 'utf8'");

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
                AGAINST(\"{$search}\" IN BOOLEAN MODE) {$searchOptions};");
            $result = array();

            while ($row = $query->fetch_assoc()) {
                array_push($result, $row);
                // foreach ($row as $key => $value) {
                //     $result[$key] = utf8_decode($value);
                // }
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
        elseif (isset($_GET["group"]) && @$_GET["action"] == "modify") {
            // On échappe les caractères de la requête
            $ori = $db->query("SELECT * FROM groups WHERE id_ori=".$_GET['group']." ORDER BY id DESC LIMIT 1;");
            $ori = $ori->fetch_assoc();

            $name = $db->real_escape_string($_POST["name"]);
            $daarrts = $db->real_escape_string($_POST["daarrt_list"]);

            if ($ori['daarrt'] != $daarrts) {
                $db->query("UPDATE online SET groups=groups-1 WHERE id IN (".$ori['daarrt'].")");
                $db->query("UPDATE online SET groups=groups+1 WHERE id IN ({$daarrts})");
            }

            $members = "";

            foreach ($_POST as $field => $value) {
                if (substr($field, 0, 5) == "user_" && $value !="") {
                    if ($members == "") $members .= $db->real_escape_string($value);
                    else $members .= ",".$db->real_escape_string($value);
                }
            }

            if ($ori['name'] != $name || $ori['daarrt'] != $daarrts || $ori['members'] != $members)
            $query = $db->query("INSERT INTO groups (id_ori, name, members, daarrt, date) VALUES (".$ori['id_ori'].", \"{$name}\", \"{$members}\", \"{$daarrts}\", NOW());");

            if ($query) header("location:/index.php");
            else header("location:/index.php?error=modifyGroup&id=".$ori['id_ori']);
        }
        elseif (@$_GET['daarrts'] == "update") {
            $daarrts = json_decode($_POST['daarrts']);
            $query = $db->query("SELECT * FROM online");

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
