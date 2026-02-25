<?php

ini_set('display_errors', 'On');
error_reporting(E_ALL);

$executionStartTime = microtime(true);
include('config.php');

header('Content-Type: application/json; charset=UTF-8');

$conn = new mysqli($cd_host, $cd_user, $cd_password, $cd_dbname, $cd_port, $cd_socket);

if ($conn->connect_errno) {
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

// Use POST in production
$id = $_POST['id'] ?? $_REQUEST['id'] ?? null;

if (!$id || !is_numeric($id)) {
    echo json_encode([
        'status' => [
            'code' => '422',
            'name' => 'invalid',
            'description' => 'Missing or invalid department ID',
            'returnedIn' => (microtime(true) - $executionStartTime) / 1000 . ' ms'
        ],
        'data' => []
    ]);
    $conn->close();
    exit;
}

$stmt = $conn->prepare('
    SELECT d.id, d.name, d.locationID, COUNT(p.id) AS personnelCount
    FROM department d
    LEFT JOIN personnel p ON p.departmentID = d.id
    WHERE d.id = ?
    GROUP BY d.id
');
$stmt->bind_param('i', $id);
$stmt->execute();
$result = $stmt->get_result();
$data = $result->fetch_all(MYSQLI_ASSOC);

echo json_encode([
    'status' => [
        'code' => '200',
        'name' => 'ok',
        'description' => 'success',
        'returnedIn' => (microtime(true) - $executionStartTime) / 1000 . ' ms'
    ],
    'data' => $data
]);

$conn->close();
