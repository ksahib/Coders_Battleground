<?php

require_once 'connection.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type');

if($_SERVER['REQUEST_METHOD']=="GET"){
    $name=$_GET['name'];
    try{
        $stmt=$pdo->prepare("SELECT p.*,s.*,u.username FROM solutions as s
        LEFT JOIN problems AS p
        ON p.problem_id=s.problem_id
        LEFT JOIN users AS u
        ON s.email=u.email
        WHERE p.name=:name
        ");
        $stmt->execute([":name"=>$name]);
        $results=$stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($results);
        exit;
    }catch(PDOException $e){
        echo json_encode(["success"=>false,"error"=>"Could not fetch solutions"]);
        exit;
    }
}