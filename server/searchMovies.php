<?php

include "connection.php";

$search = $_GET['search'] ?? '';

if ($search) {
    $query = $connection->prepare("SELECT id, movie_title, image FROM movies WHERE movie_title LIKE ?");
    $searchTerm = "%$search%";
    $query->bind_param("s", $searchTerm);
} else {
    $query = $connection->prepare("SELECT id, movie_title, image FROM movies");
}

$query->execute();
$result = $query->get_result();
$movies = $result->fetch_all(MYSQLI_ASSOC);

// We created this to return the movies as an json response
header('Content-Type: application/json');

if (!$movies) {
    echo json_encode(["error" => "No movies found"]);
    exit;
}

echo json_encode($movies);
?>
