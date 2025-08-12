<?php
require_once "config.php";
header("Content-Type: application/json");

if (empty($_SESSION['user'])) {
    http_response_code(401);
    echo json_encode(['error' => 'Not authenticated']);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);

if (empty($data['url'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing image URL']);
    exit;
}

try {
    $stmt = $pdo->prepare("INSERT INTO image (email, image_url) VALUES (:email, :url)");
    $stmt->execute([
        'email' => $_SESSION['user'],
        'url' => $data['url']
    ]);
    echo json_encode(['success' => true]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
