<?php

include "connection.php";


$query = $connection->prepare("SELECT * FROM users WHERE role = 'admin'");
    
$query->execute();
// Fetch results as an associative array
$result = $query->get_result()->fetch_all(MYSQLI_ASSOC);

// We used this as to return as JSON ARRAY
echo json_encode($result);
?>