<?php
    
    include "connection.php";
    header('Content-Type: application/json');

    $data = json_decode(file_get_contents('php://input'), true);

    if (isset($data['movieId']) && isset($data['currentLikes'])) {
        $movieId = $data['movieId'];
        $currentLikes = $data['currentLikes'];

        // Update the like count in the database
        $query = $connection->prepare("UPDATE movies SET number_of_likes = ? WHERE id = ?");
        $query->bind_param("ii", $currentLikes, $movieId); 
        $query->execute();

        if ($query->affected_rows > 0) {
            echo json_encode(['status' => 'Success']);
        }
    } 
    else {
        echo json_encode(['status' => 'Error', 'message' => 'Invalid data']);
    }
?>
