<?php

// Show errors in development (disable in production)
ini_set('display_errors', 'On');
error_reporting(E_ALL);

$executionStartTime = microtime(true);
include('config.php');

header('Content-Type: application/json; charset=UTF-8');

// Connect to DB
$conn = new mysqli($cd_host, $cd_user, $cd_password, $cd_dbname, $cd_port, $cd_socket);

if ($conn->connect_errno) {
    echo json_encode([
        'status' => [
            'code' => '300',
            'name' => 'failure',
            'description' => 'database unavailable',
            'returnedIn' => (microtime(true) - $executionStartTime) / 1000 . ' ms',
        ],
        'data' => [],
    ]);
    exit;
}

$id = $_POST['id'] ?? null;

if (!$id) {
    echo json_encode([
        'status' => [
            'code' => '422',
            'name' => 'invalid',
            'description' => 'missing department ID',
            'returnedIn' => (microtime(true) - $executionStartTime) / 1000 . ' ms',
        ],
        'data' => [],
    ]);
    exit;
}

// Check if department has personnel
$check = $conn->prepare('SELECT COUNT(*) FROM personnel WHERE departmentID = ?');
$check->bind_param('i', $id);
$check->execute();
$check->bind_result($count);
$check->fetch();
$check->close();

if ($count > 0) {
    echo json_encode([
        'status' => [
            'code' => '409',
            'name' => 'conflict',
            'description' => 'Department has personnel assigned and cannot be deleted',
            'returnedIn' => (microtime(true) - $executionStartTime) / 1000 . ' ms',
        ],
        'data' => [],
    ]);
    exit;
}

// Proceed with deletion
$stmt = $conn->prepare('DELETE FROM department WHERE id = ?');
$stmt->bind_param('i', $id);
$stmt->execute();

$statusCode = $stmt->affected_rows > 0 ? '200' : '400';
$statusDescription = $stmt->affected_rows > 0 ? 'delete successful' : 'delete failed or not found';

echo json_encode([
    'status' => [
        'code' => $statusCode,
        'name' => $statusCode === '200' ? 'ok' : 'executed',
        'description' => $statusDescription,
        'returnedIn' => (microtime(true) - $executionStartTime) / 1000 . ' ms',
    ],
    'data' => [],
]);

$conn->close();
