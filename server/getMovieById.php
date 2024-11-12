<?php

    include "connection.php";

    $id = $_GET["id"] ?? null;

    // Check if ID is provided
    if ($id === null) {
        echo json_encode(["error" => "Movie ID is required."]);
        exit;
    }

    $query = $connection->prepare("SELECT * FROM movies WHERE id = ?");
    $query->bind_param("i", $id);
    $query->execute();

    if ($query->execute()) {
        // Fetch results as an associative array
        $result = $query->get_result()->fetch_assoc();
        
        // Check if a movie was found
        if ($result) {
            echo json_encode($result);  
        } else {
            echo json_encode(["error" => "Movie not found."]);
        }
    } else {
        echo json_encode(["error" => "Failed to execute query."]);
    }

?>
