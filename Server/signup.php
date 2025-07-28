<?php
require_once 'config.php';
header('Content-Type: application/json');

$raw  = file_get_contents('php://input');
$data = json_decode($raw, true);

// debug
// file_put_contents(__DIR__.'/debug-signup.log', $raw . PHP_EOL, FILE_APPEND);

$username = trim($data['username'] ?? '');
$email    = trim($data['email']    ?? '');
$password = trim($data['password'] ?? '');

if ($username === '' || $email === '' || $password === '') {
    echo json_encode([
        'success' => false,
        'error'   => 'Please fill in all required fields.'
    ]);
    exit;
}

try {
    // check for existing user
    $stmt = $pdo->prepare("SELECT 1 FROM users WHERE email = ?");
    $stmt->execute([$email]);
    if ($stmt->fetch()) {
        echo json_encode(['success'=>false,'error'=>'This email is already registered.']);
        exit;
    }

    // hash & insert
    $hashed = password_hash($password, PASSWORD_DEFAULT);
    $insertSql = "INSERT INTO users
                    (email, password, name, subscription_type, role)
                  VALUES (?, ?, ?, 'free', 'user')";
    $stmt = $pdo->prepare($insertSql);
    $stmt->execute([$email, $hashed, $username]);

    echo json_encode(['success'=>true,'message'=>'Signup successful!']);
    exit;

} catch (PDOException $e) {
    echo json_encode(['success'=>false,'error'=>'Server error.']);
    exit;
}
