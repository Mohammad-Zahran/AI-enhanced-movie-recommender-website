<?php

    header("Content-Type: application/json");
    include 'connection.php';

    // Get the user_id from the GET parameters
    $user_id = isset($_GET['user_id']) ? intval($_GET['user_id']) : 0;

    if ($user_id <= 0) {
        echo json_encode(["error" => "Invalid user ID"]);
        exit;
    }

    try {
        $query = $connection->prepare("SELECT movie_id, rate FROM user_rates_movies WHERE user_id = ?");
        $query->bind_param("i", $user_id);
        $query->execute();
        $result = $query->get_result();

        // Fetch all ratings as an associative array
        $ratings = [];
        while ($row = $result->fetch_assoc()) {
            $ratings[] = $row;
        }

        echo json_encode(["ratings" => $ratings]);
    } 
    catch (Exception $e) {
        echo json_encode(["error" => "Failed to fetch ratings: " . $e->getMessage()]);
    }
?>