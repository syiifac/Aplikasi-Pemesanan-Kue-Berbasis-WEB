<?php

require_once __DIR__ . '/config/config.php';
require_once __DIR__ . '/config/Database.php';

// Create database connection
$database = new Database();
$db = $database->connect();

// Simple Router
$request_method = $_SERVER['REQUEST_METHOD'];
$request_uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

// Remove /api prefix jika ada
$request_uri = str_replace('/api', '', $request_uri);

// Route Handling
if (preg_match('/^\/categories\/?/', $request_uri)) {
    require_once __DIR__ . '/routes/categoryRoutes.php';
} elseif (preg_match('/^\/cakes\/?/', $request_uri)) {
    require_once __DIR__ . '/routes/cakeRoutes.php';
} elseif (preg_match('/^\/products\/?$/', $request_uri)) {
    require_once __DIR__ . '/routes/productRoutes.php';
} elseif (preg_match('/^\/auth\//', $request_uri)) {
    require_once __DIR__ . '/routes/authRoutes.php';
} elseif (preg_match('/^\/orders\/?/', $request_uri)) {
    require_once __DIR__ . '/routes/orderRoutes.php';
} elseif (preg_match('/^\/users\/?/', $request_uri)) {
    require_once __DIR__ . '/routes/userRoutes.php';
} else {
    http_response_code(404);
    header('Content-Type: application/json');
    echo json_encode(['error' => 'Route not found']);
}
