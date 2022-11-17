<?php
function setInSession($sid, $dst, $var) {
    $psid = session_id();
    session_commit();
    session_id($sid);
    session_start();
    $_SESSION[$dst] = $var;
    session_commit();
    session_id($psid);
    session_start();
}

function changeSession($sid) {
    session_commit();
    session_id($sid);
    session_start();
}
?>

