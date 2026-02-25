# 🍰 Sweet Bites Bakery - Authentication Implementation Guide

## ✅ Status: Authentication System Ready

Sistem autentikasi login dan register telah sepenuhnya diimplementasikan dengan dukungan backend PHP dan fallback ke mock data untuk testing.

---

## 📋 Fitur yang Sudah Diimplementasikan

### 1. **Login Form** (`LoginView.tsx`)
- ✅ Email & Password input fields
- ✅ Loading state dengan button disabled
- ✅ Error message display
- ✅ API call ke `http://localhost:8080/backend/api/auth/login`
- ✅ Fallback ke mock data jika API unavailable
- ✅ Removed demo account display

### 2. **Register Form** (`RegisterView.tsx`)
- ✅ Name, Email, Password, Password Confirm input fields
- ✅ Validation:
  - Nama minimum 3 karakter
  - Password minimum 6 karakter
  - Password confirmation match
- ✅ Loading state dan disabled button
- ✅ Success message dengan auto-redirect ke login
- ✅ Error message display
- ✅ API call ke `http://localhost:8080/backend/api/auth/register`
- ✅ Fallback ke mock data

### 3. **Backend Auth Controller** (`backend/controllers/AuthController.php`)
- ✅ `login()` method:
  - Validasi email & password required
  - Query users table
  - Verify password (plain text untuk sekarang)
  - Return user data dengan role
  - Error handling untuk missing user atau wrong password

- ✅ `register()` method:
  - Validasi name (min 3 chars)
  - Validasi password (min 6 chars)
  - Validasi email format
  - Cek email duplicate
  - Insert new user ke database
  - Return user data atau error message

### 4. **Backend Routes** (`backend/routes/authRoutes.php`)
- ✅ Route `/api/auth/login` (POST)
- ✅ Route `/api/auth/register` (POST)
- ✅ Proper HTTP status codes
- ✅ JSON response format

### 5. **Database Users Table**
```sql
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('CUSTOMER', 'SELLER', 'ADMIN') DEFAULT 'CUSTOMER',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

Sample users untuk testing:
- Email: `admin@sweetbites.com` | Password: `123456` | Role: ADMIN
- Email: `seller@sweetbites.com` | Password: `123456` | Role: SELLER
- Email: `customer@sweetbites.com` | Password: `123456` | Role: CUSTOMER

---

## 🚀 Cara Menjalankan

### Step 1: Start PHP Development Server
```bash
cd c:\xampp\htdocs\sweet-bites-bakery-management-system
php -S localhost:8080 -t backend
```

### Step 2: Start React Development Server
```bash
# Di terminal baru
npm run dev
# atau
npm start
```

### Step 3: Test dalam Browser
1. Buka http://localhost:5173 atau http://localhost:3000
2. Klik tombol "Masuk" atau "Registrasi"
3. Coba dengan kredensial sample di atas

---

## 📝 API Endpoints

### Login
```
POST http://localhost:8080/api/auth/login
Content-Type: application/json

Request Body:
{
  "email": "admin@sweetbites.com",
  "password": "123456"
}

Response (Success):
{
  "success": true,
  "message": "Login berhasil",
  "user": {
    "id": "1",
    "name": "Admin Utama",
    "email": "admin@sweetbites.com",
    "role": "ADMIN"
  }
}

Response (Failure):
{
  "success": false,
  "message": "Email tidak terdaftar" atau "Password salah"
}
```

### Register
```
POST http://localhost:8080/api/auth/register
Content-Type: application/json

Request Body:
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "CUSTOMER"
}

Response (Success):
{
  "success": true,
  "message": "Registrasi berhasil",
  "user": {
    "id": "16",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "CUSTOMER"
  }
}

Response (Failure):
{
  "success": false,
  "message": "Email sudah terdaftar" atau validasi error lainnya
}
```

---

## 🧪 Testing

### Test dengan cURL
```bash
# Login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"admin@sweetbites.com\",\"password\":\"123456\"}"

