<?php

ini_set('display_errors', 'On');
error_reporting(E_ALL);

$executionStartTime = microtime(true);
include('config.php');

header('Content-Type: application/json; charset=UTF-8');

$conn = new mysqli($cd_host, $cd_user, $cd_password, $cd_dbname, $cd_port, $cd_socket);

if ($conn->connect_errno) {
    http_response_code(500);
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

$id = $_POST['id'] ?? null;

if (!$id || !is_numeric($id)) {
    http_response_code(422);
    echo json_encode([
        'status' => [
            'code' => '422',
            'name' => 'invalid input',
            'description' => 'ID is missing or invalid',
            'returnedIn' => (microtime(true) - $executionStartTime) / 1000 . ' ms'
        ],
        'data' => []
    ]);
    $conn->close();
    exit;
}

$stmt = $conn->prepare('
    DELETE FROM personnel 
    WHERE id = ?
');
$stmt->bind_param('i', $id);
$stmt->execute();
$success = $stmt->affected_rows > 0;
$status = [
    'code' => $success ? '200' : '400',
    'name' => $success ? 'ok' : 'executed',
    'description' => $success ? 'delete successful' : 'delete failed or not found',
    'returnedIn' => (microtime(true) - $executionStartTime) / 1000 . ' ms'
];

echo json_encode([
    'status' => $status,
    'data' => []
]);

$conn->close();
