# Use Case Diagram - Sweet Bites Bakery Management System

## 1. Aktor

### 1.1 Customer (Pelanggan)
Pengguna yang dapat melakukan pembelian produk kue dari toko.

### 1.2 Admin
Pengelola sistem yang memiliki akses penuh untuk mengelola produk, kategori, dan melihat semua pesanan.

### 1.3 Seller (Penjual)
Pengguna yang dapat mengelola produk kue dan melihat pesanan.

---

## 2. Use Case Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    Sweet Bites Bakery Management System                 │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│  Customer              System Features                    Admin/Seller   │
│    │                                                           │          │
│    │                                                           │          │
│    ├──> Register                                               │          │
│    ├──> Login                                         <────────┤          │
│    ├──> Browse Catalog                                         │          │
│    ├──> Search Products                                        │          │
│    ├──> Filter by Category                                     │          │
│    ├──> View Product Detail                                    │          │
│    ├──> Add to Cart                                            │          │
│    ├──> View Cart                                              │          │
│    ├──> Update Cart Quantity                                   │          │
│    ├──> Remove from Cart                                       │          │
│    ├──> Checkout                                               │          │
│    ├──> View Order History                                     │          │
│    ├──> AI Recommendation (Chat)                               │          │
│    │                                                           │          │
│    │                                                           ├──> Manage Products │
│    │                                                           ├──> Add Product     │
│    │                                                           ├──> Edit Product    │
│    │                                                           ├──> Delete Product  │
│    │                                                           ├──> View All Orders │
│    │                                                           │                    │
│    │                                (Admin Only)               │                    │
│    │                                                           ├──> Manage Categories │
│    │                                                           ├──> Add Category      │
│    │                                                           ├──> Edit Category     │
│    │                                                           └──> Delete Category   │
│                                                                           │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Deskripsi Use Case

### 3.1 Use Case Customer

#### UC-01: Register
**Aktor:** Customer  
**Deskripsi:** Pelanggan dapat mendaftar akun baru dengan mengisi nama, email, dan password.  
**Precondition:** Pelanggan belum memiliki akun.  
**Postcondition:** Akun pelanggan berhasil dibuat dan tersimpan di database.

**Main Flow:**
1. Pelanggan mengklik tombol "Register" di halaman login
2. Sistem menampilkan form registrasi
3. Pelanggan mengisi nama, email, dan password
4. Pelanggan mengklik tombol "Daftar"
5. Sistem memvalidasi data input
6. Sistem menyimpan data pelanggan dengan role "customer"
7. Sistem menampilkan pesan sukses dan redirect ke halaman login

**Alternative Flow:**
- 5a. Jika email sudah terdaftar, sistem menampilkan pesan error
- 5b. Jika password kurang dari 6 karakter, sistem menampilkan pesan error

---

#### UC-02: Login
**Aktor:** Customer, Admin, Seller  
**Deskripsi:** User dapat masuk ke sistem menggunakan email dan password.  
**Precondition:** User sudah memiliki akun.  
**Postcondition:** User berhasil login dan diarahkan ke dashboard sesuai role.

**Main Flow:**
1. User mengakses halaman login
2. User mengisi email dan password
3. User mengklik tombol "Masuk"
4. Sistem memvalidasi kredensial
5. Sistem menyimpan session user
6. Sistem redirect ke halaman sesuai role:
   - Customer → Home/Catalog
   - Admin → Admin Dashboard
   - Seller → Seller Dashboard

**Alternative Flow:**
- 4a. Jika kredensial salah, sistem menampilkan pesan error

---

#### UC-03: Browse Catalog
**Aktor:** Customer  
**Deskripsi:** Pelanggan dapat melihat daftar produk kue yang tersedia.  
**Precondition:** -  
**Postcondition:** Daftar produk ditampilkan.

**Main Flow:**
1. Pelanggan mengakses halaman "Katalog"
2. Sistem mengambil data produk dari database
3. Sistem menampilkan grid produk dengan informasi:
   - Gambar produk
   - Nama produk
   - Kategori
   - Harga
   - Stok

---

#### UC-04: Search Products
**Aktor:** Customer  
**Deskripsi:** Pelanggan dapat mencari produk berdasarkan nama atau deskripsi.  
**Precondition:** -  
**Postcondition:** Hasil pencarian ditampilkan.

**Main Flow:**
1. Pelanggan mengetik query di search bar
2. Sistem melakukan filter real-time
3. Sistem menampilkan produk yang cocok dengan query

---

#### UC-05: Filter by Category
**Aktor:** Customer  
**Deskripsi:** Pelanggan dapat memfilter produk berdasarkan kategori.  
**Precondition:** -  
**Postcondition:** Produk yang ditampilkan sesuai kategori yang dipilih.

