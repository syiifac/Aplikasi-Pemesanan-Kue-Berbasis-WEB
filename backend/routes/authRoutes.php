<?php

require_once __DIR__ . '/../controllers/AuthController.php';

$authController = new AuthController($db);

$method = $_SERVER['REQUEST_METHOD'];
$path = trim(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH), '/');

// Match routes
if ($path === 'backend/api/auth/login' && $method === 'POST') {
  $authController->login();
} elseif ($path === 'backend/api/auth/register' && $method === 'POST') {
  $authController->register();
} else {
  http_response_code(404);
  header('Content-Type: application/json');
  echo json_encode([
    'success' => false,
    'message' => 'Endpoint tidak ditemukan'
  ]);
}
