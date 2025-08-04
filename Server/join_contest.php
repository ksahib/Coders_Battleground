<?php
require_once "config.php";

header("Access-Control-Allow-Origin: https://codersbattleground.test");
header("Access-Control-Allow-credentials:true");
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

$data = json_decode(file_get_contents("php://input"), true);

if (empty($data['contest_id'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing contest_id']);
    exit;
}

try {
    $sql = $pdo->prepare("INSERT INTO participants (email, contest_id) VALUES (:email, :id)");
    $sql->execute([
        'email'=>$_SESSION['user'], 'id'=>$data['contest_id']
    ]);
    $exec = $sql->fetch(PDO::FETCH_ASSOC);

    echo json_encode([
        'success' => true,
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
}



?>