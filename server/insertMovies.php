<?php

include "connection.php";

$json_data = file_get_contents('movies.json');
$movies = json_decode($json_data, true); 

$title = $_POST["title"];
$imageUrl = $_POST["imageUrl"];
$genres = $_POST["genres"];
$duration = $_POST["duration"];
$movieLink = $_POST["movieLink"];
$summary = $_POST["summary"]; 
$numberOfLikes = $_POST["numberOfLikes"];
$cast = $_POST["cast"];
$releaseDate = $_POST["releaseDate"]; 
$director = $_POST["director"]; 

$query = $connection->prepare("INSERT INTO movies (movie_title, summary, cast, release_date, number_of_likes, genre, image, duaration, director) VALUES (?,?,?,?,?,?,?,?,?");
$query->bind_param("ssssissss", $title, $summary, $cast, $releaseDate, $numberOfLikes,$genres,$imageUrl,$duration,$director);
$query->execute();
$result = $query->affected_rows;



?>