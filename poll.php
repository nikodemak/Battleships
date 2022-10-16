<?php

if (!session_id()) {
    exit();
}

while (true) {
    if (connection_aborted() == 1) {
        break;
    }
    session_start();
    if ($_SESSION["updated"]) {
        
    }
    session_commit();
    echo(json_encode($_SESSION));
    usleep(100000);
}

?>