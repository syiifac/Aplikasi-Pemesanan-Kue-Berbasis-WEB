<?php

require_once __DIR__ . '/../models/Cake.php';

class CakeController {
    private $db;
    private $cake;

    public function __construct($db) {
        $this->db = $db;
        $this->cake = new Cake($db);
    }

    // GET /api/cakes
    public function getAll() {
        try {
            $cakes = $this->cake->getAll();
            echo json_encode([
                'success' => true,
                'data' => $cakes
            ]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'error' => $e->getMessage()
            ]);
        }
    }

    // GET /api/cakes/:id
    public function getById($id) {
        try {
            $cake = $this->cake->getById($id);
            if ($cake) {
                echo json_encode([
                    'success' => true,
                    'data' => $cake
                ]);
            } else {
                http_response_code(404);
                echo json_encode([
                    'success' => false,
                    'error' => 'Cake not found'
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

    // POST /api/cakes
    public function create() {
        try {
            $data = json_decode(file_get_contents("php://input"));

            $this->cake->name = $data->name ?? '';
            $this->cake->description = $data->description ?? '';
            $this->cake->price = $data->price ?? 0;
            $this->cake->category_id = $data->category_id ?? null;
            $this->cake->image_url = $data->image_url ?? '';
            $this->cake->stock = $data->stock ?? 0;

            if ($this->cake->create()) {
                http_response_code(201);
                echo json_encode([
                    'success' => true,
                    'message' => 'Cake created successfully'
                ]);
            } else {
                http_response_code(400);
                echo json_encode([
                    'success' => false,
                    'error' => 'Failed to create cake'
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

    // PUT /api/cakes/:id
    public function update($id) {
        try {
            $data = json_decode(file_get_contents("php://input"));

            $this->cake->id = $id;
            $this->cake->name = $data->name ?? '';
            $this->cake->description = $data->description ?? '';
            $this->cake->price = $data->price ?? 0;
            $this->cake->category_id = $data->category_id ?? null;
            $this->cake->image_url = $data->image_url ?? '';
            $this->cake->stock = $data->stock ?? 0;

            if ($this->cake->update()) {
                echo json_encode([
                    'success' => true,
                    'message' => 'Cake updated successfully'
                ]);
            } else {
                http_response_code(400);
                echo json_encode([
                    'success' => false,
                    'error' => 'Failed to update cake'
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

    // DELETE /api/cakes/:id
    public function delete($id) {
        try {
            if ($this->cake->delete($id)) {
                echo json_encode([
                    'success' => true,
                    'message' => 'Cake deleted successfully'
                ]);
            } else {
                http_response_code(400);
                echo json_encode([
                    'success' => false,
                    'error' => 'Failed to delete cake'
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
