<?php
    function connect() {
        $mysqli = new mysqli("localhost", "root", "", "daarrt");
        
        if ($mysqli->connect_errno) {
            return $mysqli->connect_errno;
        }

        return $mysqli;
    }
?>
