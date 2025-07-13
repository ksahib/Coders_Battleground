<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

require_once "config.php";

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    exit(json_encode(['error' => 'Only POST allowed']));
}

if (empty($_SESSION['user'])) {
    http_response_code(401);
    exit(json_encode(['error' => 'Not authenticated']));
}


try {
    $sql = "
        SELECT
            id            AS contest_id,
            name          AS contest_name,
            company_name
        FROM contest
        LIMIT 20
    ";
    $sql2 = "
        SELECT interview_id, company_name, position_open
        FROM interview
    ";
    $stmt = $pdo->prepare($sql);
    $stmt_interviews = $pdo->prepare($sql2);
    $stmt->execute();
    $stmt_interviews->execute();
    $contests = $stmt->fetchAll(PDO::FETCH_ASSOC);
    $interviews = $stmt_interviews->fetchAll(PDO::FETCH_ASSOC);

    $stmt_user = $pdo->prepare("SELECT name FROM users WHERE email = :email");
    $stmt_user->execute(['email' => $_SESSION['user']]);
    $user = $stmt_user->fetch(PDO::FETCH_ASSOC);

    echo json_encode([
        'success'  => true,
        'user'     => $user['name'] ?? 'Guest',
        'contests' => $contests,
        'interviews' => $interviews

    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
}
