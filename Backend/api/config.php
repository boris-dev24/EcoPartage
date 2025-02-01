<?php
$host = "localhost";
$db_name = "ecopartage";
$username = "root";
$password = "Mysql@2017";
$conn = new PDO("mysql:host=$host;dbname=$db_name;charset=utf8", $username, $password);
$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
?>
