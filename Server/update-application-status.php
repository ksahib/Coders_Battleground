<?php
// update-application-status.php
require_once 'config.php';


header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-credentials:true");
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Parse JSON body
$body = json_decode(file_get_contents('php://input'));
if (
    empty($_SESSION['user']) ||
    !isset($body->interview_id, $body->user_email, $body->status)
) {
    http_response_code(400);
    exit(json_encode(['status'=>'error','message'=>'Missing parameters or not authenticated']));
}

$interview_id = (int)$body->interview_id;
$user_email   = $body->user_email;
$status       = $body->status;

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

    // Update job_status
    $upd = $pdo->prepare("
        UPDATE interview_apply
           SET job_status = :st
         WHERE interview_id = :iid
           AND email = :uem
    ");
    $upd->execute([
        ':st'  => $status,
        ':iid' => $interview_id,
        ':uem' => $user_email
    ]);

    echo json_encode(['status'=>'success']);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['status'=>'error','message'=>'DB error: '.$e->getMessage()]);
}
