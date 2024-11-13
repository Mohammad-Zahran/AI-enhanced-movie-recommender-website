<?php
include "connection.php";

// Get the POST data
$userId = isset($_POST['user_id']) ? intval($_POST['user_id']) : null;

if ($userId === null) {
    echo json_encode(['success' => false, 'message' => 'User ID is missing']);
    exit;
}

// Check if the user exists and get their role and banned status
$query = $connection->prepare("SELECT role, is_banned FROM users WHERE id = ?");
$query->bind_param("i", $userId);
$query->execute();
$result = $query->get_result();

if ($result->num_rows === 0) {
    echo json_encode(['success' => false, 'message' => 'User not found']);
    $query->close();
    $connection->close();
    exit;
}

$user = $result->fetch_assoc();
$query->close();

// Check if the user is already an admin
if ($user['role'] === 'admin') {
    echo json_encode(['success' => false, 'message' => 'Cannot ban an admin user']);
    $connection->close();
    exit;
}

// Check if the user is already banned
if ($user['is_banned'] == 1) {
    echo json_encode(['success' => false, 'message' => 'User is already banned']);
    $connection->close();
    exit;
}

// Update the user's banned status
$query = $connection->prepare("UPDATE users SET is_banned = 1 WHERE id = ?");
$query->bind_param("i", $userId);

if ($query->execute()) {
    echo json_encode(['success' => true, 'message' => 'User has been banned successfully']);
} else {
    echo json_encode(['success' => false, 'message' => 'Error banning user: ' . $query->error]);
}

$query->close();
$connection->close();
?>
