<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-credentials:true");
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
if (!isset($data['contestName']) || !isset($data['contestDescription']) || 
    !isset($data['startTime']) || !isset($data['endTime'])) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Missing required fields"]);
    exit();
}

try {
    // Clean inputs
    $name = trim($data['contestName']);
    $description = trim($data['contestDescription']);
    $start_time = $data['startTime'];
    $end_time = $data['endTime'];
    $problems = isset($data['problems']) ? $data['problems'] : [];
    $companyProblems = isset($data['companyProblems']) ? $data['companyProblems'] : [];
    
    // Validate at least one problem
    if (empty($problems) && empty($companyProblems)) {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "Contest must have at least one problem"]);
        exit();
    }
    
    // Get company email from session and fetch the company name
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
    
    // Generate unique contest ID
    $contest_id = rand(1000000, 9999999);
    
    // Start transaction
    $pdo->beginTransaction();
    
    // Convert datetime-local to MySQL date format
    $mysql_start_date = date('Y-m-d', strtotime($start_time));
    $mysql_end_date = date('Y-m-d', strtotime($end_time));
    
    // Insert contest
    $stmt = $pdo->prepare("INSERT INTO contest (id, name, company_name, description, start, end) 
                          VALUES (:id, :name, :company_name, :description, :start, :end)");
    
    $stmt->execute([
        ':id' => $contest_id,
        ':name' => $name,
        ':company_name' => $company_name,
        ':description' => $description,
        ':start' => $mysql_start_date,
        ':end' => $mysql_end_date
    ]);
    
    $problemsAdded = 0;
    $problemErrors = [];
    
    // Add existing problems from the problems array
    foreach ($problems as $problem) {
        if (!isset($problem['id']) || !isset($problem['title']) || !isset($problem['score'])) {
            $problemErrors[] = "Invalid problem data structure";
            continue;
        }
        
        $problem_id = intval($problem['id']);
        $problem_title = trim($problem['title']);
        $score = intval($problem['score']);
        
        // Verify problem exists
        $check_stmt = $pdo->prepare("SELECT problem_id FROM problems WHERE problem_id = :problem_id");
        $check_stmt->execute([':problem_id' => $problem_id]);
        
        if (!$check_stmt->fetch()) {
            $problemErrors[] = "Problem ID $problem_id does not exist";
            continue;
        }
        
        // Insert into contest_questions
        $link_stmt = $pdo->prepare("INSERT INTO contest_questions (contest_id, problem_id, problem_title, score) 
                                   VALUES (:contest_id, :problem_id, :problem_title, :score)");
        
        $link_stmt->execute([
            ':contest_id' => $contest_id,
            ':problem_id' => $problem_id,
            ':problem_title' => $problem_title,
            ':score' => $score
        ]);
        
        $problemsAdded++;
    }
    
    // Handle company problems
    foreach ($companyProblems as $companyProblem) {
        if (!isset($companyProblem['name']) || !isset($companyProblem['title']) || !isset($companyProblem['score'])) {
            $problemErrors[] = "Invalid company problem data";
            continue;
        }
        
        // For company problems, check if they exist in company_problems table
        $company_prob_name = trim($companyProblem['name']);
        $problem_title = trim($companyProblem['title']);
        $score = intval($companyProblem['score']);
        
        // Get problem_id from company_problems table
        $comp_stmt = $pdo->prepare("SELECT problem_id FROM company_problems WHERE name = :company_name LIMIT 1");
        $comp_stmt->execute([':company_name' => $company_name]);
        $comp_result = $comp_stmt->fetch();
        
        if ($comp_result) {
            $problem_id = $comp_result['problem_id'];
            
            // Insert into contest_questions
            $link_stmt = $pdo->prepare("INSERT INTO contest_questions (contest_id, problem_id, problem_title, score) 
                                       VALUES (:contest_id, :problem_id, :problem_title, :score)");
            
            $link_stmt->execute([
                ':contest_id' => $contest_id,
                ':problem_id' => $problem_id,
                ':problem_title' => $problem_title,
                ':score' => $score
            ]);
            
            $problemsAdded++;
        } else {
            $problemErrors[] = "No company problems found for " . $company_name;
        }
    }
    
    // Check if any problems were added
    if ($problemsAdded === 0) {
        throw new Exception("No valid problems could be added. Errors: " . implode(", ", $problemErrors));
    }
    
    // Commit transaction
    $pdo->commit();
    
    // Prepare response
    $message = "Contest created successfully! Added $problemsAdded problems.";
    if (!empty($problemErrors)) {
        $message .= " Issues: " . implode(", ", $problemErrors);
    }
    
    http_response_code(201);
    echo json_encode([
        "status" => "success",
        "message" => $message,
        "contest_id" => $contest_id,
        "problems_added" => $problemsAdded
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
