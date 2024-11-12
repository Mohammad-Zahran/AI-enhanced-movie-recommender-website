<?php

include "connection.php";

$email = $_POST["email"] ?? null;
$password = $_POST["password"] ?? null;

if (!$email || !$password) {
    echo json_encode([
        "status" => "Failed",
        "message" => "Email and password are required."
    ]);
    exit();
}

$query = $connection->prepare("SELECT username, email, password FROM users WHERE email = ?");
$query->bind_param("s", $email);
$query->execute();
$result = $query->get_result();

if ($result->num_rows === 0) {
    echo json_encode([
        "status" => "Failed",
        "message" => "Invalid email or password."
    ]);
    exit();
}

$user = $result->fetch_assoc();

if (!password_verify($password, $user['password'])) {
    echo json_encode([
        "status" => "Failed",
        "message" => "Incorrect password."
    ]);
    exit();
}

$updateStatus = $connection->prepare("UPDATE users SET is_online = true WHERE id = ?");
$updateStatus->bind_param("i", $user['id']);
$updateStatus->execute();

echo json_encode([
    "status" => "Successful",
    "message" => "Login Successful",
    "userId" => $user['id'],
    "username" => $user['username']
]);

$query->close();
$updateStatus->close();
$connection->close();

?>
