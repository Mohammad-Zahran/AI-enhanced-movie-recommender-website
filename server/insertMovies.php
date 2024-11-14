<?php

include "connection.php";

// Read the movies.json file and decode it into an array
$json_data = file_get_contents('../movies.json');
$movies = json_decode($json_data, true);

// It automatically skips rows that violate the UNIQUE constraint (like if the movie title already exists). The INSERT IGNORE statement will suppress the error, and no duplication will happen.
$query = $connection->prepare("INSERT IGNORE INTO movies (movie_title, summary, cast, release_date, number_of_likes, genre, image, duaration, director, nationality) VALUES (?,?,?,?,?,?,?,?,?,?)");

// We used the foreach just to loop to each object inside the movies.json
foreach ($movies as $movie) {
    $title = $movie['title'];
    $summary = $movie['additionalData']['summary']; 
    $cast = isset($movie['additionalData']['cast']) ? implode(" ", $movie['additionalData']['cast']) : '';  // implode: takes the cast array and joins its elements into a single string, with each element separated by a comma and space (", ")
    $releaseDate = $movie['additionalData']['releaseDate']; 
    $numberOfLikes = $movie['additionalData']['numberOfLikes'];
    $genres = $movie['genres'];
    $imageUrl = $movie['imageUrl'];
    $duration = $movie['duration'];
    $director = $movie['additionalData']['directors']; 
    $nationality = $movie['additionalData']['nationality'];

    $query->bind_param("ssssisssss", $title, $summary, $cast, $releaseDate, $numberOfLikes, $genres, $imageUrl, $duration, $director, $nationality);
    
    if ($query->execute()) {
        echo "Movie '$title' inserted successfully.<br>";
    } else {
        echo "Failed to insert the movie '$title'.<br>";
    }
}

?>
