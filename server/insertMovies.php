<?php

include "connection.php";

// Read the movies.json file and decode it into an array
$json_data = file_get_contents('../movies.json');
$movies = json_decode($json_data, true); 

$query = $connection->prepare("INSERT INTO movies (movie_title, summary, cast, release_date, number_of_likes, genre, image, duaration, director, nationality) VALUES (?,?,?,?,?,?,?,?,?,?)");

// I added a foreach to loop in all the json file content
// You will see here that there are some with additionalData since some of those are inside an array
foreach ($movies as $movie) {
    $title = $movie['title'];
    $summary = $movie['additionalData']['summary']; 
    $cast = $movie['additionalData']['cast']; 
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
