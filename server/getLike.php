<?php

    include "connection.php";
    header('Content-Type: application/json');

    $user_id = $_GET["user_id"] ?? null;

    // Check if ID is provided
    if ($user_id === null) {
        echo json_encode(["error" => "User ID is required."]);
        exit;
    }

    try {
        $query = $connection->prepare("SELECT movie_id FROM user_likes_movies WHERE user_id = ?");
        $query->bind_param("i", $user_id);
        $query->execute();
        $result = $query->get_result();

        $likedMovies = [];
        while ($row = $result->fetch_assoc()) {
            $likedMovies[] = $row['movie_id'];
        }

        echo json_encode(['likedMovies' => $likedMovies]);
    } catch (Exception $error) {
        echo json_encode(['error' => 'Database error: ' . $error->getMessage()]);
    }
?>