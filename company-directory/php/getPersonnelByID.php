<?php

ini_set('display_errors', 'On');
error_reporting(E_ALL);

$executionStartTime = microtime(true);
include('config.php');

header('Content-Type: application/json; charset=UTF-8');

$conn = new mysqli($cd_host, $cd_user, $cd_password, $cd_dbname, $cd_port, $cd_socket);

if (mysqli_connect_errno()) {
    $output = [
        'status' => [
            'code' => '300',
            'name' => 'failure',
            'description' => 'database unavailable',
            'returnedIn' => (microtime(true) - $executionStartTime) / 1000 . ' ms'
        ],
        'data' => []
    ];
    echo json_encode($output);
    exit;
}

$id = $_POST['id'] ?? null;

// Fetch selected personnel
$stmt = $conn->prepare('
    SELECT id, firstName, lastName, email, jobTitle, departmentID 
    FROM personnel 
    WHERE id = ?
');
$stmt->bind_param('i', $id);
$stmt->execute();
$result = $stmt->get_result();

$personnel = [];
while ($row = mysqli_fetch_assoc($result)) {
    $personnel[] = $row;
}

// Fetch all departments
$deptResult = $conn->query('
    SELECT id, name 
    FROM department 
    ORDER BY name
');

if (!$deptResult) {
    $output = [
        'status' => [
            'code' => '400',
            'name' => 'executed',
            'description' => 'query failed',
            'returnedIn' => (microtime(true) - $executionStartTime) / 1000 . ' ms'
        ],
        'data' => []
    ];
    mysqli_close($conn);
    echo json_encode($output);
    exit;
}

$departments = [];
while ($row = mysqli_fetch_assoc($deptResult)) {
    $departments[] = $row;
}

$output = [
    'status' => [
        'code' => '200',
        'name' => 'ok',
        'description' => 'success',
        'returnedIn' => (microtime(true) - $executionStartTime) / 1000 . ' ms'
    ],
    'data' => [
        'personnel' => $personnel,
        'department' => $departments
    ]
];

mysqli_close($conn);
echo json_encode($output);
