<?php

require_once __DIR__ . '/../controllers/UserController.php';

$userController = new UserController($db);

$method = $_SERVER['REQUEST_METHOD'];
$path = trim(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH), '/');

// Extract ID from path if present (e.g., backend/api/users/123)
$pathParts = explode('/', $path);
$userId = null;
if (count($pathParts) >= 4 && $pathParts[0] === 'backend' && $pathParts[1] === 'api' && $pathParts[2] === 'users' && is_numeric($pathParts[3])) {
  $userId = $pathParts[3];
}

// Route matching
if ($path === 'backend/api/users' && $method === 'GET') {
  // GET all users
  $userController->getAllUsers();
  
} elseif ($userId && $method === 'GET') {
  // GET user by ID
  $userController->getUserById($userId);
  
} elseif ($path === 'backend/api/users' && $method === 'POST') {
  // CREATE new user
  $userController->createUser();
  
} elseif ($userId && $method === 'PUT') {
  // UPDATE user
  $userController->updateUser($userId);
  
} elseif ($userId && $method === 'DELETE') {
  // DELETE user
  $userController->deleteUser($userId);
  
} else {
  http_response_code(404);
  header('Content-Type: application/json');
  echo json_encode([
    'success' => false,
    'message' => 'Endpoint tidak ditemukan'
  ]);
}
