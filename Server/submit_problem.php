<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

require_once 'config.php';

$json_data = file_get_contents('php://input');
$data = json_decode($json_data, true);

if (!isset($data['name']) || !isset($data['description']) || 
    !isset($data['difficulty']) || !isset($data['type'])) {
    http_response_code(400);
    echo json_encode(array("status" => "error", "message" => "Missing required fields"));
    exit();
}

if ($data['type'] === 'INSERT') {
    $name = trim($data['name']);
    $description = trim($data['description']);
    $difficulty = trim($data['difficulty']);
    $tags = isset($data['tags']) ? $data['tags'] : array();
    
    $allowed_difficulties = array('Easy', 'Medium', 'Hard');
    if (!in_array($difficulty, $allowed_difficulties)) {
        http_response_code(400);
        echo json_encode(array("status" => "error", "message" => "Invalid difficulty level"));
        exit();
    }
    
    $pdo->beginTransaction();
    
    try {
        $stmt = $pdo->prepare("INSERT INTO problems (name, description, difficulty) VALUES (:name, :description, :difficulty)");
        
        $stmt->execute([
            ':name' => $name,
            ':description' => $description,
            ':difficulty' => $difficulty
        ]);
        
        $problem_id = $pdo->lastInsertId();
        
        if (!empty($tags)) {
            foreach ($tags as $tag) {
                $tag = trim($tag);
                if (empty($tag)) continue;
                
                $tag_stmt = $pdo->prepare("INSERT INTO problem_tags (tag_name, problem_id) VALUES (:tag_name, :problem_id)");
                $tag_stmt->execute([
                    ':tag_name' => $tag,
                    ':problem_id' => $problem_id
                ]);
            }
        }
        
        $pdo->commit();
        
        http_response_code(201);
        echo json_encode(array(
            "status" => "success",
            "message" => "Problem submitted successfully!",
            "problem_id" => $problem_id
        ));
        
    } catch (Exception $e) {
        $pdo->rollBack();
        http_response_code(500);
        echo json_encode(array(
            "status" => "error",
            "message" => "Failed to submit problem: " . $e->getMessage()
        ));
    }
} else {
    http_response_code(400);
    echo json_encode(array("status" => "error", "message" => "Invalid operation type"));
}
?>