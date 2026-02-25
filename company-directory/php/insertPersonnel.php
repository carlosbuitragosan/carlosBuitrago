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

$firstName = $_POST['firstName'] ?? '';
$lastName = $_POST['lastName'] ?? '';
$jobTitle = isset($_POST['jobTitle']) && $_POST['jobTitle'] !== '' ? $_POST['jobTitle'] : null;
$email = $_POST['email'] ?? '';
$departmentID = $_POST['departmentID'] ?? null;

// Check for duplicate email
$check = $conn->prepare('SELECT COUNT(*) FROM personnel WHERE email = ?');
$check->bind_param('s', $email);
$check->execute();
$check->bind_result($count);
$check->fetch();
$check->close();

if ($count > 0) {
    echo json_encode([
        'status' => [
            'code' => '409',
            'name' => 'conflict',
            'description' => 'Email already exists',
            'returnedIn' => (microtime(true) - $executionStartTime) / 1000 . ' ms'
        ],
        'data' => []
    ]);
    mysqli_close($conn);
    exit;
}

// Insert new personnel
$stmt = $conn->prepare('
    INSERT INTO personnel (firstName, lastName, jobTitle, email, departmentID)
    VALUES (?, ?, ?, ?, ?)
');
$stmt->bind_param('ssssi', $firstName, $lastName, $jobTitle, $email, $departmentID);
$stmt->execute();

$success = $stmt->affected_rows > 0;

echo json_encode([
    'status' => [
        'code' => $success ? '200' : '400',
        'name' => $success ? 'ok' : 'executed',
        'description' => $success ? 'Insert successful' : 'Insert failed',
        'returnedIn' => (microtime(true) - $executionStartTime) / 1000 . ' ms'
    ],
    'data' => []
]);

mysqli_close($conn);