# Register
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Test User\",\"email\":\"test@example.com\",\"password\":\"password123\",\"role\":\"CUSTOMER\"}"
```

### Test dengan PHP CLI
```bash
php backend/test-auth.php
```

---

## 🔄 Alur Autentikasi

### Login Flow:
1. User input email & password → Click "Masuk"
2. LoginView memanggil API: `POST /api/auth/login`
3. Backend AuthController:
   - Query users table by email
   - Verify password
   - Return user data atau error
4. Frontend:
   - Jika success: Save user ke state dan navigate ke HOME
   - Jika error: Display error message
   - Jika API error (404): Fallback ke mock users array

### Register Flow:
1. User input name, email, password, confirm → Click "Daftar"
2. Frontend validation:
   - Name min 3 chars
   - Password min 6 chars
   - Password match confirmation
3. RegisterView memanggil API: `POST /api/auth/register`
4. Backend AuthController:
   - Validasi input
   - Cek email duplicate
   - Hash password (TODO: implement bcrypt)
   - Insert ke users table
   - Return user data atau error
5. Frontend:
   - Jika success: Show "Registrasi berhasil!" dan redirect ke login
   - Jika error: Display error message
   - Jika API error: Fallback ke local user creation

---

## ⚠️ Security Improvements TODO

### Priority 1 (High):
- [ ] Implement password hashing dengan `password_hash()` dan `password_verify()`
  - Update: `backend/controllers/AuthController.php` register() & login()
  - File to modify: `AuthController.php` lines 44 & 130

- [ ] Implement JWT or Session tokens
  - Frontend: Store token di localStorage
  - Backend: Validate token dalam protected routes
  - Add: `backend/middleware/auth.php` untuk protected endpoints

### Priority 2 (Medium):
- [ ] Add email validation & confirmation
- [ ] Rate limiting untuk login attempts
- [ ] CSRF protection
- [ ] Input sanitization lebih strict

### Priority 3 (Low):
- [ ] OAuth integration (Google, Facebook)
- [ ] Two-factor authentication
- [ ] Password reset functionality

---

## 📁 File Structure

```
backend/
├── index.php                           # Main router
├── config/
│   ├── config.php                      # Configuration
│   └── Database.php                    # Database connection class
├── controllers/
│   └── AuthController.php              # ✅ Login & Register logic
├── routes/
│   └── authRoutes.php                  # ✅ Auth API routes
└── test-auth.php                       # ✅ Test script

frontend (src/):
├── views/
│   ├── LoginView.tsx                   # ✅ Login form
│   └── RegisterView.tsx                # ✅ Register form
├── services/
│   └── apiService.ts                   # API calls
└── App.tsx                             # Main component
```

---

## 🐛 Known Issues & Notes

1. **Password Hashing**: Currently storing plain text passwords
   - ✏️ TODO: Implement `password_hash()` on register
   - ✏️ TODO: Implement `password_verify()` on login

2. **Session Management**: No persistent sessions
   - ✏️ TODO: Add JWT tokens or PHP sessions
   - ✏️ TODO: Implement token refresh mechanism

3. **Rate Limiting**: No protection against brute force
   - ✏️ TODO: Add login attempt tracking

4. **Email Validation**: No email confirmation
   - ✏️ TODO: Add email verification step

---

## 📖 Next Steps

1. ✅ **[COMPLETED]** Create Auth Controller dengan login & register methods
2. ✅ **[COMPLETED]** Create Auth Routes
3. ✅ **[COMPLETED]** Update LoginView untuk API integration
4. ✅ **[COMPLETED]** Update RegisterView untuk API integration
5. ⏳ **[TODO]** Implement password hashing (password_hash / password_verify)
6. ⏳ **[TODO]** Implement JWT token system
7. ⏳ **[TODO]** Create protected routes middleware
8. ⏳ **[TODO]** Add role-based access control (RBAC)
9. ⏳ **[TODO]** Implement customer dashboard
10. ⏳ **[TODO]** Implement seller dashboard features
11. ⏳ **[TODO]** Add email confirmation
12. ⏳ **[TODO]** Add password reset functionality

---

## 🎯 Quick Test Checklist

- [ ] PHP server running on localhost:8080
- [ ] React server running on localhost:3000/5173
- [ ] Database `sweet_bites_bakery` exists with users table
- [ ] Sample users created (admin, seller, customer)
- [ ] Login with `admin@sweetbites.com` / `123456` works
- [ ] Register new user works and creates DB record
- [ ] Fallback to mock data works when API is unavailable
- [ ] Error messages display correctly
- [ ] Loading states work correctly
- [ ] Redirect to login after successful register

---

## 📞 Support

Jika ada error, cek:
1. PHP server running: `netstat -ano | findstr :8080`
2. Database connected: Run `php backend/test-auth.php`
3. CORS enabled: Check `backend/config/config.php`
4. Frontend fetch URL: Verify in browser DevTools Network tab
5. Database schema: Check `database/sweetbites.sql`

---

**Last Updated**: February 1, 2026
**Status**: ✅ Authentication Frontend & Backend Ready for Testing
