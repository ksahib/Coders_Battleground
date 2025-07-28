<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Include database connection
require_once 'config.php';

// Start session only if not already started
if (session_status() == PHP_SESSION_NONE) {
    session_start();
}

// Get JSON data
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

// Validate required fields
if (!isset($data['location_id']) || !isset($data['position_open']) || 
    !isset($data['job_description']) || !isset($data['start']) || 
    !isset($data['job_type']) || !isset($data['rounds'])) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Missing required fields"]);
    exit();
}

try {
    // Clean inputs
    $location_id = trim($data['location_id']);
    $position_open = trim($data['position_open']);
    $job_description = trim($data['job_description']);
    $start_date = $data['start'];
    $job_type = trim($data['job_type']);
    $rounds = $data['rounds'];
    
    // Validate rounds
    if (empty($rounds) || !is_array($rounds)) {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "Interview must have at least one round"]);
        exit();
    }
    
    // Get company name from session
    if (!isset($_SESSION['user'])) {
        // Fallback to 'Admin' if no email is set in the session (testing purposes)
        $company_name = 'Admin';
    } else {
        $email = $_SESSION['user'];
        
        // Query the company table to get the company name using the session email
        $company_check = $pdo->prepare("SELECT name FROM company WHERE email = :email");
        $company_check->execute([':email' => $email]);
        $company_result = $company_check->fetch();
        
        if (!$company_result) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "Company not found for email: " . $email]);
            exit();
        }
        
        $company_name = $company_result['name'];
    }
    
    // Verify location exists
    $location_check = $pdo->prepare("SELECT location_id FROM locations WHERE location_id = :location_id");
    $location_check->execute([':location_id' => $location_id]);
    if (!$location_check->fetch()) {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "Invalid location ID"]);
        exit();
    }
    
    // Generate unique interview ID
    $interview_id = rand(100000, 999999);
    
    // Start transaction
    $pdo->beginTransaction();
    
    // Convert date to MySQL format
    $mysql_start_date = date('Y-m-d', strtotime($start_date));
    
    // Insert interview
    $stmt = $pdo->prepare("INSERT INTO interview (interview_id, company_name, position_open, location_id, job_description, start, job_type) 
                          VALUES (:interview_id, :company_name, :position_open, :location_id, :job_description, :start, :job_type)");
    
    $stmt->execute([
        ':interview_id' => $interview_id,
        ':company_name' => $company_name,
        ':position_open' => $position_open,
        ':location_id' => $location_id,
        ':job_description' => $job_description,
        ':start' => $mysql_start_date,
        ':job_type' => $job_type
    ]);
    
    $roundsAdded = 0;
    $questionsAdded = 0;
    $roundErrors = [];
    
    // Add interview rounds
    foreach ($rounds as $round) {
        if (!isset($round['round_name']) || !isset($round['start']) || !isset($round['end'])) {
            $roundErrors[] = "Invalid round data structure";
            continue;
        }
        
        $round_name = trim($round['round_name']);
        $round_start = $round['start'];
        $round_end = $round['end'];
        
        // Convert datetime-local to MySQL datetime format
        $mysql_round_start = date('Y-m-d H:i:s', strtotime($round_start));
        $mysql_round_end = date('Y-m-d H:i:s', strtotime($round_end));
        
        // Insert interview round
        $round_stmt = $pdo->prepare("INSERT INTO interview_round (interview_id, start, end, round_name) 
                                    VALUES (:interview_id, :start, :end, :round_name)");
        
        $round_stmt->execute([
            ':interview_id' => $interview_id,
            ':start' => $mysql_round_start,
            ':end' => $mysql_round_end,
            ':round_name' => $round_name
        ]);
        
        $round_id = $pdo->lastInsertId();
        $roundsAdded++;
        
        // Add questions for this round
        if (isset($round['questions']) && is_array($round['questions'])) {
            foreach ($round['questions'] as $question) {
                if (!isset($question['question_name']) || !isset($question['type']) || !isset($question['description'])) {
                    continue;
                }
                
                $question_name = trim($question['question_name']);
                $question_type = trim($question['type']);
                $question_description = trim($question['description']);
                
                // Insert round question
                $question_stmt = $pdo->prepare("INSERT INTO round_questions (question_name, type, description, round_id) 
                                               VALUES (:question_name, :type, :description, :round_id)");
                
                $question_stmt->execute([
                    ':question_name' => $question_name,
                    ':type' => $question_type,
                    ':description' => $question_description,
                    ':round_id' => $round_id
                ]);
                
                $questionsAdded++;
            }
        }
    }
    
    // Check if any rounds were added
    if ($roundsAdded === 0) {
        throw new Exception("No valid rounds could be added. Errors: " . implode(", ", $roundErrors));
    }
    
    // Commit transaction
    $pdo->commit();
    
    // Prepare response message
    $message = "Interview created successfully! Added $roundsAdded rounds";
    if ($questionsAdded > 0) {
        $message .= " with $questionsAdded questions";
    }
    $message .= ".";
    
    if (!empty($roundErrors)) {
        $message .= " Issues: " . implode(", ", $roundErrors);
    }
    
    http_response_code(201);
    echo json_encode([
        "status" => "success",
        "message" => $message,
        "interview_id" => $interview_id,
        "rounds_added" => $roundsAdded,
        "questions_added" => $questionsAdded
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
?>