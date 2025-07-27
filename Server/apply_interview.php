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

require_once 'config.php';

// Start session to get user email
//session_start();

// Check if user is logged in
if (!isset($_SESSION['user'])) {
    // http_response_code(401);
    // echo json_encode([
    //     'status' => 'error',
    //     'message' => 'Please login to apply for interviews'
    // ]);
    // exit();
    $user_email = 'AdminUser@gmail.com';    
} else {
    $user_email = $_SESSION['user'];
}

// Get JSON data
$json_data = file_get_contents('php://input');
$data = json_decode($json_data, true);

if (!isset($data['interview_id'])) {
    http_response_code(400);
    echo json_encode([
        'status' => 'error',
        'message' => 'Interview ID is required'
    ]);
    exit();
}

$interview_id = intval($data['interview_id']);

try {
    // Check if interview exists
    $check_interview = $pdo->prepare("SELECT interview_id FROM interview WHERE interview_id = :interview_id");
    $check_interview->execute([':interview_id' => $interview_id]);
    
    if (!$check_interview->fetch()) {
        http_response_code(404);
        echo json_encode([
            'status' => 'error',
            'message' => 'Interview not found'
        ]);
        exit();
    }
    
    // Check if already applied
    $check_applied = $pdo->prepare("SELECT * FROM interview_apply WHERE interview_id = :interview_id AND email = :email");
    $check_applied->execute([
        ':interview_id' => $interview_id,
        ':email' => $user_email
    ]);
    
    if ($check_applied->fetch()) {
        http_response_code(400);
        echo json_encode([
            'status' => 'error',
            'message' => 'You have already applied for this position'
        ]);
        exit();
    }
    
    // Apply for the interview
    $apply_stmt = $pdo->prepare("INSERT INTO interview_apply (interview_id, email, job_status) VALUES (:interview_id, :email, 'Applied')");
    $apply_stmt->execute([
        ':interview_id' => $interview_id,
        ':email' => $user_email
    ]);
    
    echo json_encode([
        'status' => 'success',
        'message' => 'Successfully applied for the position!'
    ]);
    
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'Database error: ' . $e->getMessage()
    ]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => $e->getMessage()
    ]);
}
?>