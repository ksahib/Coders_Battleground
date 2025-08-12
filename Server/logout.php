<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-credentials:true");

header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

require_once "config.php";

session_unset();
session_destroy();

echo json_encode(["success" => "Logged out"]);

header('Location: /root/pages/login_signup.html');
exit;
