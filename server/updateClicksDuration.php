<?php
    include 'connection.php';

    $data = json_decode(file_get_contents("php://input"), true);

    $userId = $data['userId'];
    $movieId = $data['movieId'];
    $action = $data['action'];

    // Start the query
    if ($action === 'click') {
        // Insert or update clicks
        $query = $connection->prepare("
            INSERT INTO user_clicks_movie (user_id, movie_id, number_of_clicks, duration)
            VALUES (?, ?, 1, 0)
            ON DUPLICATE KEY UPDATE number_of_clicks = number_of_clicks + 1
        ");
        $query->bind_param("ii", $userId, $movieId);
    } elseif ($action === 'duration') {
        $duration = $data['duration'];
        // Insert or update duration
        $query = $connection->prepare("
            INSERT INTO user_clicks_movie (user_id, movie_id, number_of_clicks, duration)
            VALUES (?, ?, 0, ?)
            ON DUPLICATE KEY UPDATE duration = duration + VALUES(duration)
        ");
        $query->bind_param("iii", $userId, $movieId, $duration);
    }

    // Execute the query and handle the result
    if ($query->execute()) {
        echo json_encode(["status" => "Success"]);
    } else {
        echo json_encode(["status" => "Error", "message" => $query->error]);
    }

    // Close the prepared statement
    $query->close();
    $connection->close();
?>
