<?php

    include "connection.php";
    header('Content-Type: application/json');

    $user_id = $_GET["user_id"] ?? null;
    $movie_id = $_GET["movie_id"] ?? null;

    // Validate inputs
    if (!$user_id || !$movie_id) {
        echo json_encode(['error' => 'Missing required parameters']);
        exit;
    }

    try {
        // Step 1: Check if the like already exists for this user with movie
        $checkQuery = $connection->prepare("SELECT COUNT(*) as count FROM user_likes_movies WHERE user_id = ? AND movie_id = ?");
        $checkQuery->bind_param("ii", $user_id, $movie_id);
        $checkQuery->execute();
        $result = $checkQuery->get_result();
        $row = $result->fetch_assoc();
        $count = $row['count'];

        // Step 2: If like exists, delete it
        if ($count > 0){
            $deleteQuery = $connection->prepare("DELETE FROM user_likes_movies WHERE user_id = ? AND movie_id = ?");
            $deleteQuery->bind_param("ii", $user_id, $movie_id);
            $deleteQuery->execute();
            
            echo json_encode(['message' => 'Deleted']);
        }
        // Step 3: If like doesn't exist, add it
        else{

            $current_date = date("Y-m-d H:i:s");

            $insertQuery = $connection->prepare("INSERT INTO user_likes_movies (user_id, movie_id, liked_date) VALUES (?, ?, ?)");
            $insertQuery->bind_param("iis", $user_id, $movie_id, $current_date);
            $insertQuery->execute();

            echo json_encode(['message' => 'Added']);
        }
        
    } 
    
    catch (Exception $error) {
        echo json_encode(['error' => 'Database error: ' .$error->getMessage()]);
    }
?>
