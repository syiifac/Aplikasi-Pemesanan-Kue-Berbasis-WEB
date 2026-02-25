<?php

class Cart {
    private $conn;
    private $table = 'cart_items';

    public $id;
    public $user_id;
    public $cake_id;
    public $quantity;
    public $created_at;

    public function __construct($db) {
        $this->conn = $db;
    }

    // Get cart items for user
    public function getByUser($user_id) {
        $query = "SELECT ci.*, c.name, c.price, c.image_url, c.stock 
                  FROM " . $this->table . " ci
                  JOIN cakes c ON ci.cake_id = c.id
                  WHERE ci.user_id = :user_id
                  ORDER BY ci.created_at DESC";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':user_id', $user_id);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    // Add to cart
    public function add() {
        $query = "INSERT INTO " . $this->table . " (user_id, cake_id, quantity)
                  VALUES (:user_id, :cake_id, :quantity)
                  ON DUPLICATE KEY UPDATE quantity = quantity + :quantity";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':user_id', $this->user_id);
        $stmt->bindParam(':cake_id', $this->cake_id);
        $stmt->bindParam(':quantity', $this->quantity);

        return $stmt->execute();
    }

    // Update quantity
    public function update($id, $quantity) {
        if ($quantity <= 0) {
            return $this->delete($id);
        }

        $query = "UPDATE " . $this->table . " SET quantity = :quantity WHERE id = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $id);
        $stmt->bindParam(':quantity', $quantity);

        return $stmt->execute();
    }

    // Remove from cart
    public function delete($id) {
        $query = "DELETE FROM " . $this->table . " WHERE id = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $id);
        return $stmt->execute();
    }

    // Clear cart
    public function clear($user_id) {
        $query = "DELETE FROM " . $this->table . " WHERE user_id = :user_id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':user_id', $user_id);
        return $stmt->execute();
    }
}
