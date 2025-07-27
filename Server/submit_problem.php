<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Include database connection from config.php
require_once 'config.php';

// Get JSON data from request body
$json_data = file_get_contents('php://input');
$data = json_decode($json_data, true);

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

// Validate required fields
if (!isset($data['name']) || !isset($data['description']) || 
    !isset($data['difficulty']) || !isset($data['type']) ||
    !isset($data['input']) || !isset($data['output'])) {
    http_response_code(400);
    echo json_encode(array("status" => "error", "message" => "Missing required fields"));
    exit();
}

// Handle INSERT operation
if ($data['type'] === 'INSERT') {
    // Clean and validate input
    $name = trim($data['name']);
    $description = trim($data['description']);
    $input = trim($data['input']);
    $output = trim($data['output']);
    $difficulty = trim($data['difficulty']);
    $tags = isset($data['tags']) ? $data['tags'] : array();
    
    // Validate difficulty level
    $allowed_difficulties = array('Easy', 'Medium', 'Hard');
    if (!in_array($difficulty, $allowed_difficulties)) {
        http_response_code(400);
        echo json_encode(array("status" => "error", "message" => "Invalid difficulty level"));
        exit();
    }
    
    // Start transaction
    $pdo->beginTransaction();
    
    try {
        // Insert problem into problems table (problem_id is auto-increment)
        $stmt = $pdo->prepare("INSERT INTO problems (name, description, difficulty, input, output) 
                              VALUES (:name, :description, :difficulty, :input, :output)");
        
        $stmt->execute([
            ':name' => $name,
            ':description' => $description,
            ':difficulty' => $difficulty,
            ':input' => $input,
            ':output' => $output
        ]);
        
        // Get the auto-generated problem_id
        $problem_id = $pdo->lastInsertId();
        
        // Insert into company_problems table with problem_id and company_name
        $company_problem_stmt = $pdo->prepare("INSERT INTO company_problems (problem_id, name) 
                                              VALUES (:problem_id, :company_name)");
        $company_problem_stmt->execute([
            ':problem_id' => $problem_id,
            ':company_name' => $company_name
        ]);
        
        // Handle tags if provided
        if (!empty($tags)) {
            foreach ($tags as $tag) {
                $tag = trim($tag);
                if (empty($tag)) continue;
                
                // Insert tag into problem_tags table
                $tag_stmt = $pdo->prepare("INSERT INTO problem_tags (tag_name, problem_id) VALUES (:tag_name, :problem_id)");
                $tag_stmt->execute([
                    ':tag_name' => $tag,
                    ':problem_id' => $problem_id
                ]);
            }
        }
        
        // Commit transaction
        $pdo->commit();
        
        http_response_code(201);
        echo json_encode(array(
            "status" => "success",
            "message" => "Problem submitted successfully!",
            "problem_id" => $problem_id
        ));
        
    } catch (Exception $e) {
        // Rollback transaction on error
        $pdo->rollBack();
        http_response_code(500);
        echo json_encode(array(
            "status" => "error",
            "message" => "Failed to submit problem: " . $e->getMessage()
        ));
    }
} else {
    http_response_code(400);
    echo json_encode(array("status" => "error", "message" => "Invalid operation type"));
}
?>
