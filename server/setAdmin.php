<?php
include "connection.php";

// Get the POST data
$userId = isset($_POST['user_id']) ? intval($_POST['user_id']) : null;

if ($userId === null) {
    echo json_encode(['success' => false, 'message' => 'User ID is missing']);
    exit;
}

// Check the current role and status of the user
$query = $connection->prepare("SELECT role, is_banned FROM users WHERE id = ?");
$query->bind_param("i", $userId);
$query->execute();
$result = $query->get_result();

if ($result->num_rows === 0) {
    echo json_encode(['success' => false, 'message' => 'User not found']);
    exit;
}

$user = $result->fetch_assoc();
$query->close();

// Prevent updating if already admin
if ($user['role'] === 'admin') {
    echo json_encode(['success' => false, 'message' => 'User is already an admin']);
    exit;
}

// Prevent updating if banned
if ($user['is_banned'] == 1) {
    echo json_encode(['success' => false, 'message' => 'Cannot update a banned user']);
    exit;
}

// Update the user's role to admin
$query = $connection->prepare("UPDATE users SET role = 'admin' WHERE id = ?");
$query->bind_param("i", $userId);

if ($query->execute()) {
    echo json_encode(['success' => true, 'message' => 'User role updated to admin']);
} else {
    echo json_encode(['success' => false, 'message' => 'Error updating user role: ' . $query->error]);
}

$query->close();
$connection->close();
?>
