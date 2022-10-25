<?php
session_start();
?>
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <title></title>
        <meta name="description" content="">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link rel="stylesheet" href="style.css">
    </head>
    <body>
        <div id="main">
            <div id="menu" class="centered">
                <ul>
                    <li><a href="#login" class="button login">Login</a></li>
                    <li><a href="#register" class="button register">Register</a></li>
                    <li><a href="#lobby" class="button play-guest">Play as a guest</a></li>
                    <li><a href="#credits" class="button credits">Credits</a></li>
                </ul>
            </div>
            <div id="login" class="centered">
                <input type="text" class="input username login" placeholder="username or email">
                <input type="password" class="input password login" placeholder="password">
                <input type="button" class="input button login" value="login">
            </div>
            <div id="register" class="centered">
                <input type="text" class="input username register" placeholder="username">
                <input type="email" class="input email register" placeholder="email">
                <input type="password" class="input password register" placeholder="password">
                <input type="button" class="input button register" value="login">
            </div>
            <div id="lobby" class="centered">
                <a href="#game" class="button play">Play</a>
            </div>
            <div id="game" class="centered">
                <div id="leftScreen">
                    <div id="ships"></div>
                </div>
                <div id="centerScreen">
                    <div id="enemy" class="board"></div>
                    <div id="friendly" class="board"></div>
                </div>
                <div id="rightScreen">c</div>
            </div>
        </div>
        <script src="game1.js"></script>
    </body>
</html>
