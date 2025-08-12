<?php
require_once "config.php";
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-credentials:true");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json");


if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}


if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    exit(json_encode(['error' => 'Only POST allowed']));
}

if (empty($_SESSION['user'])) {
    http_response_code(401);
    exit(json_encode(['error' => 'Not authenticated']));
}

try {
    $sql = "SELECT email, name, created_at FROM users WHERE email = :email";
    $stmt = $pdo->prepare($sql);
    $stmt->execute(['email' => $_SESSION['user']]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    $sql2 = "SELECT 
            DATE(submission_time) AS submission_day,
            COUNT(*) AS submissions_count
        FROM 
            solutions
        WHERE email=:email
        GROUP BY 
            DATE(submission_time)
        ORDER BY 
            submission_day;
    ";
    
    $submissions = $pdo->prepare($sql2);
    $submissions->execute([':email'=>$_SESSION['user']]);
    $submissions = $submissions->fetchAll(PDO::FETCH_KEY_PAIR);

    $lang_sql = "SELECT DISTINCT language FROM solutions WHERE email = :user_id";
    $lang_stmt = $pdo->prepare($lang_sql);
    $lang_stmt->execute(['user_id' => $_SESSION['user']]);
    $languages = $lang_stmt->fetchAll(PDO::FETCH_COLUMN);

    $sql3 = "
        SELECT 
        cq.contest_id,
        c.name AS contest_name,
        p.name AS problem_title,
        MIN(s.submission_time) AS submission_time
    FROM 
        solutions s
    JOIN 
        contest_questions cq ON s.problem_id = cq.problem_id
    JOIN 
        contest c ON cq.contest_id = c.id
    JOIN 
        problems p ON s.problem_id = p.problem_id
    WHERE 
        s.email = :user_id
    GROUP BY 
        cq.contest_id, cq.problem_id
    ORDER BY 
        submission_time DESC
    LIMIT 10;

    ";

    $stmt3 = $pdo->prepare($sql3);
    $stmt3->execute(['user_id' => $_SESSION['user']]);
    $activities = $stmt3->fetchAll(PDO::FETCH_ASSOC);

    //Points per difficulty (total points the user earned)
    $pointsSql = "
        SELECT 
            p.difficulty,
            SUM(pd.points) AS total_points
        FROM 
            solutions s
        JOIN 
            problems p ON s.problem_id = p.problem_id
        JOIN 
            points_dist pd ON p.difficulty = pd.difficulty
        WHERE 
            s.email = :user_id
        GROUP BY 
            p.difficulty
    ";
    $pointsStmt = $pdo->prepare($pointsSql);
    $pointsStmt->execute(['user_id' => $_SESSION['user']]);
    $points = $pointsStmt->fetchAll(PDO::FETCH_KEY_PAIR);

    //Number of problems solved per difficulty
    $solvedSql = "
        SELECT 
            p.difficulty,
            COUNT(DISTINCT s.problem_id) AS solved_count
        FROM 
            solutions s
        JOIN 
            problems p ON s.problem_id = p.problem_id
        WHERE 
            s.email = :user_id
        GROUP BY 
            p.difficulty
    ";
    $solvedStmt = $pdo->prepare($solvedSql);
    $solvedStmt->execute(['user_id' => $_SESSION['user']]);
    $solved = $solvedStmt->fetchAll(PDO::FETCH_KEY_PAIR);

    //Total problems available per difficulty
    $totalSql = "
        SELECT 
            difficulty,
            COUNT(*) AS total_count
        FROM 
            problems
        GROUP BY 
            difficulty
    ";
    $totalStmt = $pdo->query($totalSql);
    $totals = $totalStmt->fetchAll(PDO::FETCH_KEY_PAIR);

    //Making sure all three difficulties exist in each array
    foreach (['Easy','Medium','Hard'] as $d) {
        if (!isset($points[$d]))  $points[$d]  = 0;
        if (!isset($solved[$d]))  $solved[$d]  = 0;
        if (!isset($totals[$d]))  $totals[$d]  = 0;
    }

    $point_pd_sql = "
        SELECT 
            difficulty,
            points
        FROM 
            points_dist
        ";
    $point_pd_stmt = $pdo->query($point_pd_sql);
    $point_pd = $point_pd_stmt->fetchAll(PDO::FETCH_KEY_PAIR);

    echo json_encode([
        'success' => true,
        'user'    => $user ? [
            'email'      => $user['email'],
            'name'       => $user['name'],
            'created_at' => $user['created_at']
        ] : null,
        'submissions' => $submissions,
        'languages' => $languages,
        'activities' => $activities,
        'chart'       => [
            'points'     => $points,
            'solved'     => $solved,
            'totals'     => $totals
        ],
        'point_pd' => $point_pd
    ]);
} catch(PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
    exit;
}