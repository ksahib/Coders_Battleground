<?php
// schedule-interview.php
require_once 'config.php';
session_start();

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Parse JSON body
$body = json_decode(file_get_contents('php://input'));
if (
    empty($_SESSION['user']) ||
    !isset($body->interview_id, $body->user_email, $body->start, $body->end)
) {
    http_response_code(400);
    exit(json_encode(['status'=>'error','message'=>'Missing parameters or not authenticated']));
}

$interview_id = (int)$body->interview_id;
$user_email   = $body->user_email;
$start        = $body->start;  // ISO datetime string
$end          = $body->end;

try {
    // Ensure the logged‑in company owns that interview
    $auth = $pdo->prepare("
        SELECT 1
          FROM interview i
         WHERE i.interview_id = :iid
           AND i.company_name = (
                 SELECT name
                   FROM company
                  WHERE email = :cem
               )
        LIMIT 1
    ");
    $auth->execute([
        ':iid' => $interview_id,
        ':cem' => $_SESSION['user']
    ]);
    if (!$auth->fetch()) {
        http_response_code(403);
        exit(json_encode(['status'=>'error','message'=>'Not authorized']));
    }

    // Upsert into interview_schedule
    $upsert = $pdo->prepare("
        INSERT INTO interview_schedule
            (user_email, interview_id, `start`, `end`)
        VALUES
            (:uem, :iid, :st, :en)
        ON DUPLICATE KEY UPDATE
            `start` = VALUES(`start`),
            `end`   = VALUES(`end`)
    ");
    $upsert->execute([
        ':uem' => $user_email,
        ':iid' => $interview_id,
        ':st'  => $start,
        ':en'  => $end
    ]);

    // Also update job_status in interview_apply to 'Scheduled'
    $upd = $pdo->prepare("
        UPDATE interview_apply
           SET job_status = 'Scheduled'
         WHERE interview_id = :iid
           AND email = :uem
    ");
    $upd->execute([
        ':iid' => $interview_id,
        ':uem' => $user_email
    ]);

    echo json_encode(['status'=>'success']);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['status'=>'error','message'=>'DB error: '.$e->getMessage()]);
}
