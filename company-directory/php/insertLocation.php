<?php

ini_set('display_errors', 'On');
error_reporting(E_ALL);

$executionStartTime = microtime(true);
include('config.php');

header('Content-Type: application/json; charset=UTF-8');

$conn = new mysqli($cd_host, $cd_user, $cd_password, $cd_dbname, $cd_port, $cd_socket);

if (mysqli_connect_errno()) {
    echo json_encode([
        'status' => [
            'code' => '300',
            'name' => 'failure',
            'description' => 'database unavailable',
            'returnedIn' => (microtime(true) - $executionStartTime) / 1000 . ' ms'
        ],
        'data' => []
    ]);
    exit;
}

$name = $_POST['name'] ?? '';

// Check for duplicate location
$check = $conn->prepare('SELECT COUNT(*) FROM location WHERE name = ?');
$check->bind_param('s', $name);
$check->execute();
$check->bind_result($count);
$check->fetch();
$check->close();

if ($count > 0) {
    echo json_encode([
        'status' => [
            'code' => '409',
            'name' => 'conflict',
            'description' => 'Location already exists',
            'returnedIn' => (microtime(true) - $executionStartTime) / 1000 . ' ms'
        ],
        'data' => []
    ]);
    mysqli_close($conn);
    exit;
}

// Insert location
$stmt = $conn->prepare('INSERT INTO location (name) VALUES (?)');
$stmt->bind_param('s', $name);
$stmt->execute();

$status = [
    'code' => $stmt->affected_rows > 0 ? '200' : '400',
    'name' => $stmt->affected_rows > 0 ? 'ok' : 'executed',
    'description' => $stmt->affected_rows > 0 ? 'insert successful' : 'insert failed',
    'returnedIn' => (microtime(true) - $executionStartTime) / 1000 . ' ms'
];

echo json_encode([
    'status' => $status,
    'data' => []
]);

mysqli_close($conn);