**Main Flow:**
1. Pelanggan mengklik tombol kategori (Semua, Kue Basah, Kue Kering, dll)
2. Sistem memfilter produk berdasarkan kategori
3. Sistem menampilkan hasil filter

---

#### UC-06: View Product Detail
**Aktor:** Customer  
**Deskripsi:** Pelanggan dapat melihat detail lengkap dari suatu produk.  
**Precondition:** Produk tersedia di katalog.  
**Postcondition:** Detail produk ditampilkan.

**Main Flow:**
1. Pelanggan mengklik gambar atau nama produk
2. Sistem menampilkan halaman detail produk dengan informasi:
   - Gambar besar
   - Nama produk
   - Kategori
   - Deskripsi lengkap
   - Harga
   - Stok tersedia
   - Input quantity
   - Tombol "Tambah ke Keranjang"

---

#### UC-07: Add to Cart
**Aktor:** Customer  
**Deskripsi:** Pelanggan dapat menambahkan produk ke keranjang belanja.  
**Precondition:** Pelanggan sudah login.  
**Postcondition:** Produk ditambahkan ke keranjang.

**Main Flow:**
1. Pelanggan memilih quantity produk
2. Pelanggan mengklik tombol "Tambah ke Keranjang"
3. Sistem memvalidasi stok tersedia
4. Sistem menambahkan produk ke keranjang
5. Sistem menampilkan notifikasi sukses
6. Sistem update badge jumlah item di keranjang

**Alternative Flow:**
- 3a. Jika stok tidak cukup, sistem menampilkan pesan error

---

#### UC-08: View Cart
**Aktor:** Customer  
**Deskripsi:** Pelanggan dapat melihat isi keranjang belanja.  
**Precondition:** Pelanggan sudah login.  
**Postcondition:** Isi keranjang ditampilkan.

**Main Flow:**
1. Pelanggan mengklik icon keranjang di navbar
2. Sistem menampilkan halaman keranjang dengan:
   - List produk di keranjang
   - Gambar, nama, harga, quantity
   - Subtotal per item
   - Total keseluruhan
   - Tombol checkout

---

#### UC-09: Update Cart Quantity
**Aktor:** Customer  
**Deskripsi:** Pelanggan dapat mengubah jumlah item di keranjang.  
**Precondition:** Ada item di keranjang.  
**Postcondition:** Quantity item diupdate.

**Main Flow:**
1. Pelanggan mengubah quantity di input field
2. Sistem memvalidasi stok tersedia
3. Sistem mengupdate quantity di keranjang
4. Sistem menghitung ulang subtotal dan total

**Alternative Flow:**
- 2a. Jika quantity melebihi stok, sistem set ke maksimum stok tersedia

---

#### UC-10: Remove from Cart
**Aktor:** Customer  
**Deskripsi:** Pelanggan dapat menghapus item dari keranjang.  
**Precondition:** Ada item di keranjang.  
**Postcondition:** Item dihapus dari keranjang.

**Main Flow:**
1. Pelanggan mengklik tombol "Hapus" pada item
2. Sistem menampilkan konfirmasi
3. Pelanggan mengkonfirmasi penghapusan
4. Sistem menghapus item dari keranjang
5. Sistem menghitung ulang total

---

#### UC-11: Checkout
**Aktor:** Customer  
**Deskripsi:** Pelanggan dapat melakukan checkout dan membuat pesanan.  
**Precondition:** Ada item di keranjang.  
**Postcondition:** Pesanan berhasil dibuat.

**Main Flow:**
1. Pelanggan mengklik tombol "Checkout" di halaman keranjang
2. Sistem menampilkan halaman checkout dengan form:
   - Nama penerima
   - Alamat pengiriman
   - Nomor telepon
   - Catatan (opsional)
3. Pelanggan mengisi form
4. Pelanggan mengklik "Buat Pesanan"
5. Sistem memvalidasi data
6. Sistem membuat order baru dengan status "pending"
7. Sistem mengurangi stok produk
8. Sistem mengosongkan keranjang
9. Sistem menampilkan pesan sukses dan nomor order
10. Sistem redirect ke halaman order history

**Alternative Flow:**
- 6a. Jika stok tidak cukup, sistem menampilkan error dan batalkan order

---

#### UC-12: View Order History
**Aktor:** Customer  
**Deskripsi:** Pelanggan dapat melihat riwayat pesanan.  
**Precondition:** Pelanggan sudah login.  
**Postcondition:** Riwayat pesanan ditampilkan.

**Main Flow:**
1. Pelanggan mengakses halaman "Riwayat Pesanan"
2. Sistem mengambil data pesanan pelanggan
3. Sistem menampilkan list pesanan dengan:
   - Nomor order
   - Tanggal order
   - Status (pending/completed/cancelled)
   - Total harga
   - Detail produk yang dipesan

