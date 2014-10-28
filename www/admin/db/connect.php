<?php
    /* Fonction de connexion à la base de donnée
     *
     * @return mysqli Connexion vers la base
     */
    function connect() {
        $mysqli = new mysqli("localhost", "root", "", "daarrt");

        if ($mysqli->connect_errno) {
            return $mysqli->connect_errno;
        }

        return $mysqli;
    }
?>
