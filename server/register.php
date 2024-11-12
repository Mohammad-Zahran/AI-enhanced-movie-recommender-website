<?php

include "connection.php";

// This will Check if the required fields are set in POST, otherwise assign default values 
// This helped me to handle errors in a better way.
$username = isset($_POST["username"]) ? $_POST["username"] : '';
$email = isset($_POST["email"]) ? $_POST["email"] : '';
$password = isset($_POST["password"]) ? $_POST["password"] : '';
$is_banned = isset($_POST["is_banned"]) ? $_POST["is_banned"] : false; 
$is_online = isset($_POST["is_online"]) ? $_POST["is_online"] : false; 
$role = isset($_POST["role"]) ? $_POST["role"] : 'user'; 

$hashed = password_hash($password, PASSWORD_BCRYPT);

// Check if username already exists
$username_check = $connection->prepare("SELECT id FROM users WHERE username = ?");
$username_check->bind_param("s", $username);
$username_check->execute();
$username_check_result = $username_check->get_result();

// Check if email already exists
$email_check = $connection->prepare("SELECT id FROM users WHERE email = ?");
$email_check->bind_param("s", $email);
$email_check->execute();
$email_check_result = $email_check->get_result();


// Validate input data: check if one of the required inputs are empty
if (empty($username) || empty($email) || empty($password)) {
    echo json_encode([
        "status" => "Failed",
        "message" => "Username, email, and password are required fields."
    ]);
    exit();
}

// Validate email format: check if it's a valid email format
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode([
        "status" => "Failed",
        "message" => "Invalid email format."
    ]);
    exit();
}

// Prepare SQL query to insert the user into the database
$query = $connection->prepare("INSERT INTO users (username, email, password, is_banned, is_online, role) VALUES (?, ?, ?, ?, ?, ?)");
$query->bind_param("ssssss", $username, $email, $hashed, $is_banned, $is_online, $role);
$query->execute();
$result = $query->affected_rows;

// Return response based on the result of the insertion
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

// Close the prepared statement and connection
$query->close();
$connection->close();

?>
