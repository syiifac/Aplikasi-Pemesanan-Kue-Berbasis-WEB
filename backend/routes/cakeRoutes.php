<?php

require_once __DIR__ . '/../controllers/CakeController.php';

$db = (new Database())->connect();
$controller = new CakeController($db);

$request_uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

// Extract ID from URL if present
$id = null;
if (preg_match('/\/cakes\/(\d+)/', $request_uri, $matches)) {
    $id = $matches[1];
}

switch ($request_method) {
    case 'GET':
        if ($id) {
            $controller->getById($id);
        } else {
            $controller->getAll();
        }
        break;
    case 'POST':
        $controller->create();
        break;
    case 'PUT':
        if ($id) {
            $controller->update($id);
        } else {
            http_response_code(400);
            echo json_encode(['error' => 'Cake ID required']);
        }
        break;
    case 'DELETE':
        if ($id) {
            $controller->delete($id);
        } else {
            http_response_code(400);
            echo json_encode(['error' => 'Cake ID required']);
        }
        break;
    default:
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
}
