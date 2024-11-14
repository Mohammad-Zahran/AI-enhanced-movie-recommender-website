<?php
include "connection.php";

// Query to fetch users with the count of bookmarks
$query = $connection->prepare("
    SELECT u.id, u.username, u.email, u.is_online, u.is_banned, u.role, COUNT(b.id) AS bookmark_count
    FROM users u
    LEFT JOIN user_bookmark_movies b ON u.id = b.user_id
    GROUP BY u.id
");

$query->execute();
// Fetch results as an associative array
$result = $query->get_result()->fetch_all(MYSQLI_ASSOC);

// Return the result as a JSON array
echo json_encode($result);
?>