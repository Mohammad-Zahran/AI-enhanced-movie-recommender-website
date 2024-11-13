<?php
include "connection.php";

$response = [];

// Fetch total users
$totalUsersQuery = "SELECT COUNT(*) AS total_users FROM users";
$totalUsersResult = $connection->query($totalUsersQuery);
$response['total_users'] = $totalUsersResult->fetch_assoc()['total_users'];

// Fetch total admins
$totalAdminsQuery = "SELECT COUNT(*) AS total_admins FROM users WHERE role = 'admin'";
$totalAdminsResult = $connection->query($totalAdminsQuery);
$response['total_admins'] = $totalAdminsResult->fetch_assoc()['total_admins'];

echo json_encode($response);
?>