---

#### UC-13: AI Recommendation (Chat)
**Aktor:** Customer  
**Deskripsi:** Pelanggan dapat berkomunikasi dengan AI untuk mendapatkan rekomendasi produk.  
**Precondition:** -  
**Postcondition:** AI memberikan rekomendasi produk.

**Main Flow:**
1. Pelanggan mengakses halaman "Home"
2. Pelanggan mengetik pertanyaan di chat box AI
3. Pelanggan mengklik tombol "Kirim" atau tekan Enter
4. Sistem mengirim query ke Google Gemini API
5. Sistem menerima response dari AI
6. Sistem menampilkan rekomendasi produk berdasarkan response
7. Pelanggan dapat mengklik produk untuk melihat detail

**Alternative Flow:**
- 4a. Jika API key tidak valid, sistem menggunakan rekomendasi lokal
- 4b. Jika terjadi error, sistem menampilkan fallback recommendations

---

### 3.2 Use Case Admin/Seller

#### UC-14: Manage Products
**Aktor:** Admin, Seller  
**Deskripsi:** Admin/Seller dapat mengelola produk (CRUD).  
**Precondition:** User login sebagai admin atau seller.  
**Postcondition:** Data produk berhasil dikelola.

**Main Flow:**
1. User mengakses dashboard
2. Sistem menampilkan tabel produk dengan kolom:
   - Gambar
   - Nama
   - Kategori
   - Harga
   - Stok
   - Aksi (Edit/Delete)

---

#### UC-15: Add Product
**Aktor:** Admin, Seller  
**Deskripsi:** Admin/Seller dapat menambah produk baru.  
**Precondition:** User login sebagai admin atau seller.  
**Postcondition:** Produk baru berhasil ditambahkan.

**Main Flow:**
1. User mengklik tombol "Tambah Produk"
2. Sistem menampilkan form input:
   - Nama produk
   - Kategori
   - Deskripsi
   - Harga
   - Stok
   - Upload gambar
3. User mengisi form
4. User mengklik "Simpan"
5. Sistem memvalidasi input
6. Sistem menyimpan produk ke database
7. Sistem menampilkan notifikasi sukses
8. Sistem refresh tabel produk

**Alternative Flow:**
- 5a. Jika ada field yang kosong, sistem menampilkan error
- 5b. Jika format gambar tidak valid, sistem menampilkan error

---

#### UC-16: Edit Product
**Aktor:** Admin, Seller  
**Deskripsi:** Admin/Seller dapat mengubah data produk.  
**Precondition:** Produk sudah ada.  
**Postcondition:** Data produk berhasil diupdate.

**Main Flow:**
1. User mengklik tombol "Edit" pada produk
2. Sistem menampilkan form yang sudah terisi data produk
3. User mengubah data yang diperlukan
4. User mengklik "Update"
5. Sistem memvalidasi input
6. Sistem mengupdate data di database
7. Sistem menampilkan notifikasi sukses
8. Sistem refresh tabel produk

---

#### UC-17: Delete Product
**Aktor:** Admin, Seller  
**Deskripsi:** Admin/Seller dapat menghapus produk.  
**Precondition:** Produk sudah ada.  
**Postcondition:** Produk berhasil dihapus.

**Main Flow:**
1. User mengklik tombol "Delete" pada produk
2. Sistem menampilkan konfirmasi penghapusan
3. User mengkonfirmasi
4. Sistem menghapus produk dari database
5. Sistem menampilkan notifikasi sukses
6. Sistem refresh tabel produk

---

#### UC-18: View All Orders
**Aktor:** Admin, Seller  
**Deskripsi:** Admin/Seller dapat melihat semua pesanan dari customer.  
**Precondition:** User login sebagai admin atau seller.  
**Postcondition:** Daftar pesanan ditampilkan.

**Main Flow:**
1. User mengakses tab "Pesanan" di dashboard
2. Sistem mengambil semua data pesanan
3. Sistem menampilkan tabel pesanan dengan:
   - Nomor order
   - Nama customer
   - Tanggal order
   - Total harga
   - Status
   - Detail items

---

### 3.3 Use Case Admin Only

#### UC-19: Manage Categories
**Aktor:** Admin  
**Deskripsi:** Admin dapat mengelola kategori produk.  
**Precondition:** User login sebagai admin.  
**Postcondition:** Kategori berhasil dikelola.

**Main Flow:**
1. Admin mengakses tab "Kategori" di dashboard
2. Sistem menampilkan list kategori

---

#### UC-20: Add Category
**Aktor:** Admin  
**Deskripsi:** Admin dapat menambah kategori baru.  
**Precondition:** User login sebagai admin.  
**Postcondition:** Kategori baru berhasil ditambahkan.

