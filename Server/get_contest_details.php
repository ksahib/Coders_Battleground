<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-credentials:true");
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type');

require_once 'config.php';

if (!isset($_GET['id'])) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Contest ID is required.']);
    exit();
}

$contest_id = intval($_GET['id']);

try {
    $stmt = $pdo->prepare("
        SELECT 
            c.name, 
            c.start, 
            c.end, 
            c.description as contest_info,
            c.company_name,
            comp.name as company_full_name
        FROM contest c
        LEFT JOIN company comp ON c.company_name = comp.name
        WHERE c.id = :contest_id
    ");
    $stmt->execute([':contest_id' => $contest_id]);
    $contest = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$contest) {
        http_response_code(404);
        echo json_encode(['status' => 'error', 'message' => 'Contest not found.']);
        exit();
    }

    $stmt = $pdo->prepare("
        SELECT 
            p.problem_id, 
            p.name, 
            p.difficulty,
            p.description,
            pd.points
        FROM problems p
        INNER JOIN contest_questions cq ON p.problem_id = cq.problem_id
        LEFT JOIN points_dist pd ON p.difficulty = pd.difficulty
        WHERE cq.contest_id = :contest_id
        ORDER BY p.problem_id
    ");
    $stmt->execute([':contest_id' => $contest_id]);
    $problems = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $stmt = $pdo->prepare("
        SELECT 
            s.email as username,
            u.name as user_name,
            COUNT(DISTINCT s.problem_id) as problems_solved,
            SUM(pd.points) as total_points
        FROM solutions s
        INNER JOIN users u ON s.email = u.email
        INNER JOIN contest_questions cq ON s.problem_id = cq.problem_id
        INNER JOIN problems p ON s.problem_id = p.problem_id
        INNER JOIN points_dist pd ON p.difficulty = pd.difficulty
        WHERE cq.contest_id = :contest_id
        GROUP BY s.email, u.name
        ORDER BY total_points DESC, problems_solved DESC
        LIMIT 3
    ");
    $stmt->execute([':contest_id' => $contest_id]);
    $rankings = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $stmt = $pdo->prepare("
        SELECT COUNT(DISTINCT email) as participant_count
        FROM participants
        WHERE contest_id = :contest_id
    ");
    $stmt->execute([':contest_id' => $contest_id]);
    $participant_count = $stmt->fetch(PDO::FETCH_ASSOC)['participant_count'];

    $response_data = [
        'details' => [
            'name' => $contest['name'],
            'start_time' => $contest['start'],
            'end_time' => $contest['end'],
            'contest_info' => $contest['contest_info'],
            'creator' => [
                'username' => $contest['company_name'],
                'name' => $contest['company_full_name'] ?? $contest['company_name']
            ],
            'participant_count' => intval($participant_count)
        ],
        'problems' => $problems,
        'top_rankings' => array_map(function($ranking) {
            return [
                'username' => $ranking['username'],
                'user_name' => $ranking['user_name'],
                'rating_change' => intval($ranking['total_points'])
            ];
        }, $rankings)
    ];

    echo json_encode([
        'status' => 'success',
        'data' => $response_data
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