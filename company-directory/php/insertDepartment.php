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

$name = $_POST['name'];
$locationID = $_POST['locationID'];

// Prevent duplicates
$check = $conn->prepare('SELECT COUNT(*) FROM department WHERE name = ? AND locationID = ?');
$check->bind_param('si', $name, $locationID);
$check->execute();
$check->bind_result($count);
$check->fetch();
$check->close();

if ($count > 0) {
    echo json_encode([
        'status' => [
            'code' => '409',
            'name' => 'conflict',
            'description' => 'Department already exists in this location',
            'returnedIn' => (microtime(true) - $executionStartTime) / 1000 . ' ms'
        ],
        'data' => []
    ]);
    exit;
}

// Insert
$stmt = $conn->prepare('INSERT INTO department (name, locationID) VALUES (?, ?)');
$stmt->bind_param('si', $name, $locationID);
$stmt->execute();

if ($stmt->affected_rows > 0) {
    $status = [
        'code' => '200',
        'name' => 'ok',
        'description' => 'insert successful'
    ];
} else {
    $status = [
        'code' => '400',
        'name' => 'executed',
        'description' => 'insert failed'
    ];
}

echo json_encode([
    'status' => array_merge($status, [
        'returnedIn' => (microtime(true) - $executionStartTime) / 1000 . ' ms'
    ]),
    'data' => []
]);

mysqli_close($conn);
