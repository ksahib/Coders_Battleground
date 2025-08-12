<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-credentials:true");
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type');

require_once 'config.php';

// Start session to get user email
//session_start();

try {
    // Check if user is logged in
    if (empty($_SESSION['user'])) {
        http_response_code(402);
        exit(json_encode(['error' => 'Not authenticated']));
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
    
    // Base rating
    $base_rating = 1500;
    
    // Query to get all rating changes for the user
    $query = "
        SELECT 
            cr.contest_id,
            cr.rating_change,
            c.name as contest_name,
            c.company_name,
            c.start as contest_date
        FROM contest_rating cr
        INNER JOIN contest c ON cr.contest_id = c.id
        WHERE cr.email = :email
        ORDER BY c.start ASC
    ";
    
    $stmt = $pdo->prepare($query);
    $stmt->execute([':email' => $email]);
    $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Calculate cumulative ratings
    $contestHistory = [];
    $running_rating = $base_rating;
    
    foreach ($results as $row) {
        $rating_change = intval($row['rating_change']);
        $new_rating = $running_rating + $rating_change;
        
        $contestHistory[] = [
            'contest_id' => $row['contest_id'],
            'name' => $row['contest_name'],
            'company' => $row['company_name'],
            'date' => $row['contest_date'],
            'rating_change' => $rating_change,
            'new_rating' => $new_rating,
            'rank' => null // Rank not available in contest_rating table
        ];
        
        $running_rating = $new_rating;
    }
    
    // Reverse to show newest first
    $contestHistory = array_reverse($contestHistory);
    
    // Return success response
    echo json_encode([
        'success' => true,
        'data' => $contestHistory,
        'username' => $user['name'],
        'current_rating' => $running_rating,
        'total_contests' => count($contestHistory)
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