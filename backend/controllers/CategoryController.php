<?php

require_once __DIR__ . '/../models/Category.php';

class CategoryController {
    private $db;
    private $category;

    public function __construct($db) {
        $this->db = $db;
        $this->category = new Category($db);
    }

    // GET /api/categories
    public function getAll() {
        try {
            $categories = $this->category->getAll();
            echo json_encode([
                'success' => true,
                'data' => $categories
            ]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'error' => $e->getMessage()
            ]);
        }
    }

    // GET /api/categories/:id
    public function getById($id) {
        try {
            $category = $this->category->getById($id);
            if ($category) {
                echo json_encode([
                    'success' => true,
                    'data' => $category
                ]);
            } else {
                http_response_code(404);
                echo json_encode([
                    'success' => false,
                    'error' => 'Category not found'
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

    // POST /api/categories
    public function create() {
        try {
            $data = json_decode(file_get_contents("php://input"));

            $this->category->name = $data->name ?? '';
            $this->category->description = $data->description ?? '';
            $this->category->image_url = $data->image_url ?? '';

            if ($this->category->create()) {
                http_response_code(201);
                echo json_encode([
                    'success' => true,
                    'message' => 'Category created successfully'
                ]);
            } else {
                http_response_code(400);
                echo json_encode([
                    'success' => false,
                    'error' => 'Failed to create category'
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

    // PUT /api/categories/:id
    public function update($id) {
        try {
            $data = json_decode(file_get_contents("php://input"));

            $this->category->id = $id;
            $this->category->name = $data->name ?? '';
            $this->category->description = $data->description ?? '';
            $this->category->image_url = $data->image_url ?? '';

            if ($this->category->update()) {
                echo json_encode([
                    'success' => true,
                    'message' => 'Category updated successfully'
                ]);
            } else {
                http_response_code(400);
                echo json_encode([
                    'success' => false,
                    'error' => 'Failed to update category'
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

    // DELETE /api/categories/:id
    public function delete($id) {
        try {
            if ($this->category->delete($id)) {
                echo json_encode([
                    'success' => true,
                    'message' => 'Category deleted successfully'
                ]);
            } else {
                http_response_code(400);
                echo json_encode([
                    'success' => false,
                    'error' => 'Failed to delete category'
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
