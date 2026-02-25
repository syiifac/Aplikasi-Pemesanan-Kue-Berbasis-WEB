<?php
/**
 * Database Setup Script
 * Jalankan dengan: php backend/setup_database.php
 */

// Database connection tanpa nama database terlebih dahulu
$host = 'localhost';
$user = 'root';
$password = '';
$db_name = 'sweet_bites_bakery';

try {
    // Connect ke MySQL
    $conn = new PDO("mysql:host=$host", $user, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    echo "[✓] Berhasil connect ke MySQL\n";
    
    // Drop database jika sudah ada (opsional)
    // $conn->exec("DROP DATABASE IF EXISTS $db_name");
    
    // Create database
    $conn->exec("CREATE DATABASE IF NOT EXISTS $db_name");
    echo "[✓] Database '$db_name' siap\n";
    
    // Select database
    $conn->exec("USE $db_name");
    echo "[✓] Database dipilih\n";
    
    // Read schema.sql or sweetbites.sql
    $schema_path = __DIR__ . '/../../database/sweetbites.sql';
    if (!file_exists($schema_path)) {
        $schema_path = __DIR__ . '/../database/sweetbites.sql';
    }
    
    $schema = file_get_contents($schema_path);
    
    // Execute schema
    $statements = explode(';', $schema);
    foreach ($statements as $statement) {
        $statement = trim($statement);
        if (!empty($statement)) {
            $conn->exec($statement);
        }
    }
    
    // Insert sample data
    $sample_data = "
    INSERT IGNORE INTO categories (category_name) VALUES 
    ('Kue Lebaran'),
    ('Cookies'),
    ('Dessert'),
    ('Classic'),
    ('Pastry');
    
    DELETE FROM cakes;
    INSERT INTO cakes (name, description, price, category_id, image_url, stock) VALUES 
    ('Nastar Premium', 'Kue kering klasik khas lebaran', 125000, 1, '/images/cakes/nastar.png', 25),
    ('Kastengel Keju', 'Kue keju panggang yang renyah', 135000, 1, '/images/cakes/kastengel.png', 20),
    ('Soft-Baked Choco Chip', 'Cookies lembut gaya New York', 25000, 2, '/images/cakes/choco-chip.png', 40),
    ('Matcha White Chocolate', 'Cookies dengan matcha premium', 28000, 2, '/images/cakes/matcha.png', 30),
    ('Lotus Biscoff Cheesecake', 'Cheesecake dengan dasar Lotus', 45000, 3, '/images/cakes/cheesecake.png', 12),
    ('Mango Sago Pudding', 'Puding mangga sutra premium', 35000, 3, '/images/cakes/mango-sago.png', 18),
    ('Lapis Legit Original', 'Kue lapis tradisional', 250000, 4, '/images/cakes/lapis-legit.png', 5),
    ('Tiramisu Tradizionale', 'Layer ladyfinger dengan mascarpone', 65000, 4, '/images/cakes/tiramisu.png', 8);
    
    DELETE FROM users WHERE email IN ('admin@sweetbites.com', 'seller@sweetbites.com', 'customer@sweetbites.com');
    INSERT INTO users (name, email, password, role) VALUES 
    ('Admin Utama', 'admin@sweetbites.com', '123456', 'ADMIN'),
    ('Penjual Kue', 'seller@sweetbites.com', '123456', 'SELLER'),
    ('Budi Santoso', 'customer@sweetbites.com', '123456', 'CUSTOMER');
    ";
    
    foreach (explode(';', $sample_data) as $stmt) {
        $stmt = trim($stmt);
        if (!empty($stmt)) {
            $conn->exec($stmt);
        }
    }
    
    echo "[✓] Data sample berhasil diinsert\n";
    echo "\n✅ Database setup berhasil!\n";
    echo "\nDatabase Ready untuk digunakan.\n";
    echo "Frontend: http://localhost:5173\n";
    echo "Backend API: http://localhost:8080/backend/api\n";
    
} catch (PDOException $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
    exit(1);
}
?>
