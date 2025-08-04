<?php
require_once 'config.php';

header('Content-Type: application/json');
header("Access-Control-Allow-Origin: https://codersbattleground.test");
header("Access-Control-Allow-credentials:true");  
header('Access-Control-Allow-Methods: POST'); 
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
   
    $email = $_SESSION['user']; 

$data = json_decode(file_get_contents("php://input"), true);
$id   = $data['prbId'] ?? null;
$code = htmlspecialchars(trim($data['code'] ?? ''));
$time = $data['time'] ?? null;
$mem  = $data['mem'] ?? null;
$lang = $data['lang'] ?? null;

   
    if (!$id || !$code || !$time || !$mem || !$lang) {
        echo json_encode(['success' => false, 'message' => 'Missing fields in request']);
        exit;
    }

    try {
        $stmt = $pdo->prepare("
            INSERT INTO solutions (problem_id, email, runtime, memory_usage, language, code)
            VALUES (:id, :email, :time, :mem, :lang, :code)
        ");
        $stmt->execute([
            ':id'    => $id,
            ':email' => $email,
            ':time'  => $time,
            ':mem'   => $mem,
            ':lang'  => $lang,
            ':code'  => $code
        ]);

        echo json_encode(['success' => true, 'message' => 'Problem submitted successfully']);
    } catch (PDOException $e) {
        echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
    }

} else {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
}
