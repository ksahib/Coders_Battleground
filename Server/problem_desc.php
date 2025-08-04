<?php

require_once 'config.php';

header('Content-Type: application/json');
header("Access-Control-Allow-Origin: https://codersbattleground.test");
header("Access-Control-Allow-credentials:true");
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] == "GET") {
    $name = isset($_GET['title']) ? trim($_GET['title']) : "";

    if (empty($name)) {
        echo json_encode(["success" => false, "error" => "No problem title provided"]);
        exit;
    }

    try {
        // Connect to Redis
        $redis = new Redis();
        $redis->connect('127.0.0.1', 6379);

        $cacheKey = "problem_" . md5($name);

        // Check if data exists in Redis
        if ($redis->exists($cacheKey)) {
            $cached = json_decode($redis->get($cacheKey), true);
            $cached['source'] = "redis";
            echo json_encode($cached);
            exit;
        }

        // If not in cache, fetch from database
        $stmt = $pdo->prepare("SELECT * FROM problems WHERE name = :name");
        $stmt->execute([":name" => $name]);
        $result = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($result) {
            $response = [
                "success" => true,
                "problem" => $result,
                "source" => "database"
            ];
            $jsonData = json_encode($response);
            $redis->setex($cacheKey, 600, $jsonData); // Cache for 10 minutes
            echo $jsonData;
        } else {
            echo json_encode(["success" => false, "error" => "No such problem"]);
        }
        exit;

    } catch (PDOException $e) {
        echo json_encode(["success" => false, "error" => "Database error"]);
        exit;
    } catch (RedisException $e) {
        echo json_encode(["success" => false, "error" => "Redis error"]);
        exit;
    }
}
