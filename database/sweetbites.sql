-- 1. Buat Database
CREATE DATABASE IF NOT EXISTS sweet_bites_bakery;
USE sweet_bites_bakery;

-- 2. Tabel Pengguna (Admin, Penjual, Pelanggan)
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('CUSTOMER', 'SELLER', 'ADMIN') DEFAULT 'CUSTOMER',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Tabel Kategori (Opsional, untuk organisasi yang lebih baik)
CREATE TABLE categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    category_name VARCHAR(50) NOT NULL UNIQUE
);

-- 4. Tabel Produk Kue
CREATE TABLE cakes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(12, 2) NOT NULL,
    image_url VARCHAR(255),
    stock INT DEFAULT 0,
    category_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);

-- 5. Tabel Pesanan (Header)
CREATE TABLE orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    total_amount DECIMAL(12, 2) NOT NULL,
    status ENUM('PENDING_PAYMENT', 'AWAITING_VERIFICATION', 'PROCESSING', 'SHIPPED', 'COMPLETED', 'CANCELLED') DEFAULT 'PENDING_PAYMENT',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 6. Tabel Detail Pesanan (Produk yang dibeli)
CREATE TABLE order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    cake_id INT NOT NULL,
    quantity INT NOT NULL,
    price_at_purchase DECIMAL(12, 2) NOT NULL, -- Menyimpan harga saat dibeli (antisipasi perubahan harga di masa depan)
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (cake_id) REFERENCES cakes(id)
);

-- 7. Tabel Pembayaran & Bukti Transfer
CREATE TABLE payments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL UNIQUE,
    payment_proof_url VARCHAR(255), -- Lokasi path foto bukti transfer
    bank_name VARCHAR(50),
    is_verified BOOLEAN DEFAULT FALSE,
    verified_at TIMESTAMP NULL,
    verified_by INT, -- Admin yang melakukan verifikasi
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (verified_by) REFERENCES users(id) ON DELETE SET NULL
);

-- 8. Tabel Keranjang (Opsional, untuk menyimpan belanjaan sebelum checkout)
CREATE TABLE cart_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    cake_id INT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (cake_id) REFERENCES cakes(id) ON DELETE CASCADE
);

-- ==========================================
-- DATA DUMMY UNTUK TESTING
-- ==========================================

-- Tambah Kategori
INSERT INTO categories (category_name) VALUES ('Sponge'), ('Chocolate'), ('Fruity'), ('Classic');

-- Tambah User (Password contoh: 'password123')
INSERT INTO users (name, email, password, role) VALUES 
('Admin Utama', 'admin@sweetbites.com', 'hashed_password_here', 'ADMIN'),
('Penjual Kue', 'seller@sweetbites.com', 'hashed_password_here', 'SELLER'),
('Budi Santoso', 'budi@gmail.com', 'hashed_password_here', 'CUSTOMER');

-- Tambah Produk Kue
INSERT INTO cakes (name, description, price, image_url, stock, category_id) VALUES 
('Strawberry Shortcake', 'Kue lembut dengan stroberi segar.', 45000, 'shortcake.jpg', 10, 1),
('Chocolate Ganache', 'Cokelat hitam premium yang kaya rasa.', 55000, 'ganache.jpg', 5, 2),
('Lemon Drizzle', 'Segar dengan siraman lemon asli.', 40000, 'lemon.jpg', 12, 3);