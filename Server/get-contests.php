<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-credentials:true");
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type');

require_once 'config.php';

try {
    // Get all contests with company information
    $query = "
        SELECT 
            c.id,
            c.name,
            c.company_name,
            c.description,
            c.start,
            c.end
        FROM contest c
        ORDER BY c.start DESC
    ";
    
    $stmt = $pdo->query($query);
    $contests = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Format the data
    foreach ($contests as &$contest) {
        $contest['id'] = intval($contest['id']);
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
        'total' => count($contests)
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