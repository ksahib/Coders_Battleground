<?php

require_once 'config.php';

header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-credentials:true");
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] == "GET") {
    $tag = isset($_GET['tag']) ? trim($_GET['tag']) : null;

    if (empty($tag)) {
        echo json_encode(["success" => false, "error" => "No tag provided"]);
        exit;
    }

    $redis = new Redis();
    try {
        $redis->connect('127.0.0.1', 6379);
    } catch (RedisException $e) {
        echo json_encode(["success" => false, "error" => "Redis connection failed"]);
        exit;
    }

    $cacheKey = "tag_query:" . $tag;

    
    if ($redis->exists($cacheKey)) {
        $cached = json_decode($redis->get($cacheKey), true);
        $cached["source"] = "redis";
        echo json_encode($cached);
        exit;
    }

    try {
        $stmt = $pdo->prepare("SELECT p.*, t.tag_name FROM problem_tags AS t
            LEFT JOIN problems AS p ON p.problem_id = t.problem_id
            WHERE t.tag_name = :tag");

        $stmt->execute([":tag" => $tag]);
        $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

        $response = [
            "success" => true,
            "problems" => $results,
            "source" => "database"
        ];

        $jsonData = json_encode($response);

        $redis->setex($cacheKey, 600, $jsonData); // Cache for 10 minutes

        echo $jsonData;
    } catch (PDOException $e) {
        echo json_encode(["success" => false, "error" => "Database error: " . $e->getMessage()]);
    }
}
