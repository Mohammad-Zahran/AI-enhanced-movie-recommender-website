<?php

    session_start(); 
    include "connection.php";

    // This will Check if the required fields are set in POST, otherwise assign default values 
    // This helped me to handle errors in a better way.
    $username = isset($_POST["username"]) ? $_POST["username"] : '';
    $email = isset($_POST["email"]) ? $_POST["email"] : '';
    $password = isset($_POST["password"]) ? $_POST["password"] : '';
    $is_banned = isset($_POST["is_banned"]) ? $_POST["is_banned"] : false; 
    $is_online = isset($_POST["is_online"]) ? $_POST["is_online"] : true; 
    $role = isset($_POST["role"]) ? $_POST["role"] : 'user'; 

    $hashed = password_hash($password, PASSWORD_BCRYPT);

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

    // This will check if the username is taken or not to have unique names
    $username_check = $connection->prepare("SELECT id FROM users WHERE username = ?");
    $username_check->bind_param("s", $username);
    $username_check->execute();
    $username_check_result = $username_check->get_result();

    // This will check if the email is taken or not to have unique emails
    $email_check = $connection->prepare("SELECT id FROM users WHERE email = ?");
    $email_check->bind_param("s", $email);
    $email_check->execute();
    $email_check_result = $email_check->get_result();


    if ($email_check_result->num_rows > 0) {
        echo json_encode(['message' => 'Email already taken.', 'email' => $email]);
    }
    else if ($username_check_result->num_rows > 0) {

        echo json_encode(['message' => 'Username already taken.', 'username' => $username]);
    } 
    else {
        // Prepare SQL query to insert the user into the database
        $query = $connection->prepare("INSERT INTO users (username, email, password, is_banned, is_online, role) VALUES (?, ?, ?, ?, ?, ?)");
        $query->bind_param("ssssss", $username, $email, $hashed, $is_banned, $is_online, $role);
        $query->execute();
        $result = $query->affected_rows;

        // Return response based on the result of the insertion
        if ($result != 0) {

            $user_id = $connection->insert_id;

            $_SESSION['userId'] = $user_id;
            $_SESSION['username'] = $username;
            $_SESSION['email'] = $email;

            echo json_encode([
                "status" => "Successful",
                "message" => "$result user(s) created",
                "userId" => $user_id,
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
    }
?>