# Software Design Diagrams - Sweet Bites Bakery Management System

## Table of Contents
1. [Sequence Diagrams](#sequence-diagrams)
2. [Activity Diagrams](#activity-diagrams)
3. [Class Diagrams](#class-diagrams)

---

# 1. Sequence Diagrams

Sequence diagram menggambarkan interaksi antar objek dalam urutan waktu tertentu untuk menyelesaikan suatu use case.

---

## 1.1 Sequence Diagram: Customer Login

**Deskripsi:** Diagram ini menunjukkan alur interaksi ketika customer melakukan login ke sistem, mulai dari memasukkan kredensial hingga mendapatkan session.

```
Customer        LoginView       AuthController      Database        Session
   |                |                  |                |              |
   |--submit form-->|                  |                |              |
   |                |                  |                |              |
   |                |--POST /login---->|                |              |
   |                |  (email,pwd)     |                |              |
   |                |                  |                |              |
   |                |                  |--validate--    |              |
   |                |                  |  credentials   |              |
   |                |                  |                |              |
   |                |                  |--query user--->|              |
   |                |                  |                |              |
   |                |                  |<--user data----|              |
   |                |                  |                |              |
   |                |                  |--verify hash-->|              |
   |                |                  |                |              |
   |                |                  |--create--------|------------->|
   |                |                  |    session     |              |
   |                |                  |                |              |
   |                |<--success + -----|                |              |
   |                |   user data      |                |              |
   |                |                  |                |              |
   |<--redirect-----|                  |                |              |
   |   to home      |                  |                |              |
   |                |                  |                |              |
```

**Key Points:**
- Customer memasukkan email dan password
- Sistem memvalidasi kredensial dengan database
- Password di-verify menggunakan hash comparison
- Session dibuat setelah login berhasil
- Customer di-redirect ke halaman sesuai role

---

## 1.2 Sequence Diagram: Add to Cart & Checkout

**Deskripsi:** Diagram ini menggambarkan proses lengkap dari customer menambahkan produk ke keranjang hingga melakukan checkout dan pembuatan order.

```
Customer    CatalogView    CartService    ProductAPI    OrderAPI    Database
   |             |              |             |            |            |
   |--click Add->|              |             |            |            |
   | to Cart     |              |             |            |            |
   |             |              |             |            |            |
   |             |--validate--->|             |            |            |
   |             |   stock      |             |            |            |
   |             |              |             |            |            |
   |             |<--stock OK---|             |            |            |
   |             |              |             |            |            |
   |             |--add item--->|             |            |            |
   |             |   to cart    |             |            |            |
   |             |              |             |            |            |
   |<--success---|              |             |            |            |
   |  notification              |             |            |            |
   |                            |             |            |            |
   |--view cart------------------>            |            |            |
   |                            |             |            |            |
   |<--cart items---------------|             |            |            |
   |                            |             |            |            |
   |--click checkout----------->|             |            |            |
   |                            |             |            |            |
   |--fill shipping info------->|             |            |            |
   |                            |             |            |            |
   |--confirm order------------>|             |            |            |
   |                            |             |            |            |
   |                            |--validate-->|            |            |
   |                            |   stock     |            |            |
   |                            |             |            |            |
   |                            |             |--check---->|            |
   |                            |             |   stock    |            |
   |                            |             |            |            |
   |                            |             |<--stock----|            |
   |                            |             |   available            |
   |                            |             |            |            |
   |                            |--POST-------|----------->|            |
   |                            |   /orders   |            |            |
   |                            |             |            |            |
   |                            |             |            |--create--->|
   |                            |             |            |   order    |
   |                            |             |            |            |
   |                            |             |            |--create--->|
   |                            |             |            | order_items|
   |                            |             |            |            |
   |                            |             |            |--update--->|
   |                            |             |            |   stock    |
   |                            |             |            |            |
   |                            |             |            |<--success--|
   |                            |             |            |            |
   |                            |<--order-----|------------|            |
   |                            |   created   |            |            |
   |                            |             |            |            |
   |                            |--clear cart------------->|            |
   |                            |             |            |            |
   |<--success + order number---|             |            |            |
   |                            |             |            |            |
```

**Key Points:**
- Validasi stok dilakukan sebelum menambah ke cart
- Cart dikelola di frontend (localStorage/state)
- Saat checkout, stock divalidasi ulang
- Order dibuat dengan status 'pending'
- Stok produk dikurangi otomatis
- Cart dikosongkan setelah checkout berhasil

---

## 1.3 Sequence Diagram: Admin Manage Product

**Deskripsi:** Diagram ini menunjukkan bagaimana admin atau seller melakukan operasi CRUD pada produk (Add, Edit, Delete).

```
Admin       AdminDashboard   ProductAPI    Database    FileSystem
  |               |              |             |            |
  |--click Add--->|              |             |            |
  | Product       |              |             |            |
  |               |              |             |            |
  |<--show form---|              |             |            |
  |               |              |             |            |
  |--fill form--->|              |             |            |
  |  + upload     |              |             |            |
  |    image      |              |             |            |
  |               |              |             |            |
  |--submit------>|              |             |            |
  |               |              |             |            |
  |               |--validate--->|             |            |
  |               |   input      |             |            |
  |               |              |             |            |
  |               |--upload------|-------------|----------->|
  |               |   image      |             |            |
  |               |              |             |            |
  |               |<--image------|-------------|------------|
  |               |   path       |             |            |
  |               |              |             |            |
  |               |--POST------->|             |            |
  |               |  /cakes      |             |            |
  |               |              |             |            |
  |               |              |--INSERT---->|            |
  |               |              |   product   |            |
  |               |              |             |            |
  |               |              |<--success---|            |
  |               |              |             |            |
  |               |<--product----|             |            |
  |               |   created    |             |            |
  |               |              |             |            |
  |<--success-----|              |             |            |
  |  + refresh    |              |             |            |
  |    list       |              |             |            |
  |               |              |             |            |
  |--click Edit-->|              |             |            |
  |               |              |             |            |
  |               |--GET-------->|             |            |
  |               |  /cakes/:id  |             |            |
  |               |              |             |            |
  |               |              |--SELECT---->|            |
  |               |              |             |            |
  |               |              |<--data------|            |
  |               |              |             |            |
  |               |<--product----|             |            |
  |               |   data       |             |            |
  |               |              |             |            |
  |<--show form---|              |             |            |
  | with data     |              |             |            |
  |               |              |             |            |
  |--update------>|              |             |            |
  |               |              |             |            |
  |               |--PUT-------->|             |            |
  |               |  /cakes/:id  |             |            |
  |               |              |             |            |
  |               |              |--UPDATE---->|            |
  |               |              |             |            |
  |               |              |<--success---|            |
  |               |              |             |            |
  |               |<--updated----|             |            |
  |               |              |             |            |
  |<--success-----|              |             |            |
  |               |              |             |            |
  |--click Delete>|              |             |            |
  |               |              |             |            |
  |<--confirm-----|              |             |            |
  |  dialog       |              |             |            |
  |               |              |             |            |
  |--yes--------->|              |             |            |
  |               |              |             |            |
  |               |--DELETE----->|             |            |
  |               |  /cakes/:id  |             |            |
  |               |              |             |            |
  |               |              |--DELETE---->|            |
  |               |              |             |            |
  |               |              |<--success---|            |
  |               |              |             |            |
  |               |<--deleted----|             |            |
  |               |              |             |            |
  |<--success-----|              |             |            |
  |  + refresh    |              |             |            |
  |               |              |             |            |
```

**Key Points:**
- Admin dapat menambah produk dengan upload gambar
- Gambar disimpan di filesystem (public/images/cakes/)
- Edit produk akan pre-fill form dengan data existing
- Delete produk memerlukan konfirmasi
- Setiap operasi akan refresh list produk

---

## 1.4 Sequence Diagram: AI Recommendation

**Deskripsi:** Diagram ini menggambarkan proses customer meminta rekomendasi produk dari AI chatbot menggunakan Google Gemini API.

```
Customer     HomeView    GeminiService   GeminiAPI   ProductService
   |            |             |              |              |
   |--type----->|             |              |              |
   | question   |             |              |              |
   |            |             |              |              |
   |--click---->|             |              |              |
   | send       |             |              |              |
   |            |             |              |              |
   |            |--get------->|              |              |
   |            | recommendations            |              |
   |            |             |              |              |
   |            |             |--check API-->|              |
   |            |             |   key        |              |
   |            |             |              |              |
   |            |             |--POST------->|              |
   |            |             | /generate    |              |
   |            |             | (prompt)     |              |
   |            |             |              |              |
   |            |             |<--AI---------|              |
   |            |             |  response    |              |
   |            |             |              |              |
   |            |             |--parse------>|              |
   |            |             | response     |              |
   |            |             |              |              |
   |            |             |--get---------|------------->|
   |            |             | products     |              |
   |            |             | by category  |              |
   |            |             |              |              |
   |            |             |<--products---|--------------|
   |            |             |              |              |
   |            |<--formatted-|              |              |
   |            | recommendations            |              |
   |            |             |              |              |
   |<--display--|             |              |              |
   | products   |             |              |              |
   |            |             |              |              |
   
   [Alternative Flow: API Error]
   |            |             |              |              |
   |            |             |--POST------->|              |
   |            |             |   [ERROR]    |              |
   |            |             |              |              |
   |            |             |<--error------|              |
   |            |             |              |              |
   |            |             |--use local-->|              |
   |            |             | recommendations              |
   |            |             |              |              |
   |            |<--fallback--|              |              |
   |            | recommendations            |              |
   |            |             |              |              |
```

**Key Points:**
- Customer mengetik pertanyaan di chat box
- System mengirim query ke Google Gemini API
- AI memberikan rekomendasi berdasarkan context produk
- Jika API error/invalid key, gunakan fallback local recommendations
- Hasil ditampilkan sebagai list produk yang bisa diklik

---

# 2. Activity Diagrams

Activity diagram menggambarkan alur kerja (workflow) atau proses bisnis dalam sistem, menunjukkan aktivitas yang dilakukan secara berurutan.

---

## 2.1 Activity Diagram: Customer Registration Process

**Deskripsi:** Diagram ini menunjukkan alur lengkap proses registrasi customer baru, termasuk validasi dan penanganan error.

```
                    ┌─────────────┐
                    │   START     │
                    └──────┬──────┘
                           │
                           ▼
                    ┌─────────────┐
                    │ Customer    │
                    │ clicks      │
                    │ "Register"  │
                    └──────┬──────┘
                           │
                           ▼
                    ┌─────────────┐
                    │ Display     │
                    │ Register    │
                    │ Form        │
                    └──────┬──────┘
                           │
                           ▼
                    ┌─────────────┐
                    │ Customer    │
                    │ fills:      │
                    │ - Name      │
                    │ - Email     │
                    │ - Password  │
                    └──────┬──────┘
                           │
                           ▼
                    ┌─────────────┐
                    │ Click       │
                    │ "Daftar"    │
                    │ button      │
                    └──────┬──────┘
                           │
                           ▼
                    ╔═════════════╗
                    ║ Validate    ║
                    ║ Email       ║
                    ║ format?     ║
                    ╚═════╤═══════╝
                          │
              ┌───────────┴───────────┐
              │ No                    │ Yes
              ▼                       ▼
       ┌─────────────┐         ╔═════════════╗
       │ Show error: │         ║ Check email ║
       │ "Invalid    │         ║ already     ║
       │ email"      │         ║ exists?     ║
       └──────┬──────┘         ╚═════╤═══════╝
              │                      │
              │         ┌────────────┴────────────┐
              │         │ Yes                     │ No
              │         ▼                         ▼
              │  ┌─────────────┐          ╔═════════════╗
              │  │ Show error: │          ║ Validate    ║
              │  │ "Email      │          ║ Password    ║
              │  │ taken"      │          ║ length ≥ 6? ║
              │  └──────┬──────┘          ╚═════╤═══════╝
              │         │                       │
              │         │          ┌────────────┴────────────┐
              │         │          │ No                      │ Yes
              │         │          ▼                         ▼
              │         │   ┌─────────────┐          ┌─────────────┐
              │         │   │ Show error: │          │ Hash        │
              │         │   │ "Password   │          │ password    │
              │         │   │ too short"  │          └──────┬──────┘
              │         │   └──────┬──────┘                 │
              │         │          │                        ▼
              └─────────┴──────────┘              ┌─────────────┐
                        │                         │ Create user │
                        │                         │ in database │
                        │                         │ role:       │
                        │                         │ "customer"  │
                        │                         └──────┬──────┘
                        │                                │
                        │                                ▼
                        │                         ┌─────────────┐
                        │                         │ Show        │
                        │                         │ success     │
                        │                         │ message     │
                        │                         └──────┬──────┘
                        │                                │
                        │                                ▼
                        │                         ┌─────────────┐
                        │                         │ Redirect to │
                        │                         │ Login page  │
                        │                         └──────┬──────┘
                        │                                │
                        └────────────────────────────────┘
                                                         │
                                                         ▼
                                                  ┌─────────────┐
                                                  │     END     │
                                                  └─────────────┘
```

**Key Points:**
- Validasi email format dilakukan di frontend
- Check email duplicate dilakukan di backend
- Password minimal 6 karakter
- Password di-hash sebelum disimpan
- Default role adalah "customer"
- Success akan redirect ke login page

---

## 2.2 Activity Diagram: Shopping Cart to Checkout Flow

**Deskripsi:** Diagram ini menggambarkan alur lengkap dari customer browsing produk, menambahkan ke cart, hingga checkout berhasil.

```
                    ┌─────────────┐
                    │   START     │
                    └──────┬──────┘
                           │
                           ▼
                    ┌─────────────┐
                    │ Browse      │
                    │ Catalog     │
                    └──────┬──────┘
                           │
                           ▼
                    ┌─────────────┐
                    │ Select      │
                    │ Product     │
                    └──────┬──────┘
                           │
                           ▼
                    ┌─────────────┐
                    │ Choose      │
                    │ Quantity    │
                    └──────┬──────┘
                           │
                           ▼
                    ┌─────────────┐
                    │ Click       │
                    │ "Add to     │
                    │ Cart"       │
                    └──────┬──────┘
                           │
                           ▼
                    ╔═════════════╗
                    ║ Check       ║
                    ║ quantity ≤  ║
                    ║ stock?      ║
                    ╚═════╤═══════╝
                          │
              ┌───────────┴───────────┐
              │ No                    │ Yes
              ▼                       ▼
       ┌─────────────┐         ┌─────────────┐
       │ Show error: │         │ Add item to │
       │ "Stock not  │         │ cart        │
       │ available"  │         │ (localStorage)
       └──────┬──────┘         └──────┬──────┘
              │                       │
              │                       ▼
              │                ┌─────────────┐
              │                │ Show        │
              │                │ success     │
              │                │ notification│
              │                └──────┬──────┘
              │                       │
              │                       ▼
              │                ┌─────────────┐
              │                │ Update cart │
              │                │ badge count │
              │                └──────┬──────┘
              │                       │
              └───────────────────────┤
                                      │
                                      ▼
                               ╔═════════════╗
                               ║ Continue    ║
                               ║ shopping?   ║
                               ╚═════╤═══════╝
                                     │
                         ┌───────────┴───────────┐
                         │ Yes                   │ No
                         ▼                       ▼
                  ┌─────────────┐         ┌─────────────┐
                  │ Browse more │         │ Click cart  │
                  │ products    │         │ icon        │
                  └──────┬──────┘         └──────┬──────┘
                         │                       │
                         │                       ▼
                         │                ┌─────────────┐
                         │                │ View cart   │
                         │                │ page        │
                         │                └──────┬──────┘
                         │                       │
                         │                       ▼
                         │                ╔═════════════╗
                         │                ║ Modify cart?║
                         │                ╚═════╤═══════╝
                         │                      │
                         │          ┌───────────┴───────────┐
                         │          │ Yes                   │ No
                         │          ▼                       ▼
                         │   ┌─────────────┐         ┌─────────────┐
                         │   │ Update      │         │ Click       │
                         │   │ quantity or │         │ "Checkout"  │
                         │   │ remove item │         └──────┬──────┘
                         │   └──────┬──────┘                │
                         │          │                       ▼
                         └──────────┘                ╔═════════════╗
                                                     ║ User        ║
                                                     ║ logged in?  ║
                                                     ╚═════╤═══════╝
                                                           │
                                               ┌───────────┴───────────┐
                                               │ No                    │ Yes
                                               ▼                       ▼
                                        ┌─────────────┐         ┌─────────────┐
                                        │ Redirect to │         │ Show        │
                                        │ login page  │         │ checkout    │
                                        └──────┬──────┘         │ form        │
                                               │                └──────┬──────┘
                                               │                       │
                                               │                       ▼
                                               │                ┌─────────────┐
                                               │                │ Fill:       │
                                               │                │ - Name      │
                                               │                │ - Address   │
                                               │                │ - Phone     │
                                               │                │ - Notes     │
                                               │                └──────┬──────┘
                                               │                       │
                                               │                       ▼
                                               │                ┌─────────────┐
                                               │                │ Review order│
                                               │                │ summary     │
                                               │                └──────┬──────┘
                                               │                       │
                                               │                       ▼
                                               │                ┌─────────────┐
                                               │                │ Click       │
                                               │                │ "Buat       │
                                               │                │ Pesanan"    │
                                               │                └──────┬──────┘
                                               │                       │
                                               │                       ▼
                                               │                ╔═════════════╗
                                               │                ║ Validate all║
                                               │                ║ fields      ║
                                               │                ║ filled?     ║
                                               │                ╚═════╤═══════╝
                                               │                      │
                                               │          ┌───────────┴───────────┐
                                               │          │ No                    │ Yes
                                               │          ▼                       ▼
                                               │   ┌─────────────┐         ╔═════════════╗
                                               │   │ Show error  │         ║ Re-check    ║
                                               │   │ message     │         ║ stock       ║
                                               │   └─────────────┘         ║ available?  ║
                                               │          │                ╚═════╤═══════╝
                                               │          │                      │
                                               │          │          ┌───────────┴───────────┐
                                               │          │          │ No                    │ Yes
                                               │          │          ▼                       ▼
                                               │          │   ┌─────────────┐         ┌─────────────┐
                                               │          │   │ Show error: │         │ Create order│
                                               │          │   │ "Stock not  │         │ in database │
                                               │          │   │ sufficient" │         └──────┬──────┘
                                               │          │   └─────────────┘                │
                                               │          │          │                       ▼
                                               │          │          │                ┌─────────────┐
                                               │          │          │                │ Save order  │
                                               │          │          │                │ items       │
                                               │          │          │                └──────┬──────┘
                                               │          │          │                       │
                                               │          │          │                       ▼
                                               │          │          │                ┌─────────────┐
                                               │          │          │                │ Reduce      │
                                               │          │          │                │ product     │
                                               │          │          │                │ stock       │
                                               │          │          │                └──────┬──────┘
                                               │          │          │                       │
                                               │          │          │                       ▼
                                               │          │          │                ┌─────────────┐
                                               │          │          │                │ Clear cart  │
                                               │          │          │                └──────┬──────┘
                                               │          │          │                       │
                                               │          │          │                       ▼
                                               │          │          │                ┌─────────────┐
                                               │          │          │                │ Show success│
                                               │          │          │                │ + order ID  │
                                               │          │          │                └──────┬──────┘
                                               │          │          │                       │
                                               │          │          │                       ▼
                                               └──────────┴──────────┴────────────────┌─────────────┐
                                                                                      │ Redirect to │
                                                                                      │ Order       │
                                                                                      │ History     │
                                                                                      └──────┬──────┘
                                                                                             │
                                                                                             ▼
                                                                                      ┌─────────────┐
                                                                                      │     END     │
                                                                                      └─────────────┘
```

**Key Points:**
- Stock validation dilakukan 2 kali: saat add to cart dan saat checkout
- User harus login untuk checkout
- Cart disimpan di localStorage (persisten)
- Order hanya dibuat jika semua validasi lolos
- Stock dikurangi otomatis saat order berhasil
- Cart dikosongkan setelah checkout

---

## 2.3 Activity Diagram: Admin Product Management

**Deskripsi:** Diagram ini menunjukkan alur kerja admin dalam mengelola produk, mulai dari melihat list produk hingga melakukan operasi CRUD.

```
                    ┌─────────────┐
                    │   START     │
                    └──────┬──────┘
                           │
                           ▼
                    ┌─────────────┐
                    │ Admin login │
                    └──────┬──────┘
                           │
                           ▼
                    ┌─────────────┐
                    │ Navigate to │
                    │ Dashboard   │
                    └──────┬──────┘
                           │
                           ▼
                    ┌─────────────┐
                    │ Load        │
                    │ products    │
                    │ list        │
                    └──────┬──────┘
                           │
                           ▼
                    ┌─────────────┐
                    │ Display     │
                    │ products    │
                    │ table       │
                    └──────┬──────┘
                           │
                           ▼
                    ╔═════════════╗
                    ║ Select      ║
                    ║ action?     ║
                    ╚═════╤═══════╝
                          │
       ┌──────────────────┼──────────────────┬────────────────┐
       │                  │                  │                │
       ▼                  ▼                  ▼                ▼
┌─────────────┐    ┌─────────────┐   ┌─────────────┐  ┌─────────────┐
│ Add Product │    │ Edit Product│   │ Delete      │  │ View Details│
└──────┬──────┘    └──────┬──────┘   │ Product     │  └──────┬──────┘
       │                  │           └──────┬──────┘         │
       ▼                  ▼                  │                │
┌─────────────┐    ┌─────────────┐          │                │
│ Show empty  │    │ Load product│          │                │
│ form        │    │ data        │          │                │
└──────┬──────┘    └──────┬──────┘          │                │
       │                  │                  │                │
       ▼                  ▼                  │                │
┌─────────────┐    ┌─────────────┐          │                │
│ Fill form:  │    │ Show form   │          │                │
│ - Name      │    │ with data   │          │                │
│ - Category  │    └──────┬──────┘          │                │
│ - Price     │           │                 │                │
│ - Stock     │           ▼                 │                │
│ - Desc      │    ┌─────────────┐          │                │
│ - Image     │    │ Modify data │          │                │
└──────┬──────┘    └──────┬──────┘          │                │
       │                  │                  │                │
       ▼                  ▼                  ▼                │
┌─────────────┐    ┌─────────────┐   ┌─────────────┐         │
│ Click       │    │ Click       │   │ Show confirm│         │
│ "Simpan"    │    │ "Update"    │   │ dialog      │         │
└──────┬──────┘    └──────┬──────┘   └──────┬──────┘         │
       │                  │                  │                │
       ▼                  ▼                  ▼                │
╔═════════════╗    ╔═════════════╗   ╔═════════════╗         │
║ Validate    ║    ║ Validate    ║   ║ User        ║         │
║ all fields? ║    ║ changes?    ║   ║ confirms?   ║         │
╚═════╤═══════╝    ╚═════╤═══════╝   ╚═════╤═══════╝         │
      │                  │                  │                │
 ┌────┴────┐        ┌────┴────┐        ┌────┴────┐           │
 │No       │Yes     │No       │Yes     │No       │Yes        │
 ▼         ▼        ▼         ▼        ▼         ▼           │
┌────┐ ┌─────────┐ ┌────┐ ┌─────────┐ ┌────┐ ┌─────────┐    │
│Show│ │Upload   │ │Show│ │Upload   │ │Back│ │Delete   │    │
│err │ │image    │ │err │ │image if │ │to  │ │from     │    │
│msg │ │to server│ │msg │ │changed  │ │list│ │database │    │
└─┬──┘ └────┬────┘ └─┬──┘ └────┬────┘ └─┬──┘ └────┬────┘    │
  │         │         │         │         │         │        │
  │         ▼         │         ▼         │         ▼        │
  │  ┌─────────────┐  │  ┌─────────────┐  │  ┌─────────────┐ │
  │  │ Save new    │  │  │ Update      │  │  │ Show success│ │
  │  │ product to  │  │  │ product in  │  │  │ message     │ │
  │  │ database    │  │  │ database    │  │  └──────┬──────┘ │
  │  └──────┬──────┘  │  └──────┬──────┘  │         │        │
  │         │         │         │         │         │        │
  │         ▼         │         ▼         │         │        │
  │  ┌─────────────┐  │  ┌─────────────┐  │         │        │
  │  │ Show success│  │  │ Show success│  │         │        │
  │  │ message     │  │  │ message     │  │         │        │
  │  └──────┬──────┘  │  └──────┬──────┘  │         │        │
  │         │         │         │         │         │        │
  └─────────┴─────────┴─────────┴─────────┴─────────┴────────┤
                                                               │
                                    ╔═════════════╗            │
                                    ║ Continue    ║            │
                                    ║ managing?   ║            │
                                    ╚═════╤═══════╝            │
                                          │                    │
                              ┌───────────┴───────────┐        │
                              │ Yes                   │ No     │
                              ▼                       ▼        │
                       ┌─────────────┐         ┌─────────────┐│
                       │ Reload      │         │   LOGOUT    ││
                       │ products    │         └──────┬──────┘│
                       │ list        │                │       │
                       └──────┬──────┘                │       │
                              │                       │       │
                              └───────────────────────┴───────┘
                                                      │
                                                      ▼
                                               ┌─────────────┐
                                               │     END     │
                                               └─────────────┘
```

**Key Points:**
- Admin melihat tabel produk saat masuk dashboard
- Add: form kosong → upload image → save
- Edit: load data → modify → update
- Delete: konfirmasi → hapus dari database
- View: menampilkan detail lengkap produk
- Setiap operasi akan reload list produk

---

# 3. Class Diagrams

Class diagram menggambarkan struktur statis sistem dengan menunjukkan class, atribut, method, dan relationship antar class.

---

## 3.1 Class Diagram: Complete System

**Deskripsi:** Diagram ini menampilkan semua class dalam sistem Sweet Bites Bakery beserta relationship-nya (association, aggregation, inheritance, dependency).

```
┌────────────────────────────────────────────────────────────────────────┐
│                      Sweet Bites Bakery Class Diagram                  │
└────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────┐
│       <<interface>>      │
│         User             │
├─────────────────────────┤
│ - id: string            │
│ - name: string          │
│ - email: string         │
│ - password: string      │
│ - role: string          │
│ - createdAt: Date       │
├─────────────────────────┤
│ + login(): boolean      │
│ + logout(): void        │
│ + updateProfile(): void │
└──────────┬──────────────┘
           │
           │ <<extends>>
           │
    ┌──────┴───────┬────────────────┐
    │              │                │
    ▼              ▼                ▼
┌──────────┐  ┌──────────┐  ┌──────────────┐
│ Customer │  │  Seller  │  │    Admin     │
├──────────┤  ├──────────┤  ├──────────────┤
│ - cart[] │  │          │  │              │
│ - orders │  │          │  │              │
├──────────┤  ├──────────┤  ├──────────────┤
│+ viewCart│  │+ manage  │  │+ manage      │
│+ checkout│  │  Products│  │  Products    │
│+ viewOrde│  │+ viewAll │  │+ manage      │
│  rHistory│  │  Orders  │  │  Categories  │
└─────┬────┘  └─────┬────┘  │+ viewAll     │
      │             │       │  Orders      │
      │             │       │+ manage      │
      │             │       │  Users       │
      │             │       └──────────────┘
      │             │
      │             │
      │             │
      ▼             ▼
┌──────────────────────────┐
│         Product          │◄───────────────┐
│         (Cake)           │                │
├──────────────────────────┤                │
│ - id: string             │                │
│ - name: string           │                │
│ - description: string    │                │
│ - price: number          │                │
│ - stock: number          │                │
│ - category: string       │                │
│ - image: string          │                │
│ - createdAt: Date        │                │
├──────────────────────────┤                │
│ + getDetails(): Product  │                │ 1..*
│ + updateStock(qty): void │                │
│ + isAvailable(): boolean │                │
└──────┬───────────────────┘                │
       │                                    │
       │ 1..*                               │
       │                                    │
       ▼                                    │
┌──────────────────┐      1..*      ┌──────┴──────────┐
│    CartItem      │◄───────────────┤      Cart       │
├──────────────────┤                ├─────────────────┤
│ - productId:     │                │ - userId: string│
│   string         │                │ - items: []     │
│ - quantity: int  │                │ - total: number │
│ - price: number  │                ├─────────────────┤
├──────────────────┤                │+ addItem(): void│
│+ getSubtotal():  │                │+ removeItem():  │
│  number          │                │  void           │
│+ updateQuantity()│                │+ updateQty():   │
│  : void          │                │  void           │
└──────────────────┘                │+ clear(): void  │
                                    │+ getTotal():    │
       │                            │  number         │
       │                            └─────────────────┘
       │ 1..*
       ▼
┌──────────────────┐      1..*      ┌─────────────────┐
│   OrderItem      │◄───────────────┤      Order      │
├──────────────────┤                ├─────────────────┤
│ - orderId: string│                │ - id: string    │
│ - productId:     │                │ - userId: string│
│   string         │                │ - customerName: │
│ - productName:   │                │   string        │
│   string         │                │ - address:      │
│ - quantity: int  │                │   string        │
│ - price: number  │                │ - phone: string │
├──────────────────┤                │ - notes: string │
│+ getSubtotal():  │                │ - status: string│
│  number          │                │ - totalAmount:  │
└──────────────────┘                │   number        │
                                    │ - createdAt:Date│
       ▲                            ├─────────────────┤
       │                            │+ create(): Order│
       │                            │+ updateStatus():│
       │                            │  void           │
       │                            │+ getDetails():  │
       │                            │  Order          │
       │                            └─────────────────┘
       │
       │
┌──────────────────────────┐
│       Category           │
├──────────────────────────┤
│ - id: string             │
│ - name: string           │
│ - description: string    │
├──────────────────────────┤
│ + getProducts(): Product│
│ + create(): void         │
│ + update(): void         │
│ + delete(): void         │
└──────────────────────────┘
       │
       │ has many
       │
       ▼
   (Products)
   

┌─────────────────────────────────────────────────────────┐
│              SERVICE LAYER (Business Logic)              │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌──────────────────┐      ┌──────────────────┐        │
│  │   AuthService    │      │  ProductService  │        │
│  ├──────────────────┤      ├──────────────────┤        │
│  │+ register()      │      │+ getAll()        │        │
│  │+ login()         │      │+ getById()       │        │
│  │+ logout()        │      │+ create()        │        │
│  │+ validateToken() │      │+ update()        │        │
│  └──────────────────┘      │+ delete()        │        │
│                            │+ search()        │        │
│  ┌──────────────────┐      └──────────────────┘        │
│  │   OrderService   │                                  │
│  ├──────────────────┤      ┌──────────────────┐        │
│  │+ createOrder()   │      │ CategoryService  │        │
│  │+ getOrders()     │      ├──────────────────┤        │
│  │+ getOrderById()  │      │+ getAll()        │        │
│  │+ updateStatus()  │      │+ create()        │        │
│  └──────────────────┘      │+ update()        │        │
│                            │+ delete()        │        │
│  ┌──────────────────┐      └──────────────────┘        │
│  │  GeminiService   │                                  │
│  ├──────────────────┤      ┌──────────────────┐        │
│  │+ getRecommen-    │      │   CartService    │        │
│  │  dations()       │      ├──────────────────┤        │
│  │+ generateText()  │      │+ add()           │        │
│  │+ parseResponse() │      │+ remove()        │        │
│  └──────────────────┘      │+ update()        │        │
│                            │+ clear()         │        │
│                            │+ getTotal()      │        │
│                            └──────────────────┘        │
│                                                          │
└─────────────────────────────────────────────────────────┘


┌─────────────────────────────────────────────────────────┐
│              CONTROLLER LAYER (API Endpoints)            │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌──────────────────┐      ┌──────────────────┐        │
│  │ AuthController   │      │ProductController │        │
│  ├──────────────────┤      ├──────────────────┤        │
│  │+ register(req,   │      │+ index(req,res)  │        │
│  │  res)            │      │+ show(req,res)   │        │
│  │+ login(req,res)  │      │+ store(req,res)  │        │
│  │+ logout(req,res) │      │+ update(req,res) │        │
│  │+ me(req,res)     │      │+ destroy(req,res)│        │
│  └──────────────────┘      └──────────────────┘        │
│                                                          │
│  ┌──────────────────┐      ┌──────────────────┐        │
│  │ OrderController  │      │CategoryController│        │
│  ├──────────────────┤      ├──────────────────┤        │
│  │+ index(req,res)  │      │+ index(req,res)  │        │
│  │+ store(req,res)  │      │+ store(req,res)  │        │
│  │+ show(req,res)   │      │+ update(req,res) │        │
│  └──────────────────┘      │+ destroy(req,res)│        │
│                            └──────────────────┘        │
│                                                          │
└─────────────────────────────────────────────────────────┘


┌─────────────────────────────────────────────────────────┐
│                DATABASE LAYER (Models)                   │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌──────────────────┐      ┌──────────────────┐        │
│  │    UserModel     │      │   CakeModel      │        │
│  ├──────────────────┤      ├──────────────────┤        │
│  │+ findByEmail()   │      │+ findAll()       │        │
│  │+ findById()      │      │+ findById()      │        │
│  │+ create()        │      │+ create()        │        │
│  │+ update()        │      │+ update()        │        │
│  │+ delete()        │      │+ delete()        │        │
│  └──────────────────┘      │+ search()        │        │
│                            └──────────────────┘        │
│  ┌──────────────────┐                                  │
│  │   OrderModel     │      ┌──────────────────┐        │
│  ├──────────────────┤      │ CategoryModel    │        │
│  │+ create()        │      ├──────────────────┤        │
│  │+ findByUser()    │      │+ findAll()       │        │
│  │+ findById()      │      │+ findById()      │        │
│  │+ updateStatus()  │      │+ create()        │        │
│  └──────────────────┘      │+ update()        │        │
│                            │+ delete()        │        │
│                            └──────────────────┘        │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

---

## 3.2 Class Diagram: Entity Relationships (Detailed)

**Deskripsi:** Diagram detail yang fokus pada entity class dan relationship-nya dengan multiplicity.

```
                                1
┌─────────────────────┐         │         ┌─────────────────────┐
│        User         │◄────────┼────────►│       Order         │
├─────────────────────┤     has many      ├─────────────────────┤
│ - id: string        │                   │ - id: string        │
│ - name: string      │                   │ - userId: string    │
│ - email: string     │                   │ - customerName:     │
│ - password: string  │                   │   string            │
│ - role: string      │                   │ - address: string   │
│ - createdAt: Date   │                   │ - phone: string     │
└─────────────────────┘                   │ - notes: string     │
                                          │ - status: enum      │
         │ 1                              │   (pending,         │
         │                                │    completed,       │
         │ has one                        │    cancelled)       │
         │                                │ - totalAmount:      │
         ▼                                │   decimal           │
┌─────────────────────┐                   │ - createdAt: Date   │
│        Cart         │                   └──────────┬──────────┘
├─────────────────────┤                              │
│ - userId: string    │                              │ 1
│ - items: CartItem[] │                              │
│ - total: number     │                              │ has many
└─────────────────────┘                              │
         │                                           ▼
         │ 1..*                              ┌────────────────┐
         │ contains                          │   OrderItem    │
         ▼                                   ├────────────────┤
┌─────────────────────┐                      │ - orderId:     │
│      CartItem       │                      │   string       │
├─────────────────────┤                      │ - productId:   │
│ - productId: string │                      │   string       │
│ - quantity: int     │                      │ - productName: │
│ - price: number     │                      │   string       │
└──────────┬──────────┘                      │ - quantity: int│
           │                                 │ - price: number│
           │ references                      └────────┬───────┘
           │                                          │
           │                                          │
           │                                          │ references
           │         1                                │
           └────────┬───────────────────────┬─────────┘
                    │                       │
                    ▼                       ▼
            ┌─────────────────────┐
            │       Product       │
            │       (Cake)        │
            ├─────────────────────┤
            │ - id: string        │
            │ - name: string      │
            │ - description: text │
            │ - price: decimal    │
            │ - stock: int        │
            │ - categoryId: string│
            │ - image: string     │
            │ - createdAt: Date   │
            └──────────┬──────────┘
                       │
                       │ many-to-one
                       │ belongs to
                       │
                       ▼
            ┌─────────────────────┐
            │      Category       │
            ├─────────────────────┤
            │ - id: string        │
            │ - name: string      │
            │ - description: text │
            │ - createdAt: Date   │
            └─────────────────────┘
                       │
                       │ 1
                       │ has many
                       ▼
                   (Products)


RELATIONSHIP DESCRIPTIONS:

1. User ──[1:*]──> Order
   - One user can have many orders
   - Each order belongs to one user

2. User ──[1:1]──> Cart
   - One user has one cart
   - Cart is specific to one user

3. Cart ──[1:*]──> CartItem
   - One cart contains many cart items
   - Each cart item belongs to one cart

4. CartItem ──[*:1]──> Product
   - Many cart items can reference one product
   - Each cart item references one product

5. Order ──[1:*]──> OrderItem
   - One order contains many order items
   - Each order item belongs to one order

6. OrderItem ──[*:1]──> Product
   - Many order items can reference one product
   - Each order item references one product

7. Product ──[*:1]──> Category
   - Many products belong to one category
   - Each product has one category

8. Category ──[1:*]──> Product
   - One category has many products
   - Products are grouped by category
```

---

## 3.3 Class Diagram: Frontend Components (React)

**Deskripsi:** Diagram yang menunjukkan struktur component React di frontend dengan props dan state management.

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend Architecture                     │
└─────────────────────────────────────────────────────────────┘

                         ┌──────────────┐
                         │     App      │
                         ├──────────────┤
                         │ State:       │
                         │ - currentUser│
                         │ - cakes[]    │
                         │ - cart[]     │
                         │ - currentView│
                         ├──────────────┤
                         │ Methods:     │
                         │ + handleLogin│
                         │ + handleLogou│
                         │ + addToCart  │
                         │ + checkout   │
                         └───────┬──────┘
                                 │
              ┌──────────────────┼──────────────────┐
              │                  │                  │
              ▼                  ▼                  ▼
      ┌──────────────┐   ┌──────────────┐  ┌──────────────┐
      │    Navbar    │   │  HomeView    │  │  LoginView   │
      ├──────────────┤   ├──────────────┤  ├──────────────┤
      │ Props:       │   │ Props:       │  │ State:       │
      │ - currentUser│   │ - cakes[]    │  │ - email      │
      │ - cartCount  │   │ - onNavigate │  │ - password   │
      │ - onNavigate │   │ State:       │  │ - error      │
      │ - onLogout   │   │ - aiQuestion │  │ Methods:     │
      │ Methods:     │   │ - recommend  │  │ + handleLogin│
      │ + renderLinks│   │ Methods:     │  └──────────────┘
      └──────────────┘   │ + handleAI   │
                         │ + showRecomm │          │
              │          └──────────────┘          │
              │                                    │
              ▼                  │                 ▼
      ┌──────────────┐           │         ┌──────────────┐
      │ RegisterView │           │         │   Services   │
      ├──────────────┤           │         ├──────────────┤
      │ State:       │           │         │ apiService   │
      │ - name       │           │         │ geminiService│
      │ - email      │           │         └──────────────┘
      │ - password   │           │
      │ - error      │           ▼
      │ Methods:     │   ┌──────────────┐
      │ + handleReg  │   │ CatalogView  │
      └──────────────┘   ├──────────────┤
                         │ Props:       │
              │          │ - cakes[]    │
              │          │ - onAddToCart│
              │          │ - onViewDetai│
              │          │ State:       │
              │          │ - searchQuery│
              │          │ - selectedCat│
              │          │ Methods:     │
              │          │ + filterCakes│
              └──────────┴──────────────┘
                                 │
                                 │
                    ┌────────────┴────────────┐
                    │                         │
                    ▼                         ▼
            ┌──────────────┐         ┌──────────────┐
            │ProductDetail │         │   CartView   │
            │     View     │         ├──────────────┤
            ├──────────────┤         │ Props:       │
            │ Props:       │         │ - cart[]     │
            │ - cake       │         │ - onUpdate   │
            │ - onAddToCart│         │ - onRemove   │
            │ State:       │         │ - onCheckout │
            │ - quantity   │         │ Methods:     │
            │ Methods:     │         │ + calcTotal  │
            │ + handleAdd  │         │ + handleQty  │
            └──────────────┘         └──────────────┘
                    │                         │
                    │                         │
                    └────────────┬────────────┘
                                 │
                                 ▼
                         ┌──────────────┐
                         │CheckoutView  │
                         ├──────────────┤
                         │ Props:       │
                         │ - cart[]     │
                         │ - total      │
                         │ - onSubmit   │
                         │ State:       │
                         │ - name       │
                         │ - address    │
                         │ - phone      │
                         │ - notes      │
                         │ Methods:     │
                         │ + handleOrder│
                         └──────────────┘
                                 │
                                 │
                                 ▼
                         ┌──────────────┐
                         │OrderHistory  │
                         │    View      │
                         ├──────────────┤
                         │ Props:       │
                         │ - orders[]   │
                         │ Methods:     │
                         │ + loadOrders │
                         │ + showDetail │
                         └──────────────┘


            ┌────────────────────────────────┐
            │     ADMIN/SELLER COMPONENTS    │
            └────────────────────────────────┘

                    ┌──────────────┐
                    │AdminDashboard│
                    ├──────────────┤
                    │ Props:       │
                    │ - currentUser│
                    │ State:       │
                    │ - products[] │
                    │ - categories │
                    │ - orders[]   │
                    │ - activeTab  │
                    │ Methods:     │
                    │ + loadData   │
                    │ + handleCRUD │
                    └───────┬──────┘
                            │
              ┌─────────────┼─────────────┐
              │             │             │
              ▼             ▼             ▼
      ┌──────────┐   ┌──────────┐  ┌──────────┐
      │ Product  │   │Category  │  │ Orders   │
      │   Tab    │   │   Tab    │  │   Tab    │
      ├──────────┤   ├──────────┤  ├──────────┤
      │- list    │   │- list    │  │- list    │
      │- add form│   │- add form│  │- details │
      │- edit    │   │- edit    │  │- status  │
      │- delete  │   │- delete  │  └──────────┘
      └──────────┘   └──────────┘


                    ┌──────────────┐
                    │SellerDashboar│
                    ├──────────────┤
                    │ Props:       │
                    │ - currentUser│
                    │ State:       │
                    │ - products[] │
                    │ - orders[]   │
                    │ Methods:     │
                    │ + manageProdu│
                    │ + viewOrders │
                    └──────────────┘
```

**Component Hierarchy:**
- App (root component)
  - Navbar
  - Views (conditional rendering):
    - HomeView
    - LoginView / RegisterView
    - CatalogView
      - ProductDetailView
    - CartView
      - CheckoutView
    - OrderHistoryView
    - AdminDashboard (admin only)
      - ProductTab
      - CategoryTab
      - OrdersTab
    - SellerDashboard (seller only)

---

## Summary of Diagrams

### Sequence Diagrams
1. **Customer Login** - Menjelaskan proses autentikasi user
2. **Add to Cart & Checkout** - Proses shopping dari cart hingga order
3. **Admin Manage Product** - CRUD operations untuk produk
4. **AI Recommendation** - Integrasi dengan Gemini API

### Activity Diagrams
1. **Customer Registration** - Alur pendaftaran customer baru
2. **Shopping Cart to Checkout** - Alur belanja lengkap
3. **Admin Product Management** - Workflow pengelolaan produk

### Class Diagrams
1. **Complete System** - Seluruh class dengan 3 layer (Controller, Service, Model)
2. **Entity Relationships** - Detail entity dan relationship dengan multiplicity
3. **Frontend Components** - Struktur component React

---

## Technology Stack Reference

**Backend:**
- PHP 8.2 + Apache
- MySQL 8.0
- REST API architecture

**Frontend:**
- React 18 + TypeScript
- Vite
- TailwindCSS

**Integration:**
- Google Gemini AI API
- Docker + Docker Compose
- Ngrok (tunneling)

---

**Created By:** Sweet Bites Bakery Development Team  
**Last Updated:** February 1, 2026
