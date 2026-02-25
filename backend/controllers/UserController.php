<?php

class UserController {
  private $db;

  public function __construct($database) {
    $this->db = $database;
  }

  // GET all users
  public function getAllUsers() {
    header('Content-Type: application/json');
    
    try {
      $stmt = $this->db->prepare('SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC');
      $stmt->execute();
      $users = $stmt->fetchAll(PDO::FETCH_ASSOC);

      http_response_code(200);
      echo json_encode([
        'success' => true,
        'data' => $users
      ]);

    } catch (PDOException $e) {
      http_response_code(500);
      echo json_encode([
        'success' => false,
        'message' => 'Terjadi kesalahan pada server: ' . $e->getMessage()
      ]);
    }
  }

  // GET user by ID
  public function getUserById($id) {
    header('Content-Type: application/json');
    
    try {
      $stmt = $this->db->prepare('SELECT id, name, email, role, created_at FROM users WHERE id = ?');
      $stmt->execute([$id]);
      $user = $stmt->fetch(PDO::FETCH_ASSOC);

      if (!$user) {
        http_response_code(404);
        echo json_encode([
          'success' => false,
          'message' => 'User tidak ditemukan'
        ]);
        return;
      }

      http_response_code(200);
      echo json_encode([
        'success' => true,
        'data' => $user
      ]);

    } catch (PDOException $e) {
      http_response_code(500);
      echo json_encode([
        'success' => false,
        'message' => 'Terjadi kesalahan pada server: ' . $e->getMessage()
      ]);
    }
  }

  // CREATE new user (admin only)
  public function createUser() {
    header('Content-Type: application/json');
    
    $data = json_decode(file_get_contents("php://input"), true);
    
    if (!$data || !isset($data['name']) || !isset($data['email']) || !isset($data['password'])) {
      http_response_code(400);
      echo json_encode([
        'success' => false,
        'message' => 'Nama, email, dan password diperlukan'
      ]);
      return;
    }

    $name = trim($data['name']);
    $email = trim($data['email']);
    $password = $data['password'];
    $role = $data['role'] ?? 'CUSTOMER';

    // Validasi
    if (strlen($name) < 3) {
      http_response_code(400);
      echo json_encode([
        'success' => false,
        'message' => 'Nama harus minimal 3 karakter'
      ]);
      return;
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
      http_response_code(400);
      echo json_encode([
        'success' => false,
        'message' => 'Format email tidak valid'
      ]);
      return;
    }

    try {
      // Cek apakah email sudah terdaftar
      $stmt = $this->db->prepare('SELECT id FROM users WHERE email = ?');
      $stmt->execute([$email]);
      $existingUser = $stmt->fetch();

      if ($existingUser) {
        http_response_code(400);
        echo json_encode([
          'success' => false,
          'message' => 'Email sudah terdaftar'
        ]);
        return;
      }

      // Insert user baru
      $stmt = $this->db->prepare('INSERT INTO users (name, email, password, role, created_at) VALUES (?, ?, ?, ?, NOW())');
      $success = $stmt->execute([$name, $email, $password, $role]);

      if ($success) {
        $userId = $this->db->lastInsertId();
        
        // Get created user
        $stmt = $this->db->prepare('SELECT id, name, email, role, created_at FROM users WHERE id = ?');
        $stmt->execute([$userId]);
        $newUser = $stmt->fetch(PDO::FETCH_ASSOC);
        
        http_response_code(201);
        echo json_encode([
          'success' => true,
          'message' => 'User berhasil dibuat',
          'data' => $newUser
        ]);
      } else {
        throw new Exception('Gagal membuat user');
      }

    } catch (PDOException $e) {
      http_response_code(500);
      echo json_encode([
        'success' => false,
        'message' => 'Terjadi kesalahan pada server: ' . $e->getMessage()
      ]);
    }
  }

