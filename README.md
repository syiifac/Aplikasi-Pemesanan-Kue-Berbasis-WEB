<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>
Link Website : https://sweetbitesbakery.vercel.app/
# 🍰 Sweet Bites Bakery Management System

Sistem manajemen toko kue modern yang menggabungkan teknologi web terkini dengan AI Google Gemini untuk pengalaman berbelanja yang cerdas dan intuitif.

## 🎯 Tentang Proyek

Sweet Bites Bakery Management System adalah platform e-commerce lengkap untuk toko kue yang dilengkapi dengan:

- **🤖 AI-Powered Recommendations** - Rekomendasi produk cerdas menggunakan Google Gemini AI
- **📦 Docker Containerization** - Deployment yang mudah dan konsisten di berbagai environment
- **🌐 Ngrok Integration** - Kemampuan berbagi aplikasi melalui internet dengan mudah
- **📊 Admin Dashboard** - Panel admin komprehensif untuk mengelola produk, pesanan, dan pengguna
- **💳 Payment Verification** - Sistem verifikasi pembayaran dengan upload bukti transfer
- **📱 Responsive Design** - Interface modern yang optimal di semua perangkat

## 🛠️ Teknologi yang Digunakan

### Frontend
- **React 19** dengan TypeScript
- **Vite** untuk build tool yang cepat
- **Tailwind CSS** untuk styling modern

### Backend
- **PHP 8** dengan Apache
- **MySQL 8.0** untuk database
- **RESTful API** architecture

### AI & Services
- **Google Gemini API** untuk rekomendasi produk cerdas
- **html2pdf.js** untuk generate laporan PDF

### DevOps
- **Docker** & **Docker Compose** untuk containerization
- **Ngrok** untuk tunneling dan sharing

## 🚀 Cara Menjalankan Proyek

### Metode 1: Dengan Docker (Recommended)

**Prerequisites:**
- Docker Desktop
- Docker Compose
- Google Gemini API Key

**Langkah-langkah:**

1. **Clone atau buka folder proyek**
   ```bash
   cd C:\xampp\htdocs\sweet-bites-bakery-management-system
   ```

2. **Buat file `.env` dan isi dengan API key Gemini Anda**
   ```bash
   VITE_GEMINI_API_KEY=your_gemini_api_key_here
   VITE_API_BASE_URL=/backend/api
   ```

3. **Jalankan Docker Compose**
   ```bash
   docker-compose up --build
   ```
   
   Tunggu hingga semua container selesai di-build dan berjalan.

4. **Akses aplikasi melalui browser**
   - Frontend: `http://localhost:3000`
   - Backend API: `http://localhost:8080/backend/api`
   - Database: MySQL di port default (diakses oleh container)

5. **Login dengan akun default:**
   - **Admin**: admin@sweetbites.com / admin123
   - **Seller**: seller@sweetbites.com / seller123
   - **Customer**: customer@sweetbites.com / customer123

### Metode 2: Development Mode (Tanpa Docker)

**Prerequisites:**
- Node.js (v18 atau lebih baru)
- XAMPP atau PHP 8 + MySQL
- Google Gemini API Key

**Langkah-langkah:**

1. **Setup Database**
   ```bash
   # Buat database 'sweet_bites_bakery' di MySQL
   # Import database/sweetbites.sql
   ```

2. **Konfigurasi Backend**
   ```bash
   # Edit backend/config/config.php sesuai setup MySQL Anda
   ```

3. **Install Dependencies Frontend**
   ```bash
   npm install
   ```

4. **Buat file `.env.local` dengan API key**
   ```bash
   VITE_GEMINI_API_KEY=your_gemini_api_key_here
   VITE_API_BASE_URL=http://localhost/backend/api
   ```

5. **Jalankan Frontend**
   ```bash
   npm run dev
   ```

6. **Akses aplikasi di** `http://localhost:5173`

## 🌐 Berbagi Akses Melalui Internet dengan Ngrok

Jika ingin membagikan aplikasi kepada orang lain melalui internet:

