<?php

require_once 'connection.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type');


if ($_SERVER['REQUEST_METHOD'] == "GET") {
    $name = $_GET['name'];

    try {
        
        $redis = new Redis();
        $redis->connect('127.0.0.1', 6379);

        $cacheKey = "problem_" . md5($name);

       
        if ($redis->exists($cacheKey)) {
            $cachedResult = $redis->get($cacheKey);
            echo $cachedResult; 
            exit;
        }

        
        $stmt = $pdo->prepare("SELECT p.*, inc.input AS i, inc.output as o 
                               FROM problems AS p 
                               RIGHT JOIN in_out as inc ON p.problem_id = inc.problem_id 
                               WHERE name = :name");
        $stmt->execute([":name" => $name]);
        $results = $stmt->fetch(PDO::FETCH_ASSOC);

        
        if ($results) {
            $jsonResult = json_encode($results);
            $redis->setex($cacheKey, 600, $jsonResult); 
            echo $jsonResult;
        } else {
            echo json_encode(["success" => false, "error" => "No such problem"]);
        }
        exit;

    } catch (PDOException $e) {
        echo json_encode(["success" => false, "error" => "Could not fetch problem"]);
        exit;
    } catch (RedisException $e) {
        echo json_encode(["success" => false, "error" => "Redis error"]);
        exit;
    }
}
