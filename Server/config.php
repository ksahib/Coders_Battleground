<?php

$host='localhost';
$dbname='coders_battleground';
$user='sahib';
$pass='123';

try{
    $pdo=new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4",$user,$pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    session_start();
    //echo "connected";

}catch (PDOException $e) {
    die("Database connection failed: " . $e->getMessage());
};
?>