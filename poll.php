<?php
require("common.php");
session_start(['read_and_close'  => true]);
echo("\n");
flush();
ob_flush();

$elapsed = 0;
$interval = 33333; // 33333us = 33.333ms = 0.3333s
$duration = 1 * 1000000; // x * 100000us = x * 1000ms = x * 1s
while ($elapsed < $interval * ($duration/$interval)) {
    session_start(['read_and_close'  => true]);
    if ($_SESSION["opponent"] == "waiting") {
        setInSession("waiting", "lastRequest", time());
    }
    if ($_SESSION["updated"] > $_REQUEST["updated"]) {
        $resp = $_SESSION;
        $resp["opponent"] = ($resp["opponent"] == "waiting") ? false : true ;
        echo(json_encode($resp));
        exit();
    }
    usleep($interval);
    $elapsed += $interval;
}
echo("{}");
exit();
?>