<?php
session_start(); // Start the session
include "connection.php"; // Include your database connection file

// Doing this function when the user logged out the is_online will return to false
if (isset($_SESSION['userId'])) {
    $updateStatus = $connection->prepare("UPDATE users SET is_online = false WHERE id = ?");
    $updateStatus->bind_param("i", $_SESSION['userId']); 
    $updateStatus->execute();

    $updateStatus->close();
}

session_unset(); 
session_destroy(); 

echo json_encode([
    'status' => 'Logged out',
    'message' => 'You have been logged out successfully'
]);

$connection->close();
?>
