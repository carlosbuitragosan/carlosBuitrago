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

// Sanitize and validate inputs
$id = $_POST['id'] ?? null;
$name = $_POST['name'] ?? '';

$stmt = $conn->prepare('UPDATE location SET name = ? WHERE id = ?');
$stmt->bind_param('si', $name, $id);
$stmt->execute();

$success = $stmt->affected_rows >= 0;

$description = $stmt->affected_rows > 0 ? 'Update successful' : 'No changes made';

echo json_encode([
    'status' => [
        'code' => '200',
        'name' => 'ok',
        'description' => $description,
        'returnedIn' => (microtime(true) - $executionStartTime) / 1000 . ' ms'
    ],
    'data' => []
]);

mysqli_close($conn);
