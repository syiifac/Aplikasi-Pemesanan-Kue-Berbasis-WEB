# Sweet Bites Bakery - PHP Backend

Backend API untuk Sweet Bites Bakery Management System.

## Setup

### 1. Database Setup
```sql
-- Import file database/schema.sql ke MySQL
```

### 2. Konfigurasi Database
Edit `config/config.php`:
```php
define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_NAME', 'sweet_bites_bakery');
```

### 3. Jalankan Backend
```bash
# Menggunakan PHP built-in server
php -S localhost:8080
```

## API Endpoints

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Authentication
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user

### Orders
- `GET /api/orders` - Get all orders
- `GET /api/orders/:id` - Get single order
- `POST /api/orders` - Create order
- `PUT /api/orders/:id` - Update order status

### Users
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user profile
- `PUT /api/users/:id` - Update user profile

## Frontend Integration

Update React API calls:
```typescript
const API_URL = 'http://localhost:8080/backend/api';

// Example: Fetch products
fetch(`${API_URL}/products`)
  .then(res => res.json())
  .then(data => console.log(data));
```

## Struktur Folder

```
backend/
├── config/          # Database & app configuration
├── controllers/     # Business logic
├── models/         # Database models
├── routes/         # API routes
├── middleware/     # Middleware functions
└── index.php       # Main entry point
```
