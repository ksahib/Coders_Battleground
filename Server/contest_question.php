<?php
header('Content-Type: application/json');

require 'config.php';  



$contestId = isset($_GET['id'])?trim($_GET['id']):null;

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $user, $pass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    ]);

    $stmt = $pdo->prepare("
        SELECT p.* 
        FROM contest_questions cq
        JOIN problems p ON cq.problem_id = p.problem_id
        WHERE cq.contest_id = :contest_id
    ");

    $stmt->execute(['contest_id' => $contestId]);

    $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($results);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
}
