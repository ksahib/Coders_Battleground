<?php

require_once 'config.php';

header('Content-Type: application/json');
header("Access-Control-Allow-Origin: https://codersbattleground.test");
header("Access-Control-Allow-credentials:true");  
header('Access-Control-Allow-Methods: POST'); 
header('Access-Control-Allow-Headers: Content-Type');



if($_SERVER['REQUEST_METHOD']=='POST'){
$data = json_decode(file_get_contents('php://input'), true);

if($data['type']=="INSERT"){
    $name=isset($data['name'])?$data['name']:null;
    $description=isset($data['description'])?$data['description']:null;
    $difficulty=isset($data['difficulty'])?$data['difficulty']:null;
    $tags = $data['tags'] ?? [];
    $input=isset($data['input'])?$data['input']:null;
    $output=isset($data['output'])?$data['output']:null;
    

    if (empty($name) || empty($description) || empty($difficulty)) {
    echo json_encode(['success' => false, 'message' => 'Required fields missing']);
    exit;
}

    try {
    $stmt = $pdo->prepare("INSERT INTO problems (name, description, difficulty,input,output) VALUES (:name, :description,:difficulty
    ,:input,:output)");

    $stmt->execute([
        ':name' => $name,
        ':description' => $description,
        ':difficulty' => $difficulty,
        ':input'=>$input,
        ':output'=>$output
    ]);

    $problemid=$pdo->lastInsertId();

  
        if(!empty($tags)){
            $tagstmt=$pdo->prepare("INSERT INTO problem_tags(tag_name,problem_id) VALUES(:tag,:problemid)");

            foreach($tags as $tag){
                $tagstmt->execute([
                    ':tag'=>$tag,
                    ':problemid'=>$problemid
                ]);
            }
        
    }

    echo json_encode(['success' => true, 'message' => 'Problem submitted successfully']);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
}
    
    
}

if($data['type']=="UPDATE"){
    $id=isset($data['id'])?$data['id']:null;
    $name=isset($data['name'])?$data['name']:null;
    $description=isset($data['description'])?$data['description']:null;
    $difficulty=isset($data['difficulty'])?$data['difficulty']:null;
    if (empty($id) || empty($name) || empty($description) || empty($difficulty)) {
    echo json_encode(['success' => false, 'message' => 'Required fields missing']);
    exit;
    }
    try{
        $stmt=$pdo->prepare("UPDATE problems SET name=:name,description=:description,difficulty=:difficulty
        WHERE problem_id=:id");
        $stmt->execute([
            ':name'=>$name,
            ':description'=>$description,
            ':difficulty'=>$difficulty,
            ':id'=>$id
        ]);
         echo json_encode(['success' => true, 'message' => 'Problem Updated successfully']);
    } catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
}

}
if($data['type']=="DELETE"){
    $id=isset($data['id'])?$data['id']:null;
     try{
        $stmt=$pdo->prepare("DELETE FROM problems
        WHERE problem_id=:id");
        $stmt->execute([
            
            ':id'=>$id
        ]);
         echo json_encode(['success' => true, 'message' => 'Problem Deleted successfully']);
    }catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
}
}


}
