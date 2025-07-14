<?php

require_once 'config.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type');

if($_SERVER['REQUEST_METHOD']=="GET"){
    $tag=$_GET['tag'];
    try{
        $stmt=$pdo->prepare("SELECT p.* ,t.tag_name FROM problem_tags AS t
        LEFT JOIN problems AS p
        ON p.problem_id=t.problem_id
        WHERE t.tag_name=:tag");
        $stmt->execute([
            ":tag"=>$tag
        ]);
        $results=$stmt->fetchAll(PDO::FETCH_ASSOC);

        echo json_encode($results);
    }catch(PDOException $e){
        echo json_encode(["success"=>false,"error"=>"Could not access results".$e->getMessage()]);
    }

}