<?php

require_once 'connection.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] == "GET") {
    $tag = $_GET['tag'];

    
    $redis = new Redis();
    try {
        $redis->connect('127.0.0.1', 6379);
    } catch (RedisException $e) {
        echo json_encode(["success" => false, "error" => "Redis connection failed"]);
        exit;
    }

    $cacheKey = "tag_query:" . $tag;

    
    if ($redis->exists($cacheKey)) {
        echo $redis->get($cacheKey); 
        exit;
    }

    try {
        $stmt = $pdo->prepare("SELECT p.*, t.tag_name FROM problem_tags AS t
            LEFT JOIN problems AS p ON p.problem_id = t.problem_id
            WHERE t.tag_name = :tag");

        $stmt->execute([":tag" => $tag]);
        $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

        $jsonData = json_encode($results);

        
        $redis->setex($cacheKey, 600, $jsonData);

        echo $jsonData;
    } catch (PDOException $e) {
        echo json_encode(["success" => false, "error" => "Could not access results: " . $e->getMessage()]);
    }
}
