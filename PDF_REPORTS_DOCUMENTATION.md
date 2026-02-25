# PDF Report Export Feature - Admin Dashboard

## Overview

Admin Dashboard sekarang dilengkapi dengan fitur **PDF Report Export** yang memungkinkan admin untuk mengunduh laporan dalam format PDF. Fitur ini terintegrasi dengan library `html2pdf.js` untuk mengkonversi HTML menjadi PDF.

---

## Features

### 1. Laporan Pesanan (Orders Report)
**Deskripsi:** Laporan detail semua pesanan yang masuk ke sistem.

**Konten:**
- Nomor urut pesanan
- Nama pelanggan
- Tanggal pesanan (format: DD-MM-YYYY)
- Total harga per pesanan
- Status pesanan (pending, completed, cancelled)
- Total jumlah pesanan
- Total penjualan keseluruhan
- Timestamp pembuatan laporan

**Format:** Landscape A4  
**Filename:** `laporan-pesanan-YYYY-MM-DD.pdf`

---

### 2. Laporan Penjualan (Sales Report)
**Deskripsi:** Ringkasan penjualan dengan insight performa bisnis.

**Konten:**
- **Metrics:**
  - Total Penjualan (Revenue)
  - Pesanan Selesai (Completed Orders)
  - Pesanan Menunggu (Pending Orders)
- **Top Products (Top 10):**
  - Nama produk
  - Kategori
  - Harga
  - Stok tersedia
- Periode laporan (bulan dan tahun)
- Timestamp pembuatan laporan

**Format:** Portrait A4  
**Filename:** `laporan-penjualan-YYYY-MM-DD.pdf`

---

### 3. Laporan Inventaris (Inventory Report)
**Deskripsi:** Laporan status stok semua produk dengan analisis inventory.

**Konten:**
- **Metrics:**
  - Total Produk (jumlah jenis kue)
  - Nilai Total Stok (total value of inventory)
- **Semua Produk:**
  - Nama produk
  - Kategori
  - Jumlah stok
  - Harga satuan
  - Total nilai stok (harga × stok)
  - Highlight produk dengan stok rendah (< 10 unit)
- **Produk Stok Rendah:**
  - List warning untuk produk yang perlu restock
- Timestamp pembuatan laporan

**Format:** Portrait A4  
**Filename:** `laporan-inventaris-YYYY-MM-DD.pdf`

---

## How to Use

### Step 1: Login sebagai Admin
- Email: `admin@sweetbites.com`
- Password: `123456`

### Step 2: Navigate ke Admin Dashboard
- Klik menu "Admin" di navbar (hanya visible untuk admin)

### Step 3: Buka Tab "Laporan Transaksi"
- Pada tab navigation, pilih "Laporan Transaksi"

### Step 4: Download Laporan yang Diinginkan
- Klik tombol **"📥 Download PDF"** pada kartu laporan:
  - **Laporan Pesanan** (biru)
  - **Laporan Penjualan** (hijau)
  - **Laporan Inventaris** (ungu)

### Step 5: File Akan Otomatis Diunduh
- PDF akan tersimpan di folder Download default browser
- Filename otomatis dengan tanggal: `laporan-*.pdf`

---

## Technical Implementation

### Files Added/Modified

#### New Files:
1. **`services/pdfService.ts`**
   - Contains PDF export functions
   - Functions: `generateOrdersReport()`, `generateSalesReport()`, `generateInventoryReport()`
   - Dependency: `html2pdf.js`

#### Modified Files:
1. **`package.json`**
   - Added dependency: `"html2pdf.js": "^0.10.1"`

2. **`views/AdminDashboard.tsx`**
   - Added new tab: `REPORTS`
   - Added UI for 3 report cards
   - Integrated PDF export functions
   - Added `cakes` prop to display products

3. **`App.tsx`**
   - Pass `cakes` prop to `AdminDashboard` component

### PDF Generation Process

```typescript
// Example: Generate Orders Report
const htmlContent = `<div>...</div>`; // HTML template
const element = document.createElement('div');
element.innerHTML = htmlContent;

const pdfOptions = {
  margin: [10, 10, 10, 10],
  filename: 'laporan-pesanan.pdf',
  image: { type: 'jpeg', quality: 0.98 },
  html2canvas: { scale: 2 },
  jsPDF: { orientation: 'landscape', unit: 'mm', format: 'a4' }
};

html2pdf().set(pdfOptions).from(element).save();
```

---

## API Reference

### `generateOrdersReport(orders: Order[], filename?: string)`
Generates a detailed orders report in PDF format.

**Parameters:**
- `orders` (required): Array of Order objects
- `filename` (optional): Custom filename for PDF (default: `laporan-pesanan.pdf`)

**Returns:** void (triggers PDF download)

---

### `generateSalesReport(orders: Order[], products: Cake[], filename?: string)`
Generates a sales summary report with products list.

**Parameters:**
- `orders` (required): Array of Order objects
- `products` (required): Array of Cake objects
- `filename` (optional): Custom filename for PDF (default: `laporan-penjualan.pdf`)

**Returns:** void (triggers PDF download)

---

### `generateInventoryReport(products: Cake[], filename?: string)`
Generates an inventory report with stock analysis.

**Parameters:**
- `products` (required): Array of Cake objects
- `filename` (optional): Custom filename for PDF (default: `laporan-inventaris.pdf`)

**Returns:** void (triggers PDF download)

---

## Design Specifications

### Report Layout

