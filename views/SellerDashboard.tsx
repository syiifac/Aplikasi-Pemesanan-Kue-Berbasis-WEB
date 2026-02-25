
import React, { useState, useEffect } from 'react';
import { Cake, Order, OrderStatus } from '../types';
import { API_BASE_URL, productAPI } from '../services/apiService';

interface SellerDashboardProps {
  cakes: Cake[];
  setCakes: React.Dispatch<React.SetStateAction<Cake[]>>;
  orders: Order[];
  updateStatus: (id: string, status: OrderStatus) => void;
}

const SellerDashboard: React.FC<SellerDashboardProps> = ({ cakes, setCakes, orders, updateStatus }) => {
  const [activeTab, setActiveTab] = useState<'PRODUCTS' | 'ORDERS'>('PRODUCTS');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCake, setEditingCake] = useState<Cake | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [formData, setFormData] = useState<Partial<Cake>>({ 
    category: 'Kue Lebaran', 
    price: 0, 
    stock: 10,
    name: '',
    description: ''
  });

  const handleOpenAdd = () => {
    setEditingCake(null);
    setFormData({ category: 'Kue Lebaran', price: 0, stock: 10, name: '', description: '' });
    setErrorMsg('');
    setSuccessMsg('');
    setIsFormOpen(true);
  };

  const handleOpenEdit = (cake: Cake) => {
    setEditingCake(cake);
    setFormData(cake);
    setErrorMsg('');
    setSuccessMsg('');
    setIsFormOpen(true);
  };

  const handleSaveCake = async () => {
    if (!formData.name || formData.price === undefined || formData.price <= 0) {
      setErrorMsg('Nama kue dan harga tidak boleh kosong!');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');
    
    try {
      if (editingCake) {
        // Update ke server
        const response = await fetch(`${API_BASE_URL}/cakes/${editingCake.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: formData.name,
            description: formData.description,
            price: formData.price,
            stock: formData.stock,
            category_id: 1, // Sesuaikan jika perlu
            image_url: formData.image
          })
        });
        
        if (response.ok) {
          setCakes(prev => prev.map(c => c.id === editingCake.id ? { ...c, ...formData } as Cake : c));
          setSuccessMsg('Kue berhasil diperbarui!');
          setTimeout(() => {
            setIsFormOpen(false);
            setSuccessMsg('');
          }, 1500);
        } else {
          setErrorMsg('Gagal memperbarui kue. Silakan coba lagi.');
        }
      } else {
        // Create - simpan ke server
        const response = await fetch(`${API_BASE_URL}/cakes`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: formData.name,
            description: formData.description,
            price: formData.price,
            stock: formData.stock,
            category_id: 1,
            image_url: formData.image || 'https://via.placeholder.com/400'
          })
        });

        if (response.ok) {
          const newCake: Cake = {
            ...formData as Cake,
            id: Date.now().toString(),
            image: formData.image || `https://picsum.photos/seed/${Date.now()}/400/400`,
          };
          setCakes([newCake, ...cakes]);
          setSuccessMsg('Kue berhasil ditambahkan!');
          setTimeout(() => {
            setIsFormOpen(false);
            setSuccessMsg('');
          }, 1500);
        } else {
          setErrorMsg('Gagal menambahkan kue. Silakan coba lagi.');
        }
      }
    } catch (error) {
      setErrorMsg('Terjadi kesalahan: ' + (error as any).message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteCake = async (id: string) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus kue ini?')) return;
    
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/cakes/${id}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        setCakes(cakes.filter(c => c.id !== id));
        setSuccessMsg('Kue berhasil dihapus!');
        setTimeout(() => setSuccessMsg(''), 2000);
      } else {
        setErrorMsg('Gagal menghapus kue.');
      }
    } catch (error) {
      setErrorMsg('Terjadi kesalahan: ' + (error as any).message);
    } finally {
      setIsLoading(false);
    }
  };

  const lowStockCakes = cakes.filter(c => c.stock < 5);
  const processingOrders = orders.filter(o => o.status === OrderStatus.PROCESSING || o.status === OrderStatus.SHIPPED);

  return (
    <div className="space-y-8">
      {/* Header & Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Dashboard Penjual</h1>
          <p className="text-slate-400 text-sm">Kelola produk dan proses pesanan pelanggan di sini.</p>
        </div>
        <div className="flex bg-white p-1 rounded-2xl shadow-sm border border-slate-100">
          <button 
            onClick={() => setActiveTab('PRODUCTS')}
            className={`px-6 py-2.5 rounded-xl font-bold transition-all ${activeTab === 'PRODUCTS' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
          >
            Koleksi Produk
          </button>
          <button 
            onClick={() => setActiveTab('ORDERS')}
            className={`px-6 py-2.5 rounded-xl font-bold transition-all ${activeTab === 'ORDERS' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
          >
            Pesanan Masuk
          </button>
        </div>
      </div>

      {/* Alert Messages */}
      {successMsg && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl font-bold text-sm flex items-center space-x-2">
          <span>✅</span>
          <span>{successMsg}</span>
        </div>
      )}
      {errorMsg && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl font-bold text-sm flex items-center space-x-2">
          <span>❌</span>
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Summary Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className={`p-4 rounded-2xl border-2 flex items-center justify-between ${lowStockCakes.length > 0 ? 'bg-rose-50 border-rose-100' : 'bg-white border-slate-100'}`}>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Peringatan Stok</p>
            <p className="text-sm font-bold">{lowStockCakes.length > 0 ? `${lowStockCakes.length} Kue Hampir Habis!` : 'Stok Aman'}</p>
          </div>
          <span className="text-2xl">{lowStockCakes.length > 0 ? '⚠️' : '✅'}</span>
        </div>
        <div className="p-4 bg-indigo-50 border-2 border-indigo-100 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-indigo-400">Pesanan Aktif</p>
            <p className="text-sm font-bold">{processingOrders.length} Sedang Diproses</p>
          </div>
          <span className="text-2xl">🔥</span>
        </div>
      </div>

      {activeTab === 'PRODUCTS' ? (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-slate-800">Menu Toko ({cakes.length} Produk)</h2>
            <button 
              onClick={handleOpenAdd}
              disabled={isLoading}
              className="bg-pink-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-pink-700 transition shadow-lg shadow-pink-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              + Tambah Kue Baru
            </button>
          </div>

          {isFormOpen && (
            <div className="bg-white p-6 rounded-2xl border-2 border-pink-100 shadow-xl space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
              <h3 className="font-bold text-lg text-slate-800">{editingCake ? 'Ubah Data Kue' : 'Tambah Kue Baru'}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Nama Kue</label>
                  <input placeholder="Nama Kue" className="w-full p-3 border rounded-xl" value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Harga (Rp)</label>
                  <input placeholder="Harga" type="number" className="w-full p-3 border rounded-xl" value={formData.price || ''} onChange={e => setFormData({...formData, price: Number(e.target.value)})} />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Stok</label>
                  <input placeholder="Stok" type="number" className="w-full p-3 border rounded-xl" value={formData.stock || ''} onChange={e => setFormData({...formData, stock: Number(e.target.value)})} />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Kategori</label>
                  <select className="w-full p-3 border rounded-xl" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                    <option>Kue Lebaran</option>
                    <option>Cookies</option>
                    <option>Dessert</option>
                    <option>Classic</option>
                    <option>Pastry</option>
                  </select>
                </div>
                <div className="space-y-1 col-span-1 md:grid-cols-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Deskripsi</label>
                  <textarea placeholder="Deskripsi Singkat" className="w-full p-3 border rounded-xl" value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})} />
                </div>
              </div>
              <div className="flex justify-end space-x-3 pt-2">
                <button onClick={() => { setIsFormOpen(false); setErrorMsg(''); }} className="px-6 py-2 text-slate-400 font-bold hover:text-slate-600" disabled={isLoading}>Batal</button>
                <button onClick={handleSaveCake} disabled={isLoading} className="bg-slate-900 text-white px-8 py-2 rounded-xl font-bold hover:bg-slate-800 transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed">
                  {isLoading ? '⏳ Menyimpan...' : (editingCake ? 'Simpan Perubahan' : 'Simpan ke Katalog')}
                </button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cakes.map(cake => (
              <div key={cake.id} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center space-x-4 group hover:border-pink-200 transition">
                <img src={cake.image} className="w-20 h-20 rounded-xl object-cover" alt={cake.name} />
                <div className="flex-grow">
                  <h4 className="font-bold text-slate-800">{cake.name}</h4>
                  <p className="text-xs text-slate-500 mb-1">Rp {cake.price.toLocaleString()}</p>
                  <div className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-block ${cake.stock < 5 ? 'bg-rose-100 text-rose-600' : 'bg-slate-100 text-slate-500'}`}>
                    Stok: {cake.stock}
                  </div>
                </div>
                <div className="flex flex-col space-y-2">
                  <button 
                    onClick={() => handleOpenEdit(cake)}
                    disabled={isLoading}
                    className="text-slate-400 hover:text-indigo-600 p-2 transition hover:bg-indigo-50 rounded-lg disabled:opacity-50"
                    title="Edit Kue"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button 
                    onClick={() => handleDeleteCake(cake.id)}
                    disabled={isLoading}
                    className="text-slate-400 hover:text-red-600 p-2 transition hover:bg-red-50 rounded-lg disabled:opacity-50"
                    title="Hapus Kue"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-widest">ID Pesanan</th>
                <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Info Customer</th>
                <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Detail</th>
                <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Pembayaran</th>
                <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Status</th>
                <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {orders.filter(o => o.status !== OrderStatus.PENDING_PAYMENT).map(order => (
                <tr key={order.id} className="hover:bg-slate-50/50 transition">
                  <td className="p-4 font-mono text-sm">{order.id}</td>
                  <td className="p-4">
                    {order.customerInfo ? (
                      <div className="space-y-0.5">
                        <p className="text-sm font-bold text-slate-800">{order.customerInfo.name}</p>
                        <p className="text-xs text-slate-500">📱 {order.customerInfo.phone}</p>
                        <p className="text-xs text-slate-500">📍 {order.customerInfo.address}</p>
                      </div>
                    ) : (
                      <p className="text-xs text-slate-400">-</p>
                    )}
                  </td>
                  <td className="p-4">
                    <p className="text-sm font-bold">{order.items.length} Item</p>
                    <p className="text-xs text-slate-500 font-mono">Total: Rp {order.totalAmount.toLocaleString()}</p>
                  </td>
                  <td className="p-4">
                    {order.status === OrderStatus.AWAITING_VERIFICATION ? (
                      <div className="flex items-center space-x-2">
                        <span className="text-xl">⏳</span>
                        <div>
                          <p className="text-xs font-bold text-yellow-600">Menunggu Verifikasi</p>
                          <p className="text-[10px] text-yellow-500">Admin sedang cek bukti</p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <span className="text-xl">✅</span>
                        <div>
                          <p className="text-xs font-bold text-emerald-600">Sudah Dibayar</p>
                          <p className="text-[10px] text-emerald-500">Pembayaran terverifikasi</p>
                        </div>
                      </div>
                    )}
                  </td>
                  <td className="p-4">
                    <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase ${
                      order.status === OrderStatus.PROCESSING ? 'bg-blue-50 text-blue-600 border border-blue-100' :
                      order.status === OrderStatus.SHIPPED ? 'bg-indigo-50 text-indigo-600 border border-indigo-100' :
                      'bg-emerald-50 text-emerald-600 border border-emerald-100'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <select 
                      className="text-sm p-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-100 transition cursor-pointer"
                      onChange={(e) => updateStatus(order.id, e.target.value as OrderStatus)}
                      value={order.status}
                    >
                      <option value={OrderStatus.PROCESSING}>Processing</option>
                      <option value={OrderStatus.SHIPPED}>Shipped</option>
                      <option value={OrderStatus.COMPLETED}>Completed</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {orders.filter(o => o.status !== OrderStatus.PENDING_PAYMENT).length === 0 && (
            <div className="p-20 text-center">
              <span className="text-4xl block mb-2">📦</span>
              <p className="text-slate-400 text-sm font-medium">Belum ada pesanan masuk. Tunggu customer melakukan checkout.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SellerDashboard;
