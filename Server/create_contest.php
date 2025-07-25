<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once 'config.php';

$json_data = file_get_contents('php://input');

if (empty($json_data)) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "No data received"]);
    exit();
}

$data = json_decode($json_data, true);

if (json_last_error() !== JSON_ERROR_NONE) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Invalid JSON data: " . json_last_error_msg()]);
    exit();
}

if (!isset($data['name']) || !isset($data['contest_info']) || 
    !isset($data['problems']) || !isset($data['type']) ||
    !isset($data['start_time']) || !isset($data['end_time'])) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Missing required fields"]);
    exit();
}

if ($data['type'] === 'INSERT') {
    try {
        $name = trim($data['name']);
        $description = trim($data['contest_info']);
        $start_time = $data['start_time'];
        $end_time = $data['end_time'];
        $problems = $data['problems'];
        
        if (empty($problems) || !is_array($problems)) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "Contest must have at least one problem"]);
            exit();
        }
        
        session_start();
        $company_name = isset($_SESSION['company_name']) ? $_SESSION['company_name'] : 'Google'; // Default for testing
        
        $contest_id = rand(1000000, 9999999);
        
        $pdo->beginTransaction();
        
        $mysql_start_date = date('Y-m-d', strtotime($start_time));
        $mysql_end_date = date('Y-m-d', strtotime($end_time));
        
        $stmt = $pdo->prepare("INSERT INTO contest (id, name, company_name, description, start, end) VALUES (:id, :name, :company_name, :description, :start, :end)");
        
        $stmt->execute([
            ':id' => $contest_id,
            ':name' => $name,
            ':company_name' => $company_name,
            ':description' => $description,
            ':start' => $mysql_start_date,
            ':end' => $mysql_end_date
        ]);
        
        $problemsAdded = 0;
        foreach ($problems as $problem) {
            if (!isset($problem['problem_id']) || empty($problem['problem_id'])) {
                continue;
            }
        
            $problem_id = intval($problem['problem_id']);
            
            $check_stmt = $pdo->prepare("SELECT problem_id FROM problems WHERE problem_id = :problem_id");
            $check_stmt->execute([':problem_id' => $problem_id]);
            
            if (!$check_stmt->fetch()) {
                error_log("Warning: Problem ID '$problem_id' does not exist in the database");
                continue;
            }
            
            $link_stmt = $pdo->prepare("INSERT INTO contest_questions (contest_id, problem_id) VALUES (:contest_id, :problem_id)");
            $link_stmt->execute([
                ':contest_id' => $contest_id,
                ':problem_id' => $problem_id
            ]);
            
            $problemsAdded++;
        }
        
        if ($problemsAdded === 0) {
            throw new Exception("No valid problems could be added to the contest.");
        }
        
        $pdo->commit();
        
        http_response_code(201);
        echo json_encode([
            "status" => "success",
            "message" => "Contest created successfully! Added $problemsAdded problems.",
            "contest_id" => $contest_id
        ]);
        
    } catch (PDOException $e) {
        if ($pdo->inTransaction()) {
            $pdo->rollBack();
        }
        http_response_code(500);
        echo json_encode([
            "status" => "error",
            "message" => "Database error: " . $e->getMessage()
        ]);
    } catch (Exception $e) {
        if ($pdo->inTransaction()) {
            $pdo->rollBack();
        }
        http_response_code(500);
        echo json_encode([
            "status" => "error",
            "message" => $e->getMessage()
        ]);
    }
} else {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Invalid operation type"]);
}
?>