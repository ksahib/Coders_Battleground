<?php
require_once "config.php";
header("Access-Control-Allow-Origin: https://codersbattleground.test");
header("Access-Control-Allow-credentials:true");
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");


// if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
//     http_response_code(405);
//     exit(json_encode(['error' => 'Only POST allowed']));
// }

if (empty($_SESSION['user'])) {
    http_response_code(402);
    exit(json_encode(['error' => 'Not authenticated']));
}


try {
    $sql = "
        SELECT
            id            AS contest_id,
            name          AS contest_name,
            company_name
        FROM contest
        LIMIT 20
    ";
    $sql2 = "
        SELECT interview_id, company_name, position_open
        FROM interview
    ";
    $sql3 = "
        SELECT 
            p.problem_id,
            p.name,
            GROUP_CONCAT(DISTINCT pt.tag_name) AS tags
        FROM problems p
        LEFT JOIN problem_tags pt ON p.problem_id = pt.problem_id
        GROUP BY p.problem_id, p.name
    ";

    $stmt = $pdo->prepare($sql);
    $stmt_interviews = $pdo->prepare($sql2);
    $stmt_problems = $pdo->prepare($sql3);

    $stmt->execute();
    $stmt_interviews->execute();
    $stmt_problems->execute();

    $contests = $stmt->fetchAll(PDO::FETCH_ASSOC);
    $interviews = $stmt_interviews->fetchAll(PDO::FETCH_ASSOC);
    $rawProblems = $stmt_problems->fetchAll(PDO::FETCH_ASSOC);

    $problems = array_map(function ($row) {
        // Converting comma-separated tags string to array
        $row['tags'] = $row['tags'] !== null
            ? explode(',', $row['tags'])
            : [];
        return $row;
    }, $rawProblems);

    $stmt_user = $pdo->prepare("SELECT name FROM users WHERE email = :email");
    $stmt_user->execute(['email' => $_SESSION['user']]);
    $user = $stmt_user->fetch(PDO::FETCH_ASSOC);

    echo json_encode([
        'success'  => true,
        'user'     => $user['name'] ?? 'Guest',
        'contests' => $contests,
        'interviews' => $interviews,
        'problems' => $problems

    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
}
