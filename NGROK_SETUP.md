# Ngrok Setup untuk Sweet Bites Bakery

## Install Ngrok
Download dari https://ngrok.com/download atau pakai:
```bash
choco install ngrok  # Windows
```

## Jalankan Ngrok untuk Frontend dan Backend

Buka 3 terminal PowerShell:

### Terminal 1: Docker Compose
```bash
cd C:\xampp\htdocs\sweet-bites-bakery-management-system
docker compose up
```

### Terminal 2: Expose Backend (Port 8080)
```bash
ngrok http 8080
```
Catat URL yang muncul, misal: `https://abc123-xyz.ngrok.io`

### Terminal 3: Expose Frontend (Port 3000)
```bash
ngrok http 3000
```
Catat URL yang muncul, misal: `https://def456-uvw.ngrok.io`

## Update .env dengan Ngrok URLs

Edit `.env` file:
```
VITE_GEMINI_API_KEY=YOUR_API_KEY
VITE_API_BASE_URL=https://abc123-xyz.ngrok.io/backend/api
```

## Update Backend Config

Edit `backend/config/config.php`:
```php
define('APP_URL', 'https://def456-uvw.ngrok.io');
define('API_URL', 'https://abc123-xyz.ngrok.io/backend');
```

## Restart Services

Restart frontend:
```bash
npm run dev
```

Akses aplikasi via URL frontend ngrok Anda!

---

## Note
- Ngrok URLs berubah setiap kali restart (free tier)
- Untuk permanent URL, upgrade ngrok ke paid plan
- Pastikan Docker dan ngrok berjalan saat akses
