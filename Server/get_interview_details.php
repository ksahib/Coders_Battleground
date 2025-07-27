<?php
require_once 'config.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type');

// Start session so we can check authentication
session_start();
if (empty($_SESSION['user'])) {
    http_response_code(401);
    exit(json_encode(['status'=>'error','message'=>'Not authenticated']));
}
$user_email = $_SESSION['user'];

// Validate incoming parameter
if (empty($_GET['interview_id']) || !ctype_digit($_GET['interview_id'])) {
    http_response_code(400);
    exit(json_encode(['status'=>'error','message'=>'Invalid or missing interview_id']));
}

$interview_id = (int) $_GET['interview_id'];

try {
    // Fetch single interview with all fields + location + rounds + is_applied
    $sql = "
        SELECT 
            i.interview_id,
            i.company_name,
            i.position_open,
            i.job_description,
            DATE(i.start)            AS start,
            i.job_type,
            CONCAT(l.area, ', ', l.city, ', ', l.country) AS location,
            (SELECT COUNT(*) FROM interview_round WHERE interview_id = i.interview_id) AS rounds_count,
            CASE WHEN ia.email IS NOT NULL THEN 1 ELSE 0 END AS is_applied
        FROM interview i
        JOIN locations l 
          ON i.location_id = l.location_id
        LEFT JOIN interview_apply ia 
          ON i.interview_id = ia.interview_id 
         AND ia.email = :user_email
        WHERE i.interview_id = :interview_id
        LIMIT 1
    ";

    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        ':user_email'    => $user_email,
        ':interview_id'  => $interview_id
    ]);

    $interview = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$interview) {
        http_response_code(404);
        exit(json_encode(['status'=>'error','message'=>'Interview not found']));
    }

    // Cast types
    $interview['interview_id'] = (int)   $interview['interview_id'];
    $interview['rounds_count']   = (int)   $interview['rounds_count'];
    $interview['is_applied']     = (bool)  $interview['is_applied'];
    // `start` is already in Y-m-d via SQL DATE()

    echo json_encode([
        'status' => 'success',
        'data'   => $interview
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'status'  => 'error',
        'message' => 'Database error: ' . $e->getMessage()
    ]);
}
