<?php
require 'PHPMailer/PHPMailer.php';
require 'PHPMailer/SMTP.php';
require 'PHPMailer/Exception.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

header('Content-Type: application/json');

// Load SMTP credentials
$config = require __DIR__ . '/.env.php';

$response = ['status' => 'error', 'message' => 'Something went wrong'];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $name = htmlspecialchars($_POST['name']);
  $email = filter_var($_POST['email'], FILTER_VALIDATE_EMAIL);
  $message = htmlspecialchars($_POST['message']);

  if (!$name || !$email || !$message) {
    $response['message'] = 'Please fill in all fields correctly.';
    echo json_encode($response);
    exit;
  }

  $mail = new PHPMailer(true);

  try {
    // SMTP Configuration
    $mail->isSMTP();
    $mail->Host = 'smtp.hostinger.com';
    $mail->SMTPAuth = true;
    $mail->Username = $config['email'];
    $mail->Password = $config['password'];
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port = 587;

    // Sender and recipient
    $mail->setFrom($config['email'], 'Portfolio Website');
    $mail->addAddress($config['email']); // Send to yourself

    // Email content
    $mail->isHTML(true);
    $mail->Subject = 'New message from portfolio website';
    $mail->Body = <<<HTML
      <p><strong>Name:</strong> $name</p>
      <p><strong>Email:</strong> $email</p>
      <p><strong>Message:</strong></p>
      <p>$message</p>
    HTML;

    $mail->send();
    $response['status'] = 'success';
    $response['message'] = 'Message sent successfully!';
  } catch (Exception $e) {
    $response['message'] = "Mailer Error: {$mail->ErrorInfo}";
  }
}

echo json_encode($response);