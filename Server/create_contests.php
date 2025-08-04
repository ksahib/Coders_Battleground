<?php

    ini_set('display_errors', 1);
    error_reporting(E_ALL);
    
    header('Content-Type: application/json');
    header("Access-Control-Allow-Origin: https://codersbattleground.test");
    header("Access-Control-Allow-credentials:true");
    session_start();
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        http_response_code(405);
        echo json_encode(['error' => 'Only POST allowed']);
        exit;
    }

    // 2. Read & decode JSON
    try {
        $raw = file_get_contents('php://input');
        $data = json_decode($raw, true);
    } catch (ERRMODE_EXCEPTION $e) {
        echo json_encode(["error"=> $e]);
    }

    // handle JSON parse errors
    if (json_last_error() !== JSON_ERROR_NONE) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid JSON']);
        exit;
    }

    // 3. Extract fields (with defaults)
    $contestName        = trim($data['contestName'] ?? '');
    $contestDescription = trim($data['contestDescription'] ?? '');
    $startTime          = $data['startTime'] ?? '';
    $endTime            = $data['endTime'] ?? '';
    $problems           = $data['problems']     ?? []; 

    require_once "config.php";
    require_once "init.php";
    $user_id = '123';
    $_SESSION['user_id'] = $user_id;

    try {
        if(isset($_SESSION['user_id'])) {
            $stmt = $pdo->prepare("
            INSERT INTO contest
                (id, name, company_id, description, start, end)
            VALUES
                (:id, :name, :company_id, :descr, :start, :end)
            ");

            $stmt->execute([
            ':id' => mt_rand(),
            ':name'  => $contestName,
            ':company_id' => $_SESSION['user_id'],
            ':descr' => $contestDescription,
            ':start' => $startTime,
            ':end'   => $endTime,
            ]);
            echo json_encode(["success"=>true]);
        } else {
            http_response_code(401);
            echo json_encode(['error' => 'Not authenticated']);
            exit;
        }
    } catch(PDOException $e){
        echo json_encode(["success"=>false,"error"=>$e->getMessage()]);
    }


?>