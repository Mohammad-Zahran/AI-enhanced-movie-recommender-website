<?php

include "connection.php";

$username = $_POST["username"];
$email = $_POST["email"];
$password = $_POST["password"];
$is_banned = $_POST["is_banned"];
$is_online = $_POST["is_online"];
$role = $_POST["role"];
$hashed = password_hash($password, PASSWORD_BCRYPT);

// We added these validations for a purpuse: client-side validation (like HTML's required attribute) can be bypassed by malicious users (e.g., through browser developer tools or custom requests). Server-side validation is still necessary to ensure that the data you receive is valid and secure before processing it.
// Validate input data
if (empty($username) || empty($email) || empty($password)) {
    echo json_encode([
        "status" => "Failed",
        "message" => "Username, email, and password are required fields."
    ]);
    exit();
}

// Validate email format
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode([
        "status" => "Failed",
        "message" => "Invalid email format."
    ]);
    exit();
}

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
