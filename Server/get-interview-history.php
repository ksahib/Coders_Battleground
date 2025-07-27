<?php
// get-interview-history.php
require_once 'config.php';
session_start();

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type');

if (empty($_SESSION['user'])) {
    http_response_code(401);
    exit(json_encode(['status'=>'error','message'=>'Not authenticated']));
}

$user_email = $_SESSION['user'];

try {
    // 1) Fetch applications + schedule
    $sql = "
      SELECT
        ia.interview_id,
        i.company_name    AS company,
        i.position_open   AS role,
        CONCAT(l.area, ', ', l.city, ', ', l.country) AS location,
        ia.job_status     AS status,
        DATE_FORMAT(i.start, '%Y-%m-%d')             AS date,
        sch.start         AS sched_start,
        sch.`end`         AS sched_end
      FROM interview_apply ia
      JOIN interview i
        ON ia.interview_id = i.interview_id
      JOIN locations l
        ON i.location_id = l.location_id
      LEFT JOIN interview_schedule sch
        ON sch.interview_id = ia.interview_id
       AND sch.user_email   = ia.email
      WHERE ia.email = :email
      ORDER BY i.start DESC
    ";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([':email' => $user_email]);
    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // 2) Build response
    $data = [];
    foreach ($rows as $r) {
        $item = [
            'interview_id' => (int)$r['interview_id'],
            'company'      => $r['company'],
            'role'         => $r['role'],
            'location'     => $r['location'],
            'status'       => $r['status'],
            'date'         => $r['date'],
            'schedule'     => null
        ];
        if ($r['sched_start']) {
            $item['schedule'] = [
                'start' => $r['sched_start'],
                'end'   => $r['sched_end']
            ];
        }
        $data[] = $item;
    }

    echo json_encode(['status'=>'success','data'=>$data]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['status'=>'error','message'=>'Database error: '.$e->getMessage()]);
}
