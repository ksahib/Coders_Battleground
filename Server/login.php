<?php
require_once "config.php";
opcache_reset();
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");
// ini_set('display_errors', 1);
// ini_set('display_startup_errors', 1);
// error_reporting(E_ALL);


date_default_timezone_set('Asia/Dhaka');

if($_SERVER['REQUEST_METHOD']=== "POST"){
    $data=json_decode(file_get_contents('php://input'),true);

    $email= trim($data['email'] ?? '');
    $password= trim($data['password'] ?? '');



    

    if (!$email || !$password) {
        http_response_code(400);
        echo json_encode(["error" => "Email and password required"]);
        exit;
    }

    try{
        $stmt=$pdo->prepare("SELECT name,email,password,role FROM users WHERE email=?");
        $stmt->execute([$email]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
//         echo "user: {$user['password']}";
//         if ($user) {
//     echo json_encode(["message" => "Found user row for {$email}"]);
// } else {
//     echo json_encode("No user found in DB for {$email}");
// }

        if($user && password_verify($password, $user['password'])) {
            $_SESSION['user'] = $user['email'];
            
            echo json_encode(["success" => true, "message" => "Login successful", "role" => $user['role']]);
            http_response_code(200);
            exit;

        }else {
            http_response_code(401);
            echo json_encode(["error" => "Invalid credentials"]);
        }
        

    }catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["error" => "Login failed: " . $e->getMessage()]);
    }
}
?>