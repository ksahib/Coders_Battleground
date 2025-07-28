<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type');

require_once 'config.php';

// Start session to get user email
session_start();

try {
    // Check if user is logged in
    if (!isset($_SESSION['user'])) {
        // Return empty array if not logged in
        echo json_encode([
            'status' => 'success',
            'data' => [],
            'message' => 'User not logged in'
        ]);
        exit();
    }
    
    $user_email = $_SESSION['user'];
    
    // Get contests where user participated
    $query = "
        SELECT 
            c.id,
            c.name,
            c.company_name,
            c.description,
            c.start,
            c.end,
            COALESCE(cr.rating_change, 0) as rating_change
        FROM participants p
        INNER JOIN contest c ON p.contest_id = c.id
        LEFT JOIN contest_rating cr ON c.id = cr.contest_id AND cr.email = p.email
        WHERE p.email = :email
        ORDER BY c.start DESC
    ";
    
    $stmt = $pdo->prepare($query);
    $stmt->execute([':email' => $user_email]);
    $contests = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Format the data
    foreach ($contests as &$contest) {
        $contest['id'] = intval($contest['id']);
        $contest['rating_change'] = intval($contest['rating_change']);
        $contest['start'] = date('Y-m-d H:i:s', strtotime($contest['start']));
        $contest['end'] = date('Y-m-d H:i:s', strtotime($contest['end']));
        
        // Add status
        $now = new DateTime();
        $start_date = new DateTime($contest['start']);
        $end_date = new DateTime($contest['end']);
        
        if ($now < $start_date) {
            $contest['status'] = 'upcoming';
        } elseif ($now > $end_date) {
            $contest['status'] = 'ended';
        } else {
            $contest['status'] = 'live';
        }
    }
    
    echo json_encode([
        'status' => 'success',
        'data' => $contests,
        'total' => count($contests),
        'user' => $user_email
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