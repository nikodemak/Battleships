<?php
session_abort();
require("common.php");
function pairPlayers() {
    session_id("waiting");
    session_start();
    $waiting =& $_SESSION["waiting"];
    session_commit();
    session_id(session_create_id());
    if($waiting && $waiting != "") {
        session_start();
        $_SESSION["opponent"] = $waiting;
        setInSession($waiting, "opponent", session_id());
        //setInSession($waiting, "turn", true);
        setInSession("waiting", "waiting", "");
    } else {
        session_start();
        if (isset($_SESSION["opponent"]) && $_SESSION["opponent"] != "waiting") {
            
        } else {
            $_SESSION["opponent"] = "waiting";
            setInSession("waiting", "waiting", session_id());
        }
    }
}

pairPlayers();
$_SESSION["turn"] = false;
$_SESSION["board"] = [];
for ($i=0; $i < 10; $i++) {
    $_SESSION["board"][$i] = [];
    for ($j=0; $j < 10; $j++) { 
        $_SESSION["board"][$i][$j] = 0;
    }
}
$_SESSION["eboard"] = [];
for ($i=0; $i < 10; $i++) {
    $_SESSION["eboard"][$i] = [];
    for ($j=0; $j < 10; $j++) { 
        $_SESSION["eboard"][$i][$j] = 0;
    }
}
$_SESSION["score"] = 0;
$_SESSION["ships"] = [];

?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport">
    <title>Battleships</title>
    <link rel="stylesheet" href="style.css">
    <script src="https://pixijs.download/release/pixi.js"></script>
</head>
<body>
    <script src="game.js"></script>
</body>
</html>