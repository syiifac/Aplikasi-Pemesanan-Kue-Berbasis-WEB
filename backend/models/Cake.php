<?php

class Cake {
    private $conn;
    private $table = 'cakes';

    public $id;
    public $name;
    public $description;
    public $price;
    public $category_id;
    public $image_url;
    public $stock;
    public $created_at;
    public $updated_at;

    public function __construct($db) {
        $this->conn = $db;
    }

    // Get all cakes
    public function getAll() {
        $query = "SELECT c.*, cat.name as category 
                  FROM " . $this->table . " c
                  LEFT JOIN categories cat ON c.category_id = cat.id
                  ORDER BY c.created_at DESC";
        $result = $this->conn->query($query);
        return $result->fetchAll(PDO::FETCH_ASSOC);
    }

    // Get single cake
    public function getById($id) {
        $query = "SELECT c.*, cat.name as category 
                  FROM " . $this->table . " c
                  LEFT JOIN categories cat ON c.category_id = cat.id
                  WHERE c.id = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $id);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    // Get cakes by category
    public function getByCategory($category_id) {
        $query = "SELECT * FROM " . $this->table . " WHERE category_id = :category_id ORDER BY created_at DESC";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':category_id', $category_id);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    // Create cake
    public function create() {
        $query = "INSERT INTO " . $this->table . "
                  (name, description, price, category_id, image_url, stock)
                  VALUES (:name, :description, :price, :category_id, :image_url, :stock)";
        
        $stmt = $this->conn->prepare($query);

        $stmt->bindParam(':name', $this->name);
        $stmt->bindParam(':description', $this->description);
        $stmt->bindParam(':price', $this->price);
        $stmt->bindParam(':category_id', $this->category_id);
        $stmt->bindParam(':image_url', $this->image_url);
        $stmt->bindParam(':stock', $this->stock);

        return $stmt->execute();
    }

    // Update cake
    public function update() {
        $query = "UPDATE " . $this->table . "
                  SET name = :name, description = :description, price = :price,
                      category_id = :category_id, image_url = :image_url, stock = :stock
                  WHERE id = :id";
        
        $stmt = $this->conn->prepare($query);

        $stmt->bindParam(':id', $this->id);
        $stmt->bindParam(':name', $this->name);
        $stmt->bindParam(':description', $this->description);
        $stmt->bindParam(':price', $this->price);
        $stmt->bindParam(':category_id', $this->category_id);
        $stmt->bindParam(':image_url', $this->image_url);
        $stmt->bindParam(':stock', $this->stock);

        return $stmt->execute();
    }

    // Delete cake
    public function delete($id) {
        $query = "DELETE FROM " . $this->table . " WHERE id = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $id);
        return $stmt->execute();
    }

    // Update stock
    public function updateStock($id, $quantity) {
        $query = "UPDATE " . $this->table . " SET stock = stock - :quantity WHERE id = :id AND stock >= :quantity";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $id);
        $stmt->bindParam(':quantity', $quantity);
        return $stmt->execute();
    }
}
