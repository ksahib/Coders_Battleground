<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type');

require_once 'config.php';

try {
    $query = "
        SELECT 
            u.email as username,
            u.name,
            COUNT(DISTINCT s.problem_id) as problems_solved,
            COALESCE(SUM(pd.points), 0) as total_points,
            COUNT(DISTINCT c.contest_id) as contests_participated
        FROM users u
        LEFT JOIN solutions s ON u.email = s.email
        LEFT JOIN problems p ON s.problem_id = p.problem_id
        LEFT JOIN points_dist pd ON p.difficulty = pd.difficulty
        LEFT JOIN participants c ON u.email = c.email
        WHERE u.role = 'user'
        GROUP BY u.email, u.name
        ORDER BY total_points DESC, problems_solved DESC
    ";
    
    $stmt = $pdo->query($query);
    $rankings = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    $rank = 1;
    foreach ($rankings as &$user) {
        $user['rank'] = $rank++;
        $user['rating'] = 1200 + intval($user['total_points']) * 10;
        $user['contests'] = intval($user['contests_participated']);
        $user['username'] = $user['username'];
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