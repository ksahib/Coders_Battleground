<?php
require_once "config.php";
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");


if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    exit(json_encode(['error' => 'Only POST allowed']));
}

if (empty($_SESSION['user'])) {
    http_response_code(402);
    exit(json_encode(['error' => 'Not authenticated']));
}


try {

    $stmt_user = $pdo->prepare("SELECT name FROM users WHERE email = :email");
    $stmt_user->execute(['email' => $_SESSION['user']]);
    $user = $stmt_user->fetch(PDO::FETCH_ASSOC);

    echo json_encode([
        'success'  => true,
        'user'     => $user['name'] ?? 'Guest',

    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
}
