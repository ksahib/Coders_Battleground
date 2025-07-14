<?php

require_once 'connection.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type');

if($_SERVER['REQUEST_METHOD']=="GET"){
    try{
        $stmt=$pdo->query("SELECT DISTINCT tag_name FROM problem_tags");
        $results=$stmt->fetchAll(PDO::FETCH_ASSOC);

        echo json_encode($results);
    }catch(PDOException $e){
        echo json_encode(["success"=>false,"error"=>"Could not access results".$e->getMessage()]);
    }
}