#### Orders Report
```
╔════════════════════════════════════════╗
║    SWEET BITES BAKERY                 ║
║    Laporan Pesanan                    ║
║    Date Generated: DD-MM-YYYY HH:MM   ║
╠════════════════════════════════════════╣
║  No │ Nama │ Tgl Pesanan │ Harga │ Status
├─────┼──────┼─────────────┼───────┼────────
│  1  │ ...  │ ...         │ ...   │ ...
└────────────────────────────────────────┘

SUMMARY:
- Total Pesanan: X
- Total Penjualan: Rp X.XXX.XXX
```

#### Sales Report
```
╔════════════════════════════════════════╗
║    SWEET BITES BAKERY                 ║
║    Laporan Penjualan                  ║
║    Periode: MMMM YYYY                 ║
╠════════════════════════════════════════╣
║  Total Penjualan  │  Rp X.XXX.XXX
║  Pesanan Selesai  │  X Pesanan
║  Pesanan Menunggu │  X Pesanan
║
║  TOP PRODUCTS:
║  1. Nama Produk  │ Category │ Rp X │ X Unit
└────────────────────────────────────────┘
```

#### Inventory Report
```
╔════════════════════════════════════════╗
║    SWEET BITES BAKERY                 ║
║    Laporan Inventaris                 ║
║    Tanggal: DD-MM-YYYY                ║
╠════════════════════════════════════════╣
║  Total Produk      │  X Jenis
║  Nilai Total Stok  │  Rp X.XXX.XXX
║
║  SEMUA PRODUK:
║  Produk │ Kategori │ Stok │ Harga │ Nilai
│ ...    │ ...      │ ...  │ ...   │ ...
│ ...    │ ...      │ ...  │ ...   │ ...
║
║  ⚠️  STOK RENDAH (< 10 UNIT):
║  - Produk A: X Unit
║  - Produk B: X Unit
└────────────────────────────────────────┘
```

---

## Styling

Reports menggunakan styling yang konsisten dengan brand Sweet Bites Bakery:
- **Font:** Arial, sans-serif
- **Colors:**
  - Heading: `#333` (dark slate)
  - Subheading: `#999` (light gray)
  - Table header: `#f3f4f6` (light gray background)
  - Borders: `#ddd` (light border)
- **Spacing:**
  - Page margin: 10mm all sides
  - Cell padding: 10px
- **Tables:**
  - Full width with borders
  - Alternating row colors for readability
  - Right-aligned for numeric values

---

## Data Validation

Sebelum generate PDF, sistem melakukan validasi:

1. **Orders Report:**
   - Minimal 1 order untuk generate laporan
   - Setiap order harus memiliki: `customerName`, `totalAmount`, `status`, `createdAt`

2. **Sales Report:**
   - Minimal 1 order
   - Minimal 1 product
   - Orders dan products tidak boleh null

3. **Inventory Report:**
   - Minimal 1 product
   - Setiap product harus memiliki: `name`, `category`, `stock`, `price`
   - Stock tidak boleh negative

---

## Performance Considerations

- **File Size:** ~100-300 KB per report (tergantung jumlah data)
- **Generation Time:** 1-3 detik per laporan
- **Browser Compatibility:** Chrome, Firefox, Safari, Edge (modern versions)
- **Memory:** HTML2PDF menggunakan canvas rendering (~50-100 MB)

---

## Error Handling

Sistem memiliki fallback jika terjadi error:

1. **Missing Data:**
   - Jika tidak ada orders/products, tampil notifikasi
   - Generate report dengan data kosong

2. **Browser Compatibility:**
   - Notifikasi jika browser tidak support
   - Suggestion menggunakan browser terbaru

3. **API Errors:**
   - Data di-load dari frontend state
   - Fallback ke local data jika API gagal

---

## Future Enhancements

Potential improvements untuk versi mendatang:

1. **Customizable Date Range**
   - Filter laporan by date range
   - Generate periodic reports (weekly, monthly)

2. **Email Distribution**
   - Send reports via email automatically
   - Schedule automated reports

3. **Advanced Analytics**
   - Charts dan graphs in reports
   - Trend analysis
   - Forecasting

4. **Multi-language Support**
   - English dan Indonesian reports
   - Localized date/currency formatting

5. **Export Formats**
   - Excel (.xlsx) format
   - CSV format
   - JSON format

6. **Digital Signature**
   - Add admin signature to reports
   - Verification QR code

---

## Troubleshooting

### Problem: PDF tidak bisa didownload

**Solution:**
1. Cek browser privacy settings
2. Izinkan downloads dari website
3. Coba browser berbeda
4. Clear browser cache

### Problem: PDF kosong atau tidak lengkap

**Solution:**
1. Pastikan ada data (orders/products)
2. Refresh halaman admin dashboard
3. Logout dan login ulang

### Problem: Styling tidak sesuai di PDF

**Solution:**
1. Gunakan browser terbaru (Chrome recommended)
2. Coba dengan connection lebih baik
3. Report issue ke development team

---

## Security Considerations

1. **Data Privacy:**
   - PDF di-generate di client-side
   - Tidak ada data yang dikirim ke server
   - Data hanya tersimpan di local computer

2. **Access Control:**
   - Hanya admin yang bisa generate reports
   - Non-admin users tidak bisa akses laporan

3. **File Handling:**
   - File tidak di-upload atau disimpan di server
   - User yang handle semua file management

---

**Created By:** Sweet Bites Bakery Development Team  
**Last Updated:** February 2, 2026  
**Version:** 1.0.0
