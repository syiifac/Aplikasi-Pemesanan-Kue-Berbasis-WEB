<?php
/**
 * Test Script untuk Auth Endpoints
 * Jalankan dengan: php backend/test-auth.php
 */

require_once __DIR__ . '/config/config.php';
require_once __DIR__ . '/config/Database.php';

$database = new Database();
$db = $database->connect();

echo "=== Testing Auth Endpoints ===\n\n";

// Test 1: Login dengan kredensial yang benar
echo "[TEST 1] Login dengan admin@sweetbites.com\n";
$loginData = json_encode([
    'email' => 'admin@sweetbites.com',
    'password' => '123456'
]);

try {
    $stmt = $db->prepare('SELECT id, name, email, role FROM users WHERE email = ?');
    $stmt->execute(['admin@sweetbites.com']);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if ($user) {
        echo "✓ User ditemukan: {$user['name']} ({$user['role']})\n";
        
        // Check password
        $stmt = $db->prepare('SELECT password FROM users WHERE email = ?');
        $stmt->execute(['admin@sweetbites.com']);
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($result && $result['password'] === '123456') {
            echo "✓ Password cocok\n";
            echo "✓ Login berhasil\n";
        } else {
            echo "✗ Password tidak cocok\n";
        }
    } else {
        echo "✗ User tidak ditemukan\n";
    }
} catch (PDOException $e) {
    echo "✗ Error: " . $e->getMessage() . "\n";
}

echo "\n";

// Test 2: Register user baru
echo "[TEST 2] Register user baru\n";
$newEmail = 'test' . time() . '@example.com';
$newName = 'Test User';
$newPassword = 'password123';

try {
    // Cek email duplicate
    $stmt = $db->prepare('SELECT id FROM users WHERE email = ?');
    $stmt->execute([$newEmail]);
    $existing = $stmt->fetch();
    
    if (!$existing) {
        // Insert user baru
        $stmt = $db->prepare('INSERT INTO users (name, email, password, role, created_at) VALUES (?, ?, ?, ?, NOW())');
        $success = $stmt->execute([$newName, $newEmail, $newPassword, 'CUSTOMER']);
        
        if ($success) {
            $userId = $db->lastInsertId();
            echo "✓ User berhasil dibuat (ID: $userId)\n";
            echo "  Email: $newEmail\n";
            echo "  Nama: $newName\n";
        } else {
            echo "✗ Gagal membuat user\n";
        }
    } else {
        echo "✗ Email sudah terdaftar\n";
    }
} catch (PDOException $e) {
    echo "✗ Error: " . $e->getMessage() . "\n";
}

echo "\n";

// Test 3: List semua users
echo "[TEST 3] Daftar semua users\n";
try {
    $stmt = $db->prepare('SELECT id, name, email, role FROM users');
    $stmt->execute();
    $users = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo "Total users: " . count($users) . "\n";
    foreach ($users as $user) {
        echo "  - {$user['name']} ({$user['email']}) - {$user['role']}\n";
    }
} catch (PDOException $e) {
    echo "✗ Error: " . $e->getMessage() . "\n";
}

echo "\n✅ Test selesai\n";
