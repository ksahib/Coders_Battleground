<?php
require_once 'config.php';
header('Content-Type: application/json');

// Read JSON payload
$data = json_decode(file_get_contents('php://input'), true);
if (!$data) {
    echo json_encode(['status' => 'error', 'message' => 'Invalid JSON']);
    exit;
}

// Validate contest fields
$name = trim($data['contestName'] ?? '');
$desc = trim($data['contestDescription'] ?? '');
$start = $data['startTime'] ?? null;
$end = $data['endTime'] ?? null;
$problems = $data['problems'] ?? [];

if (!$name || !$start || !$end || empty($problems)) {
    echo json_encode(['status' => 'error', 'message' => 'Missing required fields']);
    exit;
}

try {
    $pdo->beginTransaction();

    // Insert contest
    $stmt = $pdo->prepare("INSERT INTO contests (name, description, company_name,start_time, end_time) VALUES (:name, :desc,:company, :start, :end)");
    $stmt->execute([
        ':name' => $name,
        ':desc' => $desc,
        'company'=>$_SESSION['name'],
        ':start' => $start,
        ':end' => $end
    ]);

    $contestId = $pdo->lastInsertId();

    // Insert contest_questions for each problem
    $insertQ = $pdo->prepare("INSERT INTO contest_questions (contest_id, problem_id, problem_title, score) VALUES (:contest_id, :problem_id, :problem_title, :score)");

    // Fetch problem titles by IDs in one query to avoid separate queries inside loop
    $problemIds = array_column($problems, 'problem_id');
    $placeholders = implode(',', array_fill(0, count($problemIds), '?'));
    $stmtTitles = $pdo->prepare("SELECT problem_id, name FROM problems WHERE problem_id IN ($placeholders)");
    $stmtTitles->execute($problemIds);
    $titlesMap = [];
    while ($row = $stmtTitles->fetch(PDO::FETCH_ASSOC)) {
        $titlesMap[$row['problem_id']] = $row['name'];
    }

    foreach ($problems as $p) {
        $pid = $p['problem_id'];
        $score = $p['score'];
        $title = $titlesMap[$pid] ?? 'Unknown Problem';

        $insertQ->execute([
            ':contest_id' => $contestId,
            ':problem_id' => $pid,
            ':problem_title' => $title,
            ':score' => $score
        ]);
    }

    $pdo->commit();

    echo json_encode(['status' => 'success', 'message' => 'Contest created successfully']);
} catch (PDOException $e) {
    $pdo->rollBack();
    echo json_encode(['status' => 'error', 'message' => 'Database error: ' . $e->getMessage()]);
}
