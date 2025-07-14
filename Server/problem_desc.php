<?php

require_once 'connection.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type');

if($_SERVER['REQUEST_METHOD']=="GET"){
    $name=$_GET['name'];
    try{
        $stmt=$pdo->prepare("SELECT * FROM problems WHERE name=:name");
        $stmt->execute([
            ":name"=>$name
        ]);
        $results=$stmt->fetch(PDO::FETCH_ASSOC);
        echo json_encode($results);
        exit;
    }catch(PDOException $e){
        echo json_encode(["success"=>false,"error"=>"Could not fetch problem"]);
        exit;
    }

}