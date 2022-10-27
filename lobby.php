<?php
echo(" ");
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
$_SESSION["turn"] = true;
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
$_SESSION["ships"] = [4,3,2,1];
$_SESSION["updated"] = true;
session_commit();
?>