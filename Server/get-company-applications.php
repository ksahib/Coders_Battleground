<?php
// get-company-applications.php
require_once 'config.php';
// session_start();

header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-credentials:true");
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type');

if (empty($_SESSION['user'])) {
    http_response_code(401);
    exit(json_encode(['status'=>'error','message'=>'Not authenticated']));
}

// 1) find this company’s name
$cstmt = $pdo->prepare('SELECT name FROM company WHERE email = :email');
$cstmt->execute([':email'=>$_SESSION['user']]);
$company = $cstmt->fetchColumn();
if (!$company) {
    http_response_code(403);
    exit(json_encode(['status'=>'error','message'=>'Company not found']));
}

// 2) fetch all applications + job_status
$sql = "
  SELECT
    ia.email          AS user_email,
    u.name            AS user_name,
    i.interview_id,
    i.position_open   AS position,
    CONCAT(l.area, ', ', l.city, ', ', l.country) AS location,
    ia.job_status
  FROM interview_apply ia
  JOIN interview i  ON ia.interview_id = i.interview_id
  JOIN users u      ON ia.email = u.email
  JOIN locations l  ON i.location_id = l.location_id
  WHERE i.company_name = :company
";
$stmt = $pdo->prepare($sql);
$stmt->execute([':company'=>$company]);
$rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

// 3) prepare summary query (same as before)
$summary_sql = "
  SELECT
    COUNT(DISTINCT s.problem_id)                       AS total_solved,
    ROUND(AVG(s.runtime),2)                            AS avg_runtime,
    ROUND(AVG(s.memory_usage),2)                       AS avg_memory,
    GROUP_CONCAT(DISTINCT s.language)                  AS languages,
    MAX(s.submission_time)                             AS last_submission,
    GROUP_CONCAT(DISTINCT CONCAT(p.difficulty,':',cnt) SEPARATOR ',') AS difficulty_breakdown
  FROM solutions s
  LEFT JOIN (
    SELECT p.problem_id, p.difficulty, COUNT(*) AS cnt
    FROM solutions sol
    JOIN problems p ON sol.problem_id = p.problem_id
    WHERE sol.email = :email
    GROUP BY p.difficulty
  ) p ON s.problem_id = p.problem_id
  WHERE s.email = :email
";
$sum_stmt = $pdo->prepare($summary_sql);

// 4) group rows by user, fetch summary
$users = [];
foreach ($rows as $r) {
  $email = $r['user_email'];
  if (!isset($users[$email])) {
    // get summary
    $sum_stmt->execute([':email'=>$email]);
    $s = $sum_stmt->fetch(PDO::FETCH_ASSOC);

    $users[$email] = [
      'email'        => $email,
      'name'         => $r['user_name'],
      'summary'      => [
        'total_solved' => intval($s['total_solved']),
        'avg_runtime'  => floatval($s['avg_runtime']),
        'avg_memory'   => floatval($s['avg_memory']),
        'languages'    => $s['languages'] ? explode(',', $s['languages']) : [],
        'last_submission'     => $s['last_submission'],
        'difficulty_breakdown'=> $s['difficulty_breakdown'] ? explode(',', $s['difficulty_breakdown']) : []
      ],
      'applications' => []
    ];
  }
  $users[$email]['applications'][] = [
    'interview_id' => (int)$r['interview_id'],
    'position'     => $r['position'],
    'location'     => $r['location'],
    'job_status'   => $r['job_status'] ?? 'Applied'
  ];
}

echo json_encode([
  'status'=>'success',
  'data'=>array_values($users)
]);
