<?php

require_once __DIR__ . '/../models/Product.php';

class ProductController {
    private $db;
    private $product;

    public function __construct($db) {
        $this->db = $db;
        $this->product = new Product($db);
    }

    // GET /api/products
    public function getAll() {
        try {
            $products = $this->product->getAll();
            echo json_encode([
                'success' => true,
                'data' => $products
            ]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'error' => $e->getMessage()
            ]);
        }
    }

    // GET /api/products/:id
    public function getById($id) {
        try {
            $product = $this->product->getById($id);
            if ($product) {
                echo json_encode([
                    'success' => true,
                    'data' => $product
                ]);
            } else {
                http_response_code(404);
                echo json_encode([
                    'success' => false,
                    'error' => 'Product not found'
                ]);
            }
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'error' => $e->getMessage()
            ]);
        }
    }

    // POST /api/products
    public function create() {
        try {
            $data = json_decode(file_get_contents("php://input"));

            $this->product->name = $data->name ?? '';
            $this->product->description = $data->description ?? '';
            $this->product->price = $data->price ?? 0;
            $this->product->category = $data->category ?? '';
            $this->product->image_url = $data->image_url ?? '';
            $this->product->stock = $data->stock ?? 0;

            if ($this->product->create()) {
                http_response_code(201);
                echo json_encode([
                    'success' => true,
                    'message' => 'Product created successfully'
                ]);
            } else {
                http_response_code(400);
                echo json_encode([
                    'success' => false,
                    'error' => 'Failed to create product'
                ]);
            }
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'error' => $e->getMessage()
            ]);
        }
    }

    // PUT /api/products/:id
    public function update($id) {
        try {
            $data = json_decode(file_get_contents("php://input"));

            $this->product->id = $id;
            $this->product->name = $data->name ?? '';
            $this->product->description = $data->description ?? '';
            $this->product->price = $data->price ?? 0;
            $this->product->category = $data->category ?? '';
            $this->product->image_url = $data->image_url ?? '';
            $this->product->stock = $data->stock ?? 0;

            if ($this->product->update()) {
                echo json_encode([
                    'success' => true,
                    'message' => 'Product updated successfully'
                ]);
            } else {
                http_response_code(400);
                echo json_encode([
                    'success' => false,
                    'error' => 'Failed to update product'
                ]);
            }
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'error' => $e->getMessage()
            ]);
        }
    }

    // DELETE /api/products/:id
    public function delete($id) {
        try {
            if ($this->product->delete($id)) {
                echo json_encode([
                    'success' => true,
                    'message' => 'Product deleted successfully'
                ]);
            } else {
                http_response_code(400);
                echo json_encode([
                    'success' => false,
                    'error' => 'Failed to delete product'
                ]);
            }
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'error' => $e->getMessage()
            ]);
        }
    }
}
