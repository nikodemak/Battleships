<?php
require("db.php");
session_start();
if (isset($_REQUEST["username"]) && isset($_REQUEST["email"]) && isset($_REQUEST["password"])) {
    $username = $_REQUEST["username"];
    $email = $_REQUEST["email"];
    $password = $_REQUEST["password"];
    $password = password_hash($password, PASSWORD_DEFAULT);
    $query = $conn->prepare("SELECT * FROM `users` where username = ?");
    $query->bind_param("s", $username);
    $query->execute();
    if (mysqli_num_rows($query->get_result())) {
        echo("username taken");
        http_response_code(201);
        exit();
    }
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo("Invalid email format");
        http_response_code(201);
        exit();
    }
    $query = $conn->prepare("SELECT * FROM `users` where email = ?");
    $query->bind_param("s", $email);
    $query->execute();
    if (mysqli_num_rows($query->get_result()) > 0) {
        echo("email taken");
        http_response_code(201);
        exit();
    }
    $query = $conn->prepare("INSERT INTO `users`(`username`, `email`, `passhash`) VALUES (?, ?, ?)");
    $query->bind_param("sss", $username, $email, $password);
    $query->execute();
    echo("success");
}
?>