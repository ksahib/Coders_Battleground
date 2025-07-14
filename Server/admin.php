<?php
require_once "config.php";
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");


if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    exit(json_encode(['error' => 'Only POST allowed']));
}

if (empty($_SESSION['user'])) {
    http_response_code(402);
    exit(json_encode(['error' => 'Not authenticated']));
}

date_default_timezone_set('Asia/Dhaka');
$today = date('Y-m-d');


try {

    $stmt_user = $pdo->prepare("SELECT name FROM users WHERE email = :email");
    $stmt_user->execute(['email' => $_SESSION['user']]);
    $user = $stmt_user->fetch(PDO::FETCH_ASSOC);

    $time_sql = "SELECT id, name, TIMEDIFF(end, start) AS duration FROM contest WHERE DATE(start) = :today AND company_name = :company_name";
    $time_stmt = $pdo->prepare($time_sql);
    $time_stmt->execute(['today' => $today, 'company_name' => $user['name']]);
    $time = $time_stmt->fetchAll(PDO::FETCH_ASSOC);

    $participation_sql = "SELECT COUNT(email) AS count FROM participants WHERE contest_id = :contest_id";
    $participation_stmt = $pdo->prepare($participation_sql);
    $participation_stmt->execute(['contest_id' => $time[0]['id']]);
    $participation_count = $participation_stmt->fetchColumn();

    $total_contest_sql = "SELECT COUNT(*) AS total FROM contest WHERE company_name = :company_name";
    $total_contest_stmt = $pdo->prepare($total_contest_sql);
    $total_contest_stmt->execute(['company_name' => $user['name']]);
    $total_contest_count = $total_contest_stmt->fetchColumn();

    $total_participation_sql = "SELECT COUNT(*) AS total_participants FROM participants LEFT JOIN contest ON participants.contest_id = contest.id WHERE contest.company_name = :company_name";
    $total_participation_stmt = $pdo->prepare($total_participation_sql);
    $total_participation_stmt->execute(['company_name' => $user['name']]);
    $total_participation_count = $total_participation_stmt->fetchColumn();

    $total_interviews_sql = "SELECT COUNT(*) AS total_interviews FROM interview WHERE company_name = :company_name";
    $total_interviews_stmt = $pdo->prepare($total_interviews_sql);
    $total_interviews_stmt->execute(['company_name' => $user['name']]);
    $total_interviews_count = $total_interviews_stmt->fetchColumn();

    $upcoming_sql = "SELECT *
        FROM interview
        WHERE start > NOW() AND company_name = :company_name
        ORDER BY start ASC
        LIMIT 1;
    ";
    $upcoming_stmt = $pdo->prepare($upcoming_sql);
    $upcoming_stmt->execute(['company_name' => $user['name']]);
    $upcoming = $upcoming_stmt->fetch(PDO::FETCH_ASSOC);

    echo json_encode([
        'success'  => true,
        'user'     => $user['name'] ?? 'Guest',
        'time'     => $time,
        "count"    => $participation_count,
        "total"    => $total_contest_count,
        "total_participation" => $total_participation_count,
        "total_interviews" => $total_interviews_count,
        "upcoming" => $upcoming

    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
}
