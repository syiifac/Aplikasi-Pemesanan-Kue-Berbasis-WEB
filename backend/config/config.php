<?php

// Database Configuration (XAMPP Default / Docker)
define('DB_HOST', getenv('DB_HOST') ?: 'localhost');
define('DB_USER', getenv('DB_USER') ?: 'root');
define('DB_PASS', getenv('DB_PASS') ?: ''); // XAMPP default (kosong)
define('DB_NAME', getenv('DB_NAME') ?: 'sweet_bites_bakery');

// Application Configuration
define('APP_URL', getenv('APP_URL') ?: 'http://localhost:3000'); // React frontend URL (Vite default)
define('API_URL', getenv('API_URL') ?: 'http://localhost:8080/backend');

// JWT Secret
define('JWT_SECRET', 'your_jwt_secret_key_here_change_in_production');

// Pagination
define('PER_PAGE', 10);

// Upload Configuration
define('UPLOAD_PATH', __DIR__ . '/../uploads/');
define('MAX_FILE_SIZE', 5242880); // 5MB

// Error Reporting
ini_set('display_errors', 0);
error_reporting(E_ALL);
ini_set('log_errors', 1);
ini_set('error_log', __DIR__ . '/../logs/error.log');

// CORS Headers - Allow all origins for development
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json; charset=UTF-8');

// Handle OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}
