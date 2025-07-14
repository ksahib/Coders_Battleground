<?php
require_once 'config.php';
header('Content-Type: application/json');

// Read raw JSON input
$raw = file_get_contents('php://input');
$data = json_decode($raw, true);

// Map JSON keys
$username    = trim($data['username']    ?? '');
$email       = trim($data['email']       ?? '');
$password    = trim($data['password']    ?? '');
$isCompany   = !empty($data['is_company']);  // expects true/false in JSON

if ($username === '' || $email === '' || $password === '') {
    echo json_encode([
        'success' => false,
        'error'   => 'Please fill in all required fields.'
    ]);
    exit;
}

try {
    if ($isCompany) {
        $checkSql = "SELECT 1 FROM company WHERE email = ?";
    } else {
        $checkSql = "SELECT 1 FROM users   WHERE email = ?";
    }
    $stmt = $pdo->prepare($checkSql);
    $stmt->execute([$email]);

    if ($stmt->fetch()) {
        echo json_encode([
            'success' => false,
            'error'   => 'This email is already registered.'
        ]);
        exit;
    }

    // Hash and insert
    $hashed = password_hash($password, PASSWORD_DEFAULT);
    if ($isCompany) {
        $insertSql = "INSERT INTO company 
                          (name, email, password) 
                      VALUES (?, ?, ?)";
        $stmt = $pdo->prepare($insertSql);
        $stmt->execute([$username, $email, $hashed]);
    } else {
        $insertSql = "INSERT INTO users 
                          (email, password, name, subscription_type, role) 
                      VALUES (?, ?, ?, 'free', 'user')";
        $stmt = $pdo->prepare($insertSql);
        $stmt->execute([$email, $hashed, $username]);
    }

    echo json_encode([
        'success' => true,
        'message' => 'Signup successful!'
    ]);
    exit;

} catch (PDOException $e) {
    echo json_encode([
        'success' => false,
        'error'   => 'Server error.'
    ]);
    exit;
}
?>
