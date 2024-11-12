<?php

include "connection.php";

$username = $_POST["username"];
$email = $_POST["email"];
$password = $_POST["password"];
$is_banned = $_POST["is_banned"];
$is_online = $_POST["is_online"];
$role = $_POST["role"];

$hashed = password_hash($password, PASSWORD_BCRYPT);

$query = $connection->prepare("INSERT INTO users (username, email, password, is_banned, is_online, role) VALUES (?, ?, ?, ?, ?, ?)");
$is_banned = false; 
$is_online = false; 
$role = 'user'; 
$query->bind_param("ssssss", $username, $email, $hashed, $is_banned, $is_online, $role );
$query->execute();
$result = $query->affected_rows;

if ($result != 0) {
    echo json_encode([
        "status" => "Successful",
        "message" => "$result user(s) created",
    ]);
} else {
    echo json_encode([
        "status" => "Failed",
        "message" => "Could not create record",
    ]);
}

?>