  // UPDATE user
  public function updateUser($id) {
    header('Content-Type: application/json');
    
    $data = json_decode(file_get_contents("php://input"), true);
    
    if (!$data) {
      http_response_code(400);
      echo json_encode([
        'success' => false,
        'message' => 'Data tidak valid'
      ]);
      return;
    }

    try {
      // Check if user exists
      $stmt = $this->db->prepare('SELECT id FROM users WHERE id = ?');
      $stmt->execute([$id]);
      $user = $stmt->fetch();

      if (!$user) {
        http_response_code(404);
        echo json_encode([
          'success' => false,
          'message' => 'User tidak ditemukan'
        ]);
        return;
      }

      // Build update query
      $updateFields = [];
      $params = [];

      if (isset($data['name'])) {
        $updateFields[] = 'name = ?';
        $params[] = trim($data['name']);
      }

      if (isset($data['email'])) {
        // Check if email is already used by another user
        $stmt = $this->db->prepare('SELECT id FROM users WHERE email = ? AND id != ?');
        $stmt->execute([trim($data['email']), $id]);
        if ($stmt->fetch()) {
          http_response_code(400);
          echo json_encode([
            'success' => false,
            'message' => 'Email sudah digunakan oleh user lain'
          ]);
          return;
        }
        
        $updateFields[] = 'email = ?';
        $params[] = trim($data['email']);
      }

      if (isset($data['role'])) {
        $updateFields[] = 'role = ?';
        $params[] = $data['role'];
      }

      if (isset($data['password']) && !empty($data['password'])) {
        $updateFields[] = 'password = ?';
        $params[] = $data['password'];
      }

      if (empty($updateFields)) {
        http_response_code(400);
        echo json_encode([
          'success' => false,
          'message' => 'Tidak ada field yang diupdate'
        ]);
        return;
      }

      $params[] = $id;
      $sql = 'UPDATE users SET ' . implode(', ', $updateFields) . ' WHERE id = ?';
      $stmt = $this->db->prepare($sql);
      $success = $stmt->execute($params);

      if ($success) {
        // Get updated user
        $stmt = $this->db->prepare('SELECT id, name, email, role, created_at FROM users WHERE id = ?');
        $stmt->execute([$id]);
        $updatedUser = $stmt->fetch(PDO::FETCH_ASSOC);
        
        http_response_code(200);
        echo json_encode([
          'success' => true,
          'message' => 'User berhasil diupdate',
          'data' => $updatedUser
        ]);
      } else {
        throw new Exception('Gagal mengupdate user');
      }

    } catch (PDOException $e) {
      http_response_code(500);
      echo json_encode([
        'success' => false,
        'message' => 'Terjadi kesalahan pada server: ' . $e->getMessage()
      ]);
    }
  }

  // DELETE user
  public function deleteUser($id) {
    header('Content-Type: application/json');
    
    try {
      // Check if user exists
      $stmt = $this->db->prepare('SELECT id, email FROM users WHERE id = ?');
      $stmt->execute([$id]);
      $user = $stmt->fetch(PDO::FETCH_ASSOC);

      if (!$user) {
        http_response_code(404);
        echo json_encode([
          'success' => false,
          'message' => 'User tidak ditemukan'
        ]);
        return;
      }

      // Prevent deleting default admin
      if ($user['email'] === 'admin@sweetbites.com') {
        http_response_code(403);
        echo json_encode([
          'success' => false,
          'message' => 'Admin utama tidak dapat dihapus'
        ]);
        return;
      }

      $stmt = $this->db->prepare('DELETE FROM users WHERE id = ?');
      $success = $stmt->execute([$id]);

      if ($success) {
        http_response_code(200);
        echo json_encode([
          'success' => true,
          'message' => 'User berhasil dihapus'
        ]);
      } else {
        throw new Exception('Gagal menghapus user');
      }

    } catch (PDOException $e) {
      http_response_code(500);
      echo json_encode([
        'success' => false,
        'message' => 'Terjadi kesalahan pada server: ' . $e->getMessage()
      ]);
    }
  }
}
