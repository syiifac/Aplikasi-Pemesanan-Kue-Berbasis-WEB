<?php

require_once __DIR__ . '/../models/Order.php';

$db = (new Database())->connect();
$order = new Order($db);

$request_method = $_SERVER['REQUEST_METHOD'];
$request_uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

// Extract ID and action
$id = null;
if (preg_match('/\/api\/orders\/(\d+)/', $request_uri, $matches)) {
    $id = $matches[1];
}

switch ($request_method) {
    case 'GET':
        if ($id) {
            $order_data = $order->getById($id);
            if ($order_data) {
                echo json_encode([
                    'success' => true,
                    'data' => $order_data
                ]);
            } else {
                http_response_code(404);
                echo json_encode(['error' => 'Order not found']);
            }
        } else {
            $orders = $order->getAll();
            echo json_encode([
                'success' => true,
                'data' => $orders
            ]);
        }
        break;
    case 'POST':
        $data = json_decode(file_get_contents("php://input"));
        
        $order->user_id = $data->user_id ?? null;
        $order->total_price = $data->total_price ?? 0;
        $order->status = 'pending';
        $order->shipping_address = $data->shipping_address ?? '';

        $order_id = $order->create();
        if ($order_id) {
            http_response_code(201);
            echo json_encode([
                'success' => true,
                'message' => 'Order created successfully',
                'order_id' => $order_id
            ]);
        } else {
            http_response_code(400);
            echo json_encode(['error' => 'Failed to create order']);
        }
        break;
    case 'PUT':
        if ($id) {
            $data = json_decode(file_get_contents("php://input"));
            $status = $data->status ?? '';
            
            if ($order->updateStatus($id, $status)) {
                echo json_encode([
                    'success' => true,
                    'message' => 'Order updated successfully'
                ]);
            } else {
                http_response_code(400);
                echo json_encode(['error' => 'Failed to update order']);
            }
        }
        break;
    default:
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
}
