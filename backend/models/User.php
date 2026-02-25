<?php

class User {
    private $conn;
    private $table = 'users';

    public $id;
    public $name;
    public $email;
    public $password;
    public $phone;
    public $address;
    public $role;
    public $created_at;

    public function __construct($db) {
        $this->conn = $db;
    }

    // Get all users
    public function getAll() {
        $query = "SELECT id, name, email, phone, role, created_at FROM " . $this->table;
        $result = $this->conn->query($query);
        return $result->fetchAll(PDO::FETCH_ASSOC);
    }

    // Get user by ID
    public function getById($id) {
        $query = "SELECT id, name, email, phone, address, role, created_at 
                  FROM " . $this->table . " WHERE id = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $id);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    // Get user by email
    public function getByEmail($email) {
        $query = "SELECT * FROM " . $this->table . " WHERE email = :email";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':email', $email);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    // Create user
    public function create() {
        $query = "INSERT INTO " . $this->table . "
                  (name, email, password, phone, address, role)
                  VALUES (:name, :email, :password, :phone, :address, :role)";
        
        $stmt = $this->conn->prepare($query);

        $this->password = password_hash($this->password, PASSWORD_BCRYPT);

        $stmt->bindParam(':name', $this->name);
        $stmt->bindParam(':email', $this->email);
        $stmt->bindParam(':password', $this->password);
        $stmt->bindParam(':phone', $this->phone);
        $stmt->bindParam(':address', $this->address);
        $stmt->bindParam(':role', $this->role);

        return $stmt->execute();
    }

    // Update user
    public function update() {
        $query = "UPDATE " . $this->table . "
                  SET name = :name, phone = :phone, address = :address
                  WHERE id = :id";
        
        $stmt = $this->conn->prepare($query);

        $stmt->bindParam(':id', $this->id);
        $stmt->bindParam(':name', $this->name);
        $stmt->bindParam(':phone', $this->phone);
        $stmt->bindParam(':address', $this->address);

        return $stmt->execute();
    }

    // Verify password
    public function verifyPassword($password) {
        return password_verify($password, $this->password);
    }
}
