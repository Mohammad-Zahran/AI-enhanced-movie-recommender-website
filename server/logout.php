<?php
session_start(); 


session_unset(); 
session_destroy(); 

echo json_encode([
    'status' => 'Logged out',
    'message' => 'You have been logged out successfully'
]);
?>
