<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type');

require_once 'config.php';

try {
    // Get contest ID from request
    if (!isset($_GET['contest_id'])) {
        throw new Exception('Contest ID is required');
    }
    
    $contest_id = intval($_GET['contest_id']);
    
    // Get contest information
    $contestQuery = "
        SELECT 
            c.id,
            c.name,
            c.company_name,
            c.start,
            c.end
        FROM contest c
        WHERE c.id = :contest_id
    ";
    
    $contestStmt = $pdo->prepare($contestQuery);
    $contestStmt->execute([':contest_id' => $contest_id]);
    $contest = $contestStmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$contest) {
        throw new Exception('Contest not found');
    }
    
    // Determine contest status
    $now = new DateTime();
    $start_date = new DateTime($contest['start']);
    $end_date = new DateTime($contest['end']);
    
    if ($now < $start_date) {
        $status = 'upcoming';
    } elseif ($now > $end_date) {
        $status = 'ended';
    } else {
        $status = 'live';
    }
    
    // Get contest problems with scores
    $problemsQuery = "
        SELECT 
            cq.problem_id,
            cq.problem_title,
            cq.score,
            p.name as problem_name
        FROM contest_questions cq
        JOIN problems p ON cq.problem_id = p.problem_id
        WHERE cq.contest_id = :contest_id
        ORDER BY cq.problem_id
    ";
    
    $problemsStmt = $pdo->prepare($problemsQuery);
    $problemsStmt->execute([':contest_id' => $contest_id]);
    $problems = $problemsStmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Get all participants and their submissions
    $standingsQuery = "
        SELECT 
            u.email,
            u.name,
            s.problem_id,
            s.submission_time,
            CASE 
                WHEN s.submission_time <= c.end THEN cq.score 
                ELSE 0 
            END as points_earned
        FROM participants p
        JOIN users u ON p.email = u.email
        JOIN contest c ON p.contest_id = c.id
        LEFT JOIN solutions s ON p.email = s.email 
            AND s.contest_id = p.contest_id
            AND s.problem_id IN (SELECT problem_id FROM contest_questions WHERE contest_id = :contest_id)
        LEFT JOIN contest_questions cq ON s.problem_id = cq.problem_id 
            AND cq.contest_id = :contest_id
        WHERE p.contest_id = :contest_id
            AND u.role = 'user'
    ";
    
    $standingsStmt = $pdo->prepare($standingsQuery);
    $standingsStmt->execute([':contest_id' => $contest_id]);
    $rawStandings = $standingsStmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Process standings data
    $participantScores = [];
    
    foreach ($rawStandings as $row) {
        $email = $row['email'];
        
        if (!isset($participantScores[$email])) {
            $participantScores[$email] = [
                'username' => $email,
                'name' => $row['name'],
                'total_score' => 0,
                'problems' => [],
                'last_submission' => null
            ];
            
            // Initialize problem array
            foreach ($problems as $problem) {
                $participantScores[$email]['problems'][$problem['problem_id']] = [
                    'problem_id' => $problem['problem_id'],
                    'score' => 0,
                    'solved' => false,
                    'attempted' => false
                ];
            }
        }
        
        // If there's a submission for this problem
        if ($row['problem_id'] && $row['submission_time']) {
            $problem_id = $row['problem_id'];
            $points = intval($row['points_earned']);
            
            $participantScores[$email]['problems'][$problem_id]['attempted'] = true;
            
            if ($points > 0) {
                $participantScores[$email]['problems'][$problem_id]['solved'] = true;
                $participantScores[$email]['problems'][$problem_id]['score'] = $points;
                $participantScores[$email]['total_score'] += $points;
                
                // Track last submission time for tiebreaking
                if (!$participantScores[$email]['last_submission'] || 
                    $row['submission_time'] > $participantScores[$email]['last_submission']) {
                    $participantScores[$email]['last_submission'] = $row['submission_time'];
                }
            }
        }
    }
    
    // Convert to array and sort
    $standings = array_values($participantScores);
    
    // Sort by total score (desc), then by last submission time (asc)
    usort($standings, function($a, $b) {
        if ($a['total_score'] != $b['total_score']) {
            return $b['total_score'] - $a['total_score'];
        }
        // Tiebreaker: earlier submission wins
        if ($a['last_submission'] && $b['last_submission']) {
            return strcmp($a['last_submission'], $b['last_submission']);
        }
        return 0;
    });
    
    // Assign ranks
    $rank = 1;
    foreach ($standings as &$participant) {
        $participant['rank'] = $rank++;
        // Convert problems to array for frontend
        $participant['problems'] = array_values($participant['problems']);
        unset($participant['last_submission']); // Remove internal field
    }
    
    // Get user ratings for color coding
    $emails = array_column($standings, 'username');
    if (!empty($emails)) {
        $placeholders = str_repeat('?,', count($emails) - 1) . '?';
        $ratingsQuery = "
            SELECT 
                email,
                1500 + COALESCE((SELECT SUM(rating_change) FROM contest_rating WHERE email = users.email), 0) as rating
            FROM users
            WHERE email IN ($placeholders)
        ";
        
        $ratingsStmt = $pdo->prepare($ratingsQuery);
        $ratingsStmt->execute($emails);
        $ratings = $ratingsStmt->fetchAll(PDO::FETCH_KEY_PAIR);
        
        // Add ratings to standings
        foreach ($standings as &$participant) {
            $participant['rating'] = isset($ratings[$participant['username']]) ? 
                intval($ratings[$participant['username']]) : 1500;
        }
    }
    
    // Return response
    echo json_encode([
        'status' => 'success',
        'data' => $standings,
        'contest_info' => [
            'id' => $contest['id'],
            'name' => $contest['name'],
            'company' => $contest['company_name'],
            'start' => $contest['start'],
            'end' => $contest['end'],
            'status' => $status,
            'problems' => $problems
        ]
    ]);
    
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'Database error: ' . $e->getMessage()
    ]);
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        'status' => 'error',
        'message' => $e->getMessage()
    ]);
}
?>