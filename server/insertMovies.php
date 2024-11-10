<?php

include "connection.php";

// Read the movies.json file and decode it into an array
$json_data = file_get_contents('../movies.json');
$movies = json_decode($json_data, true);

// This is a simpler solution. It automatically skips rows that violate the UNIQUE constraint (like if the movie title already exists). The INSERT IGNORE statement will suppress the error, and no duplication will happen.
$query = $connection->prepare("INSERT IGNORE INTO movies (movie_title, summary, cast, release_date, number_of_likes, genre, image, duaration, director, nationality) VALUES (?,?,?,?,?,?,?,?,?,?)");

foreach ($movies as $movie) {
    $title = $movie['title'];
    $summary = $movie['additionalData']['summary']; 
    $cast = isset($movie['additionalData']['cast']) ? implode(", ", $movie['additionalData']['cast']) : ''; 
    $releaseDate = $movie['additionalData']['releaseDate']; 
    $numberOfLikes = $movie['additionalData']['numberOfLikes'];
    $genres = $movie['genres'];
    $imageUrl = $movie['imageUrl'];
    $duration = $movie['duration'];
    $director = $movie['additionalData']['directors']; 
    $nationality = $movie['additionalData']['nationality'];

    $query->bind_param("sssdisssss", $title, $summary, $cast, $releaseDate, $numberOfLikes, $genres, $imageUrl, $duration, $director, $nationality);
    
    if ($query->execute()) {
        echo "Movie '$title' inserted successfully.<br>";
    } else {
        echo "Failed to insert the movie '$title'.<br>";
    }
}

?>
