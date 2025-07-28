<?php
require_once 'connection.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');    
header('Access-Control-Allow-Methods: POST'); 
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
   
    $email = "sadik@gmail.com"; 

    $id   = $_POST['prbID'] ?? null;
    $code = $_POST['code'] ?? null;
    $time = $_POST['time'] ?? null;
    $mem  = $_POST['mem'] ?? null;
    $lang = $_POST['lang'] ?? null;

   
    if (!$id || !$code || !$time || !$mem || !$lang) {
        echo json_encode(['success' => false, 'message' => 'Missing fields in request']);
        exit;
    }

    try {
        $stmt = $pdo->prepare("
            INSERT INTO solutions (problem_id, email, runtime, memory_usage, langauge, code_text)
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
