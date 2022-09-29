<?php
session_start();
require("common.php");
if($_SESSION["opponent"] != "waiting") {
    if(isset($_GET["event"])) {
        $event = $_GET["event"];
        if($event == "shoot" && isset($_GET["shoot"])) {
            if ($_SESSION["turn"]) {
                $field = $_GET["shoot"];
                $y = $field%10;
                $x = ($field - $y)/10;
                changeSession($_SESSION["opponent"]);
                    $_SESSION["board"][$x][$y] = 1;
                    $_SESSION["turn"] = true;
                changeSession($_SESSION["opponent"]);
                $_SESSION["turn"] = false;
            }
        }
        if($event == "place") {
            if(isset($_GET["field"]) && isset($_GET["rot"]) && isset($_GET["size"])) {
                $field = $_GET["field"];
                $rot = $_GET["rot"];
                $size = $_GET["size"];
                $y = $field%10;
                $x = ($field - $y)/10;
                if($rot > 0) {
                    if($x+$size>10) goto end;
                } else {
                    if($y+$size>10) goto end;
                }
                for ($i=0; $i < $size; $i++) {
                    if($rot > 0) {
                        $_SESSION["board"][$x+$i][$y] = 2;
                    } else {
                        $_SESSION["board"][$x][$y+$i] = 2;
                    }
                }
                end:
            }
        }
    }
    for ($i=0; $i < 10; $i++) {
        for ($j=0; $j < 10; $j++) { 
            changeSession($_SESSION["opponent"]);
            $d = $_SESSION["board"][$i][$j];
            changeSession($_SESSION["opponent"]);
            $_SESSION["eboard"][$i][$j] = ($d > 0) ? ($d == 3 ? 3 : ($d != 2)) : (0) ;
        }
    }
}
echo(json_encode($_SESSION));
