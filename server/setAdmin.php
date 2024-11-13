<?php
include "connection.php";

// Get the POST data
$userId = isset($_POST['user_id']) ? intval($_POST['user_id']) : null;

if ($userId === null) {
    echo json_encode(['success' => false, 'message' => 'User ID is missing']);
    exit;
}

// Prepare and execute the update query
$query = $connection->prepare("UPDATE users SET role = 'admin' WHERE id = ?");
$query->bind_param("i", $userId);

// Check if the query executes successfully
if ($query->execute()) {
    echo json_encode(['success' => true, 'message' => 'User role updated to admin']);
} else {
    echo json_encode(['success' => false, 'message' => 'Error updating user role: ' . $query->error]);
}

// Clean up
$query->close();
$connection->close();
?>
