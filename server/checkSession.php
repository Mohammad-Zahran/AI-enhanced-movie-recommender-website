<?php
    session_start();

    if (isset($_SESSION['userId']) && isset($_SESSION['username'])) {
        echo json_encode([
            'status' => 'Logged in',
            'userId' => $_SESSION['userId'],
            'username' => $_SESSION['username']
        ]);
    } else {
        echo json_encode([
            'status' => 'Not logged in',
            'message' => 'User is not logged in'
        ]);
    }
?>
