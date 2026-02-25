<?php

class AuthController {
  private $db;

  public function __construct($database) {
    $this->db = $database;
  }

  public function login() {
    header('Content-Type: application/json');
    
    $data = json_decode(file_get_contents("php://input"), true);
    
    if (!$data || !isset($data['email']) || !isset($data['password'])) {
      http_response_code(400);
      echo json_encode([
        'success' => false,
        'message' => 'Email dan password diperlukan'
      ]);
      return;
    }

    $email = $data['email'];
    $password = $data['password'];

    try {
      $stmt = $this->db->prepare('SELECT id, name, email, role FROM users WHERE email = ?');
      $stmt->execute([$email]);
      $user = $stmt->fetch(PDO::FETCH_ASSOC);

      if (!$user) {
        http_response_code(401);
        echo json_encode([
          'success' => false,
          'message' => 'Email tidak terdaftar'
        ]);
        return;
      }

      // Untuk sekarang, bandingkan password langsung (tanpa hashing)
      // TODO: Implementasi password hashing dengan password_hash() dan password_verify()
      $stmt = $this->db->prepare('SELECT password FROM users WHERE email = ?');
      $stmt->execute([$email]);
      $result = $stmt->fetch(PDO::FETCH_ASSOC);
      
      if (!$result || $result['password'] !== $password) {
        http_response_code(401);
        echo json_encode([
          'success' => false,
          'message' => 'Password salah'
        ]);
        return;
      }

      http_response_code(200);
      echo json_encode([
        'success' => true,
        'message' => 'Login berhasil',
        'user' => [
          'id' => $user['id'],
          'name' => $user['name'],
          'email' => $user['email'],
          'role' => $user['role']
        ]
      ]);

    } catch (PDOException $e) {
      http_response_code(500);
      echo json_encode([
        'success' => false,
        'message' => 'Terjadi kesalahan pada server: ' . $e->getMessage()
      ]);
    }
  }

  public function register() {
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

    if (strlen($password) < 6) {
      http_response_code(400);
      echo json_encode([
        'success' => false,
        'message' => 'Password harus minimal 6 karakter'
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
      // TODO: Gunakan password_hash() untuk keamanan
      $stmt = $this->db->prepare('INSERT INTO users (name, email, password, role, created_at) VALUES (?, ?, ?, ?, NOW())');
      $success = $stmt->execute([$name, $email, $password, $role]);

      if ($success) {
        $userId = $this->db->lastInsertId();
        
        http_response_code(201);
        echo json_encode([
          'success' => true,
          'message' => 'Registrasi berhasil',
          'user' => [
            'id' => $userId,
            'name' => $name,
            'email' => $email,
            'role' => $role
          ]
        ]);
      } else {
        http_response_code(500);
        echo json_encode([
          'success' => false,
          'message' => 'Gagal membuat akun'
        ]);
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
