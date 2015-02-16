<?php
    include 'connect.php';
    $db = connect();
    if (@$_GET["search"] != "") {
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
    elseif (isset($_GET["group"]) && @$_GET["action"] == "search") {
        // On échappe les caractères de la requête
        $search = $db->real_escape_string($_GET["group"]);

        $query = $db->query("SELECT id, id_ori, name, members, daarrt, date from groups g, (SELECT MAX(id) as maxi FROM `groups` GROUP BY id_ori) t WHERE g.id=t.maxi AND (g.name LIKE \"%{$search}%\" OR g.members LIKE \"%{$search}%\") ORDER BY g.name");
        $result = array();

        while ($row = $query->fetch_assoc()) {
            array_push($result, $row);
        }

        echo json_encode($result);
    }
    elseif (@$_GET["group"] != "" && @$_GET["action"] == "delete") {
        // On échappe les caractères de la requête
        $search = $db->real_escape_string($_GET["group"]);

        $query = $db->query("DELETE FROM groups WHERE id_ori=".$_GET['group']);

        if (!$query) {echo "ERROR";}
    }
    elseif (@$_GET["group"] == "new" && @$_GET["action"] == "create") {
        // On échappe les caractères de la requête
        $name = $db->real_escape_string($_POST["name"]);
        $daarrt = $db->real_escape_string($_POST["daarrt_list"]);
        $members = "";

        foreach ($_POST as $field => $value) {
            if (substr($field, 0, 5) == "user_" && $value !="") {
                if ($members == "") $members .= $db->real_escape_string($value);
                else $members .= ",".$db->real_escape_string($value);
            }
        }

        $error = 0;
        $query = $db->query("INSERT INTO groups (name, members, daarrt, date) VALUES (\"{$name}\", \"{$members}\", \"{$daarrt}\", NOW());");
        if (!$query) {$error++;}
        $query = $db->query("SELECT id FROM groups WHERE name=\"{$name}\" AND members=\"{$members}\" AND daarrt=\"{$daarrt}\" LIMIT 1;");
        if (!$query) {$error++;}
        $row = $query->fetch_assoc();
        $query = $db->query("UPDATE groups SET id_ori=".$row['id']." WHERE name=\"{$name}\" AND members=\"{$members}\" AND daarrt=\"{$daarrt}\" LIMIT 1;");
        if (!$query) {$error++;}

        $daarrts = explode(',', $daarrt);
        foreach ($daarrts as $id) {
            $db->query("UPDATE online SET groups=groups+1 WHERE id={$id} LIMIT 1;");
        }

        if ($error == 0) header("location:/index.php");
        else header("location:/index.php?error=createGroup&name={$name}");
    }
    elseif (@$_GET["group"] == $_COOKIE['group'] && @$_GET["action"] == "modify") {
        // On échappe les caractères de la requête
        $ori = $db->query("SELECT * FROM groups WHERE id_ori=".$_COOKIE['group']." ORDER BY id DESC LIMIT 1;");
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
?>
