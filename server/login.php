<?php

    session_start(); 
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

    $query = $connection->prepare("SELECT id, username, email, password, is_banned FROM users WHERE email = ?");
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

    // Check if the user is banned
    if ($user['is_banned'] == 1) {
        echo json_encode([
            "status" => "Failed",
            "message" => "Your account is banned. Please contact support."
        ]);
        exit();
    }

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

    // Store user information in the session
    $_SESSION['userId'] = $user['id'];
    $_SESSION['username'] = $user['username'];
    $_SESSION['email'] = $user['email'];

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
