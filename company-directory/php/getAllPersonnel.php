<?php

// DEVELOPMENT ONLY: show errors
ini_set('display_errors', 'On');
error_reporting(E_ALL);

$executionStartTime = microtime(true);
include('config.php');

header('Content-Type: application/json; charset=UTF-8');

$conn = new mysqli(
    $cd_host,
    $cd_user,
    $cd_password,
    $cd_dbname,
    $cd_port,
    $cd_socket
);

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

$sql = '
    SELECT 
        p.id,
        p.firstName,
        p.lastName,
        p.jobTitle,
        p.email,
        d.name AS department,
        l.name AS location
    FROM personnel p
    LEFT JOIN department d ON p.departmentID = d.id
    LEFT JOIN location l ON d.locationID = l.id
    ORDER BY p.lastName, p.firstName
';

$result = $conn->query($sql);

if (!$result) {
    echo json_encode([
        'status' => [
            'code' => '400',
            'name' => 'executed',
            'description' => 'query failed',
            'returnedIn' => (microtime(true) - $executionStartTime) / 1000 . ' ms'
        ],
        'data' => []
    ]);
    $conn->close();
    exit;
}

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
