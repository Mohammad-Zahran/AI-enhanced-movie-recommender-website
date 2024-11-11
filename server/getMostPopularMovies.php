<?php

include "connection.php";

    $query = $connection->prepare("SELECT * FROM movies order by number_of_likes desc");
    $query->execute();
    $result = $query->get_result();

    $movies = [];
    while ($row = $result->fetch_assoc()) {
        $movies[] = $row;
    }

    if ($result->num_rows >0) {
        echo json_encode([
            "status"=> "Load most popular movies successful",
            "message"=> "Most popular movies are successfully loaded ",
            "movies" => [ ...($movies)]
        ]);
    } 
    else {
        echo json_encode([
            "status"=> "Failed",
            "message"=> "Could not load most popular movies",
        ]);
    }
?>
