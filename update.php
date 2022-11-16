<?php
session_start();
require("common.php");
if($_SESSION["opponent"] != "waiting") {
    if(isset($_GET["event"])) {
        $event = $_GET["event"];
        if($event == "shoot" && isset($_GET["pos"])) {
            for ($i=0; $i < 4; $i++) { 
                if ($_SESSION["ships"][$i] > 0) {
                    goto end;
                }
                changeSession($_SESSION["opponent"]);
                if ($_SESSION["ships"][$i] > 0) {
                    goto end;
                }
                changeSession($_SESSION["opponent"]);
            }
            if ($_SESSION["turn"]) {
                $field = $_GET["pos"];
                $y = $field%10;
                $x = ($field - $y)/10;
                changeSession($_SESSION["opponent"]);
                    if($_SESSION["board"][$x][$y] == 2) {
                        $_SESSION["board"][$x][$y] = 3;
                        changeSession($_SESSION["opponent"]);
                        $_SESSION["score"] += 1;
                        changeSession($_SESSION["opponent"]);
                    } elseif($_SESSION["board"][$x][$y] == 0) {
                        $_SESSION["board"][$x][$y] = 1;
                        changeSession($_SESSION["opponent"]);
                        $_SESSION["turn"] = false;
                        changeSession($_SESSION["opponent"]);
                        $_SESSION["turn"] = true;
                    }
                changeSession($_SESSION["opponent"]);
            }
        }
        if($event == "place") {
            if(isset($_GET["pos"]) && isset($_GET["rot"]) && isset($_GET["size"])) {
                $field = $_GET["pos"];
                $rot = $_GET["rot"];
                $size = $_GET["size"];
                $y = $field%10;
                $x = ($field - $y)/10;
                if (!isset($_SESSION["ships"][$size-1]) || $_SESSION["ships"][$size-1] <= 0) {
                    goto end;
                }
                if($rot > 0) {
                    if($x+$size>10) goto end;
                } else {
                    if($y+$size>10) goto end;
                }
                for ($i=-1; $i < $size + 1; $i++) {
                    for ($j=-1; $j < 2; $j++) {
                        if ($rot > 0) {
                            if ($_SESSION["board"][max(0,$x+$i)][max(0, $y+$j)] == 2) {
                                goto end;
                            }
                        } else {
                            if ($_SESSION["board"][max(0,$x+$j)][max(0, $y+$i)] == 2) {
                                goto end;
                            }
                        }
                    }
                }
                for ($i=0; $i < $size; $i++) {
                    if($rot > 0) {
                        $_SESSION["board"][$x+$i][$y] = 2;
                    } else {
                        $_SESSION["board"][$x][$y+$i] = 2;
                    }
                }
                $_SESSION["ships"][$size-1] = $_SESSION["ships"][$size-1] - 1;
                for ($i=0; $i < 4; $i++) {
                    if ($_SESSION["ships"][$i] > 0) {
                        goto end;
                    } else {
                        $_SESSION["gameStarted"] = true;
                    }
                }
            }
        }
    }
    end:
    if($_SESSION["score"] >= 20) {
        $_SESSION["gameEnded"] = true;
        $_SESSION["winner"] = true;
        changeSession($_SESSION["opponent"]);
        $_SESSION["gameEnded"] = true;
        changeSession($_SESSION["opponent"]);
    }
    for ($i=0; $i < 10; $i++) {
        for ($j=0; $j < 10; $j++) {
            changeSession($_SESSION["opponent"]);
            $d = $_SESSION["board"][$i][$j];
            changeSession($_SESSION["opponent"]);
            $_SESSION["eboard"][$i][$j] = ($d > 0) ? ($d >= 3 ? $d : (($d != 2) ? 1 : 0) ) : (0) ;
        }
    }
    $_SESSION["updated"] = $_SESSION["updated"] + 1;
    changeSession($_SESSION["opponent"]);
    $_SESSION["updated"] = $_SESSION["updated"] + 1;
    changeSession($_SESSION["opponent"]);
}
echo(json_encode($_SESSION));