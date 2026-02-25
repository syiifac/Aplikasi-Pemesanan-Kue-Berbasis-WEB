// PDF Export Service for generating reports
import html2pdf from 'html2pdf.js';

interface ReportOptions {
  filename: string;
  title: string;
  orientation?: 'portrait' | 'landscape';
  format?: 'a4' | 'a3';
}

/**
 * Export HTML content to PDF
 * @param element HTML element to convert to PDF
 * @param options PDF options (filename, title, etc)
 */
export const exportToPDF = (element: HTMLElement, options: ReportOptions) => {
  const pdfOptions = {
    margin: [10, 10, 10, 10] as [number, number, number, number],
    filename: options.filename,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { 
      orientation: options.orientation || 'portrait', 
      unit: 'mm', 
      format: options.format || 'a4' 
    }
  };

  html2pdf().set(pdfOptions).from(element).save();
};

/**
 * Generate Orders Report PDF
 */
export const generateOrdersReport = (orders: any[], filename: string = 'laporan-pesanan.pdf') => {
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; padding: 20px;">
      <h1 style="text-align: center; color: #333; margin-bottom: 10px;">SWEET BITES BAKERY</h1>
      <h2 style="text-align: center; color: #999; font-size: 14px; margin-bottom: 30px;">Laporan Pesanan</h2>
      
      <p style="margin-bottom: 20px;">
        <strong>Tanggal Laporan:</strong> ${new Date().toLocaleDateString('id-ID')}
      </p>
      
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
        <thead>
          <tr style="background-color: #f3f4f6;">
            <th style="border: 1px solid #ddd; padding: 10px; text-align: left;">No</th>
            <th style="border: 1px solid #ddd; padding: 10px; text-align: left;">Nama Pelanggan</th>
            <th style="border: 1px solid #ddd; padding: 10px; text-align: left;">Tanggal Pesanan</th>
            <th style="border: 1px solid #ddd; padding: 10px; text-align: left;">Total Harga</th>
            <th style="border: 1px solid #ddd; padding: 10px; text-align: left;">Status</th>
          </tr>
        </thead>
        <tbody>
          ${orders.map((order, index) => `
            <tr>
              <td style="border: 1px solid #ddd; padding: 10px;">${index + 1}</td>
              <td style="border: 1px solid #ddd; padding: 10px;">${order.customerName}</td>
              <td style="border: 1px solid #ddd; padding: 10px;">${new Date(order.createdAt).toLocaleDateString('id-ID')}</td>
              <td style="border: 1px solid #ddd; padding: 10px;">Rp ${order.totalAmount.toLocaleString('id-ID')}</td>
              <td style="border: 1px solid #ddd; padding: 10px;">
                <span style="padding: 5px 10px; border-radius: 5px; font-size: 12px; ${
                  order.status === 'pending' ? 'background-color: #fef08a; color: #92400e;' :
                  order.status === 'completed' ? 'background-color: #dcfce7; color: #166534;' :
                  'background-color: #fee2e2; color: #991b1b;'
                }">
                  ${order.status}
                </span>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
      
      <div style="border-top: 2px solid #ddd; padding-top: 20px; margin-top: 20px;">
        <p><strong>Total Pesanan:</strong> ${orders.length}</p>
        <p><strong>Total Penjualan:</strong> Rp ${orders.reduce((sum, o) => sum + o.totalAmount, 0).toLocaleString('id-ID')}</p>
        <p style="margin-top: 20px; text-align: right; font-size: 12px; color: #999;">
          Digenerate pada: ${new Date().toLocaleString('id-ID')}
        </p>
      </div>
    </div>
  `;

  const element = document.createElement('div');
  element.innerHTML = htmlContent;
  
  const pdfOptions = {
    margin: [10, 10, 10, 10] as [number, number, number, number],
    filename: filename,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { orientation: 'landscape', unit: 'mm', format: 'a4' }
  };

  html2pdf().set(pdfOptions).from(element).save();
};

/**
 * Generate Sales Report PDF
 */
export const generateSalesReport = (
  orders: any[], 
  products: any[], 
  filename: string = 'laporan-penjualan.pdf'
) => {
  const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);
  const completedOrders = orders.filter(o => o.status === 'completed').length;
  const pendingOrders = orders.filter(o => o.status === 'pending').length;

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; padding: 20px;">
      <h1 style="text-align: center; color: #333; margin-bottom: 10px;">SWEET BITES BAKERY</h1>
      <h2 style="text-align: center; color: #999; font-size: 14px; margin-bottom: 30px;">Laporan Penjualan</h2>
      
      <p style="margin-bottom: 30px;">
        <strong>Periode:</strong> ${new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long' })}
      </p>
      
      <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 20px; margin-bottom: 30px;">
        <div style="border: 1px solid #ddd; padding: 15px; border-radius: 5px;">
          <p style="color: #999; margin: 0; font-size: 12px;">Total Penjualan</p>
          <h3 style="color: #333; margin: 10px 0 0 0; font-size: 24px;">Rp ${totalRevenue.toLocaleString('id-ID')}</h3>
        </div>
        <div style="border: 1px solid #ddd; padding: 15px; border-radius: 5px;">
          <p style="color: #999; margin: 0; font-size: 12px;">Pesanan Selesai</p>
          <h3 style="color: #333; margin: 10px 0 0 0; font-size: 24px;">${completedOrders} Pesanan</h3>
        </div>
        <div style="border: 1px solid #ddd; padding: 15px; border-radius: 5px;">
          <p style="color: #999; margin: 0; font-size: 12px;">Pesanan Menunggu</p>
          <h3 style="color: #333; margin: 10px 0 0 0; font-size: 24px;">${pendingOrders} Pesanan</h3>
        </div>
      </div>

      <h3 style="margin-bottom: 10px; color: #333;">Top Products</h3>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
        <thead>
          <tr style="background-color: #f3f4f6;">
            <th style="border: 1px solid #ddd; padding: 10px; text-align: left;">Nama Produk</th>
            <th style="border: 1px solid #ddd; padding: 10px; text-align: left;">Kategori</th>
            <th style="border: 1px solid #ddd; padding: 10px; text-align: left;">Harga</th>
            <th style="border: 1px solid #ddd; padding: 10px; text-align: left;">Stok</th>
          </tr>
        </thead>
        <tbody>
          ${products.slice(0, 10).map((product) => `
            <tr>
              <td style="border: 1px solid #ddd; padding: 10px;">${product.name}</td>
              <td style="border: 1px solid #ddd; padding: 10px;">${product.category}</td>
              <td style="border: 1px solid #ddd; padding: 10px;">Rp ${product.price.toLocaleString('id-ID')}</td>
              <td style="border: 1px solid #ddd; padding: 10px;">${product.stock} Unit</td>
            </tr>
          `).join('')}
        </tbody>
      </table>

      <div style="border-top: 2px solid #ddd; padding-top: 20px; margin-top: 20px;">
        <p style="margin-top: 20px; text-align: right; font-size: 12px; color: #999;">
          Digenerate pada: ${new Date().toLocaleString('id-ID')}
        </p>
      </div>
    </div>
  `;

  const element = document.createElement('div');
  element.innerHTML = htmlContent;
  
  const pdfOptions = {
    margin: [10, 10, 10, 10] as [number, number, number, number],
    filename: filename,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' }
  };

  html2pdf().set(pdfOptions).from(element).save();
};

/**
 * Generate Inventory Report PDF
 */
export const generateInventoryReport = (
  products: any[], 
  filename: string = 'laporan-inventaris.pdf'
) => {
  const lowStockProducts = products.filter(p => p.stock < 10);
  const totalProducts = products.length;
  const totalStockValue = products.reduce((sum, p) => sum + (p.price * p.stock), 0);

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; padding: 20px;">
      <h1 style="text-align: center; color: #333; margin-bottom: 10px;">SWEET BITES BAKERY</h1>
      <h2 style="text-align: center; color: #999; font-size: 14px; margin-bottom: 30px;">Laporan Inventaris</h2>
      
      <p style="margin-bottom: 30px;">
        <strong>Tanggal:</strong> ${new Date().toLocaleDateString('id-ID')}
      </p>
      
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 30px;">
        <div style="border: 1px solid #ddd; padding: 15px; border-radius: 5px;">
          <p style="color: #999; margin: 0; font-size: 12px;">Total Produk</p>
          <h3 style="color: #333; margin: 10px 0 0 0; font-size: 24px;">${totalProducts} Jenis</h3>
        </div>
        <div style="border: 1px solid #ddd; padding: 15px; border-radius: 5px;">
          <p style="color: #999; margin: 0; font-size: 12px;">Nilai Total Stok</p>
          <h3 style="color: #333; margin: 10px 0 0 0; font-size: 24px;">Rp ${totalStockValue.toLocaleString('id-ID')}</h3>
        </div>
      </div>

      <h3 style="margin-bottom: 10px; color: #333;">Semua Produk</h3>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
        <thead>
          <tr style="background-color: #f3f4f6;">
            <th style="border: 1px solid #ddd; padding: 10px; text-align: left;">Nama Produk</th>
            <th style="border: 1px solid #ddd; padding: 10px; text-align: left;">Kategori</th>
            <th style="border: 1px solid #ddd; padding: 10px; text-align: right;">Stok</th>
            <th style="border: 1px solid #ddd; padding: 10px; text-align: right;">Harga</th>
            <th style="border: 1px solid #ddd; padding: 10px; text-align: right;">Nilai</th>
          </tr>
        </thead>
        <tbody>
          ${products.map((product) => `
            <tr ${product.stock < 10 ? 'style="background-color: #fef2f2;"' : ''}>
              <td style="border: 1px solid #ddd; padding: 10px;">${product.name} ${product.stock < 10 ? '** LOW STOCK' : ''}</td>
              <td style="border: 1px solid #ddd; padding: 10px;">${product.category}</td>
              <td style="border: 1px solid #ddd; padding: 10px; text-align: right;">${product.stock} Unit</td>
              <td style="border: 1px solid #ddd; padding: 10px; text-align: right;">Rp ${product.price.toLocaleString('id-ID')}</td>
              <td style="border: 1px solid #ddd; padding: 10px; text-align: right;">Rp ${(product.price * product.stock).toLocaleString('id-ID')}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>

      ${lowStockProducts.length > 0 ? `
        <div style="background-color: #fef2f2; border: 1px solid #fecaca; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
          <h4 style="color: #991b1b; margin: 0 0 10px 0;">WARNING: Produk Stok Rendah (Kurang dari 10 Unit)</h4>
          <ul style="margin: 0; padding-left: 20px;">
            ${lowStockProducts.map(p => `<li>${p.name}: ${p.stock} Unit</li>`).join('')}
          </ul>
        </div>
      ` : ''}

      <div style="border-top: 2px solid #ddd; padding-top: 20px; margin-top: 20px;">
        <p style="margin-top: 20px; text-align: right; font-size: 12px; color: #999;">
          Digenerate pada: ${new Date().toLocaleString('id-ID')}
        </p>
      </div>
    </div>
  `;

  const element = document.createElement('div');
  element.innerHTML = htmlContent;
  
  const pdfOptions = {
    margin: [10, 10, 10, 10] as [number, number, number, number],
    filename: filename,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' }
  };

  html2pdf().set(pdfOptions).from(element).save();
};
