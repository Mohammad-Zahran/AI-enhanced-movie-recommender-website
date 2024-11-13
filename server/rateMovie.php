<?php
    include "connection.php";

    // Get JSON payload
    $data = json_decode(file_get_contents("php://input"), true);
    $userId = $data['userId'];
    $movieId = $data['movieId'];
    $rating = $data['rating'];

    if (!isset($userId, $movieId, $rating) || $rating < 0 || $rating > 5) {
        echo json_encode(["status" => "Failed", "message" => "Invalid input."]);
        exit();
    }

    // Insert or update the rating (0 clears the rating for the user and movie)

    $current_date = date("Y-m-d H:i:s");

    $query = $connection->prepare("REPLACE INTO user_rates_movies (user_id, movie_id, rate, rated_date) VALUES (?, ?, ?, ?)");
    $query->bind_param("iiis", $userId, $movieId, $rating, $current_date);

    if ($query->execute()) {
        echo json_encode(["status" => "Success", "message" => "Rating submitted successfully."]);
    } 
    else {
        echo json_encode(["status" => "Failed", "message" => "Failed to submit rating."]);
    }

    $query->close();
    $connection->close();
?>
