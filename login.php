<?php
require("db.php");
session_start();
if (isset($_REQUEST["password"])) {
    if (isset($_REQUEST["username"])) {
        $query = $conn->prepare("SELECT `*` FROM `users` where username=?");
        if (mysqli_errno($conn) != 0) {
            echo(mysqli_error($conn));
        }
        $query->bind_param("s", $_REQUEST["username"]);
    } elseif(isset($_REQUEST["email"])) {
        if (!filter_var($_REQUEST["email"], FILTER_VALIDATE_EMAIL)) {
            echo("Invalid email format");
            http_response_code(201);
            exit();
        }
        $query = $conn->prepare("SELECT `*` FROM `users` where email=?");
        $query->bind_param("s", $_REQUEST["email"]);
    }
    $query->execute();
    $result = $query->get_result();
    if (mysqli_num_rows($result) != 1) {
        echo("invalid credentials");
        http_response_code(201);
        exit();
    } else {
        $creds = $result->fetch_assoc();
        $pass = $creds["passhash"];
        if (password_verify($_REQUEST["password"], $pass)) {
            $_SESSION["authenticated"] = true;
            $_SESSION["credentials"] = $creds;
            setcookie("loggedIn", "true");
            echo("logged in");
            exit();
        } else {
            echo("invalid credentials");
            http_response_code(201);
            exit();
        }
    }
}
?>