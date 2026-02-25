<?php

ini_set('display_errors', 'On');
error_reporting(E_ALL);

$executionStartTime = microtime(true);

include('config.php');

header('Content-Type: application/json; charset=UTF-8');

$conn = new mysqli($cd_host, $cd_user, $cd_password, $cd_dbname, $cd_port, $cd_socket);

if (mysqli_connect_errno()) {
    $output['status'] = [
        'code' => '300',
        'name' => 'failure',
        'description' => 'database unavailable'
    ];
    $output['data'] = [];
    echo json_encode($output);
    exit;
}

$location = $_GET['location'] ?? '';

$stmt = $conn->prepare('
    SELECT DISTINCT d.name 
    FROM department d
    JOIN location l ON d.locationID = l.id
    WHERE l.name = ?
');
$stmt->bind_param('s', $location);
$stmt->execute();

$result = $stmt->get_result();
$data = [];

while ($row = $result->fetch_assoc()) {
    $data[] = $row['name'];
}

$output['status'] = [
    'code' => '200',
    'name' => 'ok',
    'description' => 'success',
    'returnedIn' => (microtime(true) - $executionStartTime) / 1000 . ' ms'
];
$output['data'] = $data;

mysqli_close($conn);
echo json_encode($output);
