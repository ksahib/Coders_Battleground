<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type');

require_once 'config.php';

// Start session to get user email
//session_start();

try {
    // Check if user is logged in
    if (!isset($_SESSION['user'])) {
        $_SESSION['user'] = 'AdminUser@gmail.com'; // For testing purposes, remove this in production
    }
    
    $email = $_SESSION['user'];
    
    // First, get the user's name
    $userQuery = "SELECT name FROM users WHERE email = :email";
    $userStmt = $pdo->prepare($userQuery);
    $userStmt->execute([':email' => $email]);
    $user = $userStmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$user) {
        throw new Exception('User not found');
    }
    
    // Query to get interview history for the user
    $query = "
        SELECT 
            ia.interview_id,
            i.company_name as company,
            i.position_open as role,
            i.start as interview_date,
            ia.job_status as status,
            CONCAT(l.area, ', ', l.city, ', ', l.country) as location,
            COUNT(ir.round_id) as total_rounds,
            (
                SELECT ir2.round_name 
                FROM interview_round ir2 
                WHERE ir2.interview_id = i.interview_id 
                ORDER BY ir2.start DESC 
                LIMIT 1
            ) as current_round
        FROM interview_apply ia
        INNER JOIN interview i ON ia.interview_id = i.interview_id
        INNER JOIN locations l ON i.location_id = l.location_id
        LEFT JOIN interview_round ir ON i.interview_id = ir.interview_id
        WHERE ia.email = :email
        GROUP BY ia.interview_id, i.company_name, i.position_open, i.start, ia.job_status, l.area, l.city, l.country
        ORDER BY i.start DESC
    ";
    
    $stmt = $pdo->prepare($query);
    $stmt->execute([':email' => $email]);
    $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Process the results
    $interviewHistory = [];
    
    foreach ($results as $row) {
        // Determine the round name
        $roundName = 'Application';
        if ($row['current_round']) {
            $roundName = $row['current_round'];
        }
        
        // Format status for display
        $status = ucfirst(strtolower($row['status']));
        
        // If status is "Applied" and there are rounds, status might be "In Progress"
        if ($status === 'Applied' && $row['total_rounds'] > 0) {
            $status = 'In Progress';
        }
        
        $interviewHistory[] = [
            'date' => $row['interview_date'],
            'company' => $row['company'],
            'role' => $row['role'],
            'round' => $roundName,
            'status' => $status,
            'location' => $row['location']
        ];
    }
    
    // Return success response
    echo json_encode([
        'success' => true,
        'data' => $interviewHistory,
        'username' => $user['name'],
        'total_records' => count($interviewHistory)
    ]);
    
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Database error: ' . $e->getMessage()
    ]);
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
?>