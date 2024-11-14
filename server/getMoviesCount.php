<?php
// Include database connection
include "connection.php";

header("Content-Type: application/json");

try {
    // Query to count movies
    $query = "SELECT COUNT(*) AS total_movies FROM movies";
    $result = $connection->query($query);

    if ($result) {
        $data = $result->fetch_assoc();
        echo json_encode([
            'success' => true,
            'total_movies' => $data['total_movies'],
        ]);
    } else {
        echo json_encode([
            'success' => false,
            'message' => 'Failed to fetch movie count',
        ]);
    }
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage(),
    ]);
}

// Close the database connection
$connection->close();
?>
