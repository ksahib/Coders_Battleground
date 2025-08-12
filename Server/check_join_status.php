<?php
require_once "config.php";

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-credentials:true");
header("Content-Type: application/json");


if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['error' => 'Only GET allowed']);
    exit;
}

if (empty($_SESSION['user'])) {
    http_response_code(401);
    echo json_encode(['error' => 'Not authenticated']);
    exit;
}

$contestId = $_GET['id'] ?? null;

if (!$contestId) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing contest ID']);
    exit;
}

try {
    $stmt = $pdo->prepare("SELECT * FROM participants WHERE email = :email AND contest_id = :id");
    $stmt->execute([
        'email' => $_SESSION['user'],
        'id' => $contestId
    ]);

    $joined = $stmt->fetch(PDO::FETCH_ASSOC) !== false;

    echo json_encode(['joined' => $joined]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
}