1. **Install Ngrok**
   ```bash
   # Windows dengan Chocolatey
   choco install ngrok
   
   # Atau download dari https://ngrok.com/download
   ```

2. **Jalankan aplikasi dengan Docker**
   ```bash
   docker-compose up
   ```

3. **Buka terminal baru dan jalankan Ngrok untuk Frontend**
   ```bash
   ngrok http 3000
   ```
   
   Catat URL yang muncul (contoh: `https://abc123.ngrok.io`)

4. **Bagikan URL Ngrok kepada siapa saja**
   
   Mereka dapat mengakses aplikasi Anda dari mana saja!

**Catatan:**
- URL Ngrok gratis berubah setiap restart
- Untuk URL permanen, upgrade ke Ngrok paid plan
- Lihat [NGROK_SETUP.md](NGROK_SETUP.md) untuk konfigurasi lebih detail

## 📂 Struktur Proyek

```
sweet-bites-bakery-management-system/
├── backend/                 # PHP Backend API
│   ├── config/             # Konfigurasi database
│   ├── controllers/        # Business logic
│   ├── models/             # Data models
│   ├── routes/             # API routes
│   └── uploads/            # File uploads
├── views/                  # React components untuk pages
├── components/             # Reusable React components
├── services/               # API services & Gemini integration
├── database/               # SQL schema & seeding
├── public/                 # Static assets
├── docker-compose.yml      # Docker orchestration
├── Dockerfile.frontend     # Frontend container config
└── backend/Dockerfile      # Backend container config
```

## ✨ Fitur Utama

### Untuk Customer
- 🛍️ Browse katalog kue dengan filter kategori
- 🤖 Rekomendasi produk AI berdasarkan preferensi
- 🛒 Keranjang belanja dengan kalkulasi otomatis
- 💳 Checkout dengan upload bukti pembayaran
- 📦 Tracking status pesanan

### Untuk Seller
- ➕ Tambah/Edit/Hapus produk
- 📦 Kelola stok dan kategori
- 🖼️ Upload gambar produk
- 📊 Dashboard penjualan

### Untuk Admin
- ✅ Verifikasi pembayaran customer
- 👥 Kelola pengguna (CRUD operations)
- 📈 Laporan transaksi lengkap
- 📄 Export laporan PDF (Pesanan, Penjualan, Inventaris)

## 📖 Dokumentasi Tambahan

- [AUTHENTICATION_GUIDE.md](AUTHENTICATION_GUIDE.md) - Panduan sistem autentikasi
- [PDF_REPORTS_DOCUMENTATION.md](PDF_REPORTS_DOCUMENTATION.md) - Dokumentasi generate laporan PDF
- [NGROK_SETUP.md](NGROK_SETUP.md) - Setup detail untuk ngrok
- [USECASE.md](USECASE.md) - Use case diagram sistem
- [DIAGRAMS.md](DIAGRAMS.md) - Diagram arsitektur

## 🎓 Kesimpulan

Melalui proyek **Sweet Bites Bakery Management System**, saya berhasil menciptakan sistem yang menggabungkan metode bisnis tradisional toko kue dengan teknologi modern. 

**Integrasi teknologi kunci:**
- **🐳 Docker** memastikan aplikasi dapat berjalan konsisten di berbagai environment dan memudahkan deployment
- **🌐 Ngrok** memberikan kemampuan untuk berbagi aplikasi secara instan melalui internet tanpa konfigurasi server kompleks
- **🤖 Google Gemini AI** menghadirkan pengalaman berbelanja yang cerdas dengan rekomendasi produk yang personal

Aplikasi Sweet Bites tidak hanya **fungsional** untuk operasional toko kue, tetapi juga **cerdas** dalam memberikan rekomendasi, dan **mudah disebarluaskan** ke berbagai platform berkat containerization.

## 🤝 Kontribusi

Contributions, issues, dan feature requests sangat diterima!

## 📝 Lisensi

Proyek ini dibuat untuk tujuan pembelajaran dan portfolio.

---

<div align="center">
Made with ❤️ and ☕ | Powered by React, PHP, MySQL, Docker & Google Gemini AI
</div>