**Main Flow:**
1. Admin mengklik "Tambah Kategori"
2. Sistem menampilkan form input nama kategori
3. Admin mengisi nama kategori
4. Admin mengklik "Simpan"
5. Sistem menyimpan kategori
6. Sistem menampilkan notifikasi sukses

---

#### UC-21: Edit Category
**Aktor:** Admin  
**Deskripsi:** Admin dapat mengubah nama kategori.  
**Precondition:** Kategori sudah ada.  
**Postcondition:** Kategori berhasil diupdate.

**Main Flow:**
1. Admin mengklik tombol "Edit" pada kategori
2. Sistem menampilkan form edit
3. Admin mengubah nama kategori
4. Admin mengklik "Update"
5. Sistem mengupdate data
6. Sistem menampilkan notifikasi sukses

---

#### UC-22: Delete Category
**Aktor:** Admin  
**Deskripsi:** Admin dapat menghapus kategori.  
**Precondition:** Kategori sudah ada dan tidak digunakan oleh produk.  
**Postcondition:** Kategori berhasil dihapus.

**Main Flow:**
1. Admin mengklik tombol "Delete" pada kategori
2. Sistem menampilkan konfirmasi
3. Admin mengkonfirmasi
4. Sistem menghapus kategori
5. Sistem menampilkan notifikasi sukses

**Alternative Flow:**
- 4a. Jika kategori masih digunakan oleh produk, sistem menampilkan error dan batalkan penghapusan

---

## 4. Business Rules

1. **BR-01:** Customer harus login untuk dapat melakukan checkout
2. **BR-02:** Quantity item tidak boleh melebihi stok yang tersedia
3. **BR-03:** Setiap order akan mengurangi stok produk otomatis
4. **BR-04:** Admin memiliki akses penuh ke semua fitur termasuk manage categories
5. **BR-05:** Seller hanya dapat manage products dan view orders, tidak bisa manage categories
6. **BR-06:** Password minimal 6 karakter
7. **BR-07:** Email harus unik dan valid
8. **BR-08:** Harga produk harus lebih dari 0
9. **BR-09:** Stok produk tidak boleh negatif
10. **BR-10:** Kategori tidak dapat dihapus jika masih digunakan oleh produk

---

## 5. Non-Functional Requirements

1. **Performance:** Sistem dapat menangani minimal 100 concurrent users
2. **Security:** Password di-hash menggunakan algoritma bcrypt
3. **Usability:** Interface responsif dan mobile-friendly
4. **Availability:** Sistem dapat diakses 24/7 melalui ngrok atau hosting
5. **Scalability:** Database MySQL dapat menampung minimal 10,000 produk dan 100,000 orders
6. **Integration:** Terintegrasi dengan Google Gemini AI untuk rekomendasi produk
7. **Browser Compatibility:** Mendukung Chrome, Firefox, Safari, Edge versi terbaru

---

## 6. Technology Stack

- **Frontend:** React + TypeScript + Vite + TailwindCSS
- **Backend:** PHP 8.2 + Apache
- **Database:** MySQL 8.0
- **AI Integration:** Google Gemini API
- **Containerization:** Docker + Docker Compose
- **Tunneling:** Ngrok (untuk public access)
- **Authentication:** Session-based dengan PHP

---

## 7. Database Schema Summary

### Tables:
1. **users** - Menyimpan data user (customer, admin, seller)
2. **cakes** - Menyimpan data produk kue
3. **categories** - Menyimpan data kategori produk
4. **orders** - Menyimpan data pesanan
5. **order_items** - Menyimpan detail item dalam pesanan
6. **cart** - Menyimpan data keranjang belanja

---

## 8. API Endpoints

### Authentication
- `POST /api/auth/register` - Register user baru
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user info

### Products (Cakes)
- `GET /api/cakes` - Get all products
- `GET /api/cakes/:id` - Get product by ID
- `POST /api/cakes` - Create new product (Admin/Seller)
- `PUT /api/cakes/:id` - Update product (Admin/Seller)
- `DELETE /api/cakes/:id` - Delete product (Admin/Seller)

### Categories
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create category (Admin only)
- `PUT /api/categories/:id` - Update category (Admin only)
- `DELETE /api/categories/:id` - Delete category (Admin only)

### Orders
- `GET /api/orders` - Get user orders (atau all orders untuk admin/seller)
- `POST /api/orders` - Create new order
- `GET /api/orders/:id` - Get order detail

### Cart (Frontend State Management)
- Cart dikelola di frontend menggunakan React state

---

## Diagram Created By: Sweet Bites Bakery Development Team
## Last Updated: February 1, 2026
