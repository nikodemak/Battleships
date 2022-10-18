<?php
echo(" ");
session_start(['read_and_close'  => true]);
if (!session_id()) {
    header("Location: https://lslnet.cyou/BB/");
    exit();
}
usleep(1000000);
while (true) {
    if (connection_aborted() == 1) {
        exit();
    }
    session_start(['read_and_close'  => true]);
    if ($_SESSION["updated"]) {
        exit(json_encode($_SESSION));
    }
    usleep(100000);
}

?>