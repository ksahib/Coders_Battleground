<?php
require_once "config.php";

// CORS headers
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-credentials:true");
header("Content-Type: application/json");

// Check authentication
if (empty($_SESSION['user'])) {
    http_response_code(401);
    echo json_encode(["error" => "Unauthorized"]);
    exit;
}

$userEmail = $_SESSION['user'];

try {
    $stmt = $pdo->prepare("SELECT image_url FROM image WHERE email = :email");
    $stmt->execute(['email' => $userEmail]);

    if ($stmt->rowCount() === 0) {
        echo json_encode(["image_url" => null]);
    } else {
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        echo json_encode(["image_url" => $row['image_url']]);
    }

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "Database error: " . $e->getMessage()]);
}
