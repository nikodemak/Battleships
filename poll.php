<?php
echo(" ");
session_start(['read_and_close'  => true]);
if (!session_id()) {
    header("Location: https://lslnet.cyou/BB/");
    exit();
}

while (true) {
    if (connection_aborted() == 1) {
        exit();
    }
    session_start(['read_and_close'  => true]);
    if ($_SESSION["updated"] > $_REQUEST["updated"]) {
        $resp = $_SESSION;
        $resp["opponent"] = ($resp["opponent"] == "waiting") ? false : true ;
        echo(json_encode($resp));
        exit();
    }
    usleep(100000);
}

?>