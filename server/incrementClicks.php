<?php
    include "connection.php";

    if (isset($_GET['movie_id']) && isset($_GET['user_id'])) {
        $movieId = $_GET['movie_id'];
        $userId = $_GET['user_id'];

        // Step1: check if a record exists for this user-movie combination
        $checkQuery = $connection->prepare("SELECT number_of_clicks FROM user_clicks_movie WHERE user_id = ? AND movie_id = ?");
        $checkQuery->bind_param("ii", $userId, $movieId);
        $checkQuery->execute();
        $result = $checkQuery->get_result();

        if ($result->num_rows > 0) {
            // If the record exists, update the click count
            $query = $connection->prepare("UPDATE user_clicks_movie SET number_of_clicks = number_of_clicks + 1 WHERE user_id = ? AND movie_id = ?");
            $query->bind_param("ii", $userId, $movieId);
        } else {
            // If no record exists, insert a new one with an initial click count of 1
            $query = $connection->prepare("INSERT INTO user_clicks_movie (user_id, movie_id, number_of_clicks) VALUES (?, ?, 1)");
            $query->bind_param("ii", $userId, $movieId);
        }

        if ($query->execute()) {
            echo json_encode(["status" => "Success", "message" => "Click count updated"]);
        } else {
            echo json_encode(["status" => "Error", "message" => "Failed to update click count"]);
        }

        $checkQuery->close();
        $query->close();
    } else {
        echo json_encode(["status" => "Error", "message" => "Invalid movie ID or user ID"]);
    }

    $connection->close();
?>
