<?php

include "connection.php";

$id = $_POST["id"] ?? null;
$email = $_POST["email"];
$password = $_POST["password"];

$query = $connection->prepare("SELECT email, password FROM users WHERE id = ? ");
$query->bind_param("i", $id);
$query->execute();
$result = $query->get_result();

if ($result->num_rows === 0) {
    // This condition is made to handle emptines in the table
    echo json_encode([
        "status" => "Failed",
        "message" => "Invalid username or email."
    ]);
    exit();
}

$user = $result->fetch_assoc();

// Verify password
if (!password_verify($password, $user['password'])) {
    echo json_encode([
        "status" => "Failed",
        "message" => "Incorrect password."
    ]);
    exit();
}

// If login is successful, We will set is_online  to true

$updateStatus = $connection->prepare("UPDATE users SET is_online = true WHERE id= ?");
$updateStatus->bind_param("i", $id);
$updateStatus->execute();

echo json_encode([
    "status" => "Successful",
    "message" => "Login Succesful",
    "userId" => $id,
    "username" => $user['username']
]);

$query->close();
$updateStatus->close();
$connection->close();


?>