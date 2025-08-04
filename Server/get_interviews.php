<?php

require_once 'config.php';

header('Content-Type: application/json');
header("Access-Control-Allow-Origin: https://codersbattleground.test");
header("Access-Control-Allow-credentials:true");
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type');

// Start session to get user email
//session_start();
if (empty($_SESSION['user'])) {
    http_response_code(402);
    exit(json_encode(['error' => 'Not authenticated']));
}
$user_email = $_SESSION['user'];

try {
    // Get all interviews with location details and application status
    $query = "
        SELECT 
            i.interview_id,
            i.company_name,
            i.position_open,
            i.job_description,
            i.start,
            i.job_type,
            CONCAT(l.area, ', ', l.city, ', ', l.country) as location,
            (SELECT COUNT(*) FROM interview_round WHERE interview_id = i.interview_id) as rounds_count,
            CASE 
                WHEN ia.email IS NOT NULL THEN 1 
                ELSE 0 
            END as is_applied
        FROM interview i
        JOIN locations l ON i.location_id = l.location_id
        LEFT JOIN interview_apply ia ON i.interview_id = ia.interview_id 
            AND ia.email = :user_email
        ORDER BY i.start DESC
    ";
    
    $stmt = $pdo->prepare($query);
    $stmt->execute([':user_email' => $user_email]);
    $interviews = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Format the data
    foreach ($interviews as &$interview) {
        $interview['interview_id'] = intval($interview['interview_id']);
        $interview['rounds_count'] = intval($interview['rounds_count']);
        $interview['is_applied'] = (bool)$interview['is_applied'];
        $interview['start'] = date('Y-m-d', strtotime($interview['start']));
    }
    
    echo json_encode([
        'status' => 'success',
        'user' => $user_email,
        'data' => $interviews
    ]);
    
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'user' => $user_email,
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