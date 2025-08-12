<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-credentials:true");
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type');

require_once 'config.php';

try {
    // Base rating for all users
    $base_rating = 1500;
    
    // First, get user basic info and rating changes
    $query = "
        SELECT 
            u.email as username,
            u.name,
            (SELECT COUNT(DISTINCT problem_id) FROM solutions WHERE email = u.email) as problems_solved,
            (SELECT COALESCE(SUM(pd.points), 0) 
             FROM solutions s 
             JOIN problems p ON s.problem_id = p.problem_id 
             JOIN points_dist pd ON p.difficulty = pd.difficulty 
             WHERE s.email = u.email
             GROUP BY s.email) as total_points,
            (SELECT COUNT(DISTINCT contest_id) FROM participants WHERE email = u.email) as contests_participated,
            (SELECT COALESCE(SUM(rating_change), 0) FROM contest_rating WHERE email = u.email) as total_rating_change
        FROM users u
        WHERE u.role = 'user'
        GROUP BY u.email, u.name
    ";
    
    $stmt = $pdo->query($query);
    $rankings = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Calculate ratings and prepare data
    foreach ($rankings as &$user) {
        // Simple calculation: base rating + sum of rating changes
        $user['rating'] = $base_rating + intval($user['total_rating_change']);
        $user['contests'] = intval($user['contests_participated']);
        $user['problems_solved'] = intval($user['problems_solved']);
        $user['total_points'] = intval($user['total_points'] ?? 0);
        unset($user['total_rating_change']);
    }
    
    // Sort by rating (descending), then by points, then by problems solved
    usort($rankings, function($a, $b) {
        if ($a['rating'] != $b['rating']) {
            return $b['rating'] - $a['rating'];
        }
        if ($a['total_points'] != $b['total_points']) {
            return $b['total_points'] - $a['total_points'];
        }
        return $b['problems_solved'] - $a['problems_solved'];
    });
    
    // Assign ranks
    $rank = 1;
    foreach ($rankings as &$user) {
        $user['rank'] = $rank++;
    }
    
    echo json_encode([
        'status' => 'success',
        'data' => $rankings
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