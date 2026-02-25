
import React, { useState } from 'react';
import { User, Order, OrderStatus, UserRole, Cake } from '../types';
import { API_BASE_URL } from '../services/apiService';
import { generateOrdersReport, generateSalesReport, generateInventoryReport } from '../services/pdfService';

interface AdminDashboardProps {
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  orders: Order[];
  cakes?: Cake[];
  onVerify: (orderId: string) => void;
  onBack?: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ users, setUsers, orders, cakes = [], onVerify, onBack }) => {
  const [activeTab, setActiveTab] = useState<'VERIFICATION' | 'REPORTS' | 'USERS'>('VERIFICATION');
  const [isUserFormOpen, setIsUserFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [userFormData, setUserFormData] = useState<Partial<User>>({
    name: '',
    email: '',
    role: UserRole.CUSTOMER
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [selectedPaymentProof, setSelectedPaymentProof] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  
  const pendingVerifications = orders.filter(o => o.status === OrderStatus.AWAITING_VERIFICATION);
  const totalTransactions = orders.reduce((acc, o) => acc + o.totalAmount, 0);

  // Fetch users from backend when tab is opened
  React.useEffect(() => {
    if (activeTab === 'USERS') {
      loadUsersFromBackend();
    }
  }, [activeTab]);

  const loadUsersFromBackend = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/users`);
      const data = await response.json();
      
      if (response.ok && data.success) {
        setUsers(data.data);
      }
    } catch (error) {
      console.error('Error loading users:', error);
    }
  };

  const handleOpenAddUser = () => {
    setEditingUser(null);
    setUserFormData({ name: '', email: '', role: UserRole.CUSTOMER });
    setIsUserFormOpen(true);
    setErrorMsg('');
    setSuccessMsg('');
  };

  const handleOpenEditUser = (user: User) => {
    setEditingUser(user);
    setUserFormData(user);
    setIsUserFormOpen(true);
    setErrorMsg('');
    setSuccessMsg('');
  };

  const handleSaveUser = async () => {
    if (!userFormData.name || !userFormData.email) {
      setErrorMsg('Nama dan email wajib diisi');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      if (editingUser) {
        // Update existing user
        const response = await fetch(`${API_BASE_URL}/users/${editingUser.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(userFormData)
        });

        const data = await response.json();

        if (response.ok && data.success) {
          setUsers(prev => prev.map(u => u.id === editingUser.id ? data.data : u));
          setSuccessMsg('User berhasil diupdate!');
          setTimeout(() => {
            setIsUserFormOpen(false);
            setSuccessMsg('');
          }, 1500);
        } else {
          setErrorMsg(data.message || 'Gagal mengupdate user');
        }
      } else {
        // Create new user
        const response = await fetch(`${API_BASE_URL}/users`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...userFormData,
            password: '123456' // Default password
          })
        });

        const data = await response.json();

        if (response.ok && data.success) {
          setUsers(prev => [...prev, data.data]);
          setSuccessMsg('User berhasil dibuat!');
          setTimeout(() => {
            setIsUserFormOpen(false);
            setSuccessMsg('');
          }, 1500);
        } else {
          setErrorMsg(data.message || 'Gagal membuat user');
        }
      }
    } catch (error) {
      // Fallback to local state
      if (editingUser) {
        setUsers(prev => prev.map(u => u.id === editingUser.id ? { ...u, ...userFormData } as User : u));
      } else {
        const newUser: User = {
          ...userFormData as User,
          id: `u-${Date.now()}`
        };
        setUsers([...users, newUser]);
      }
      setSuccessMsg('User berhasil disimpan (mode offline)');
      setTimeout(() => {
        setIsUserFormOpen(false);
        setSuccessMsg('');
      }, 1500);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteUser = async (userId: string) => {
    if (!confirm('Yakin ingin menghapus pengguna ini?')) return;

    setIsLoading(true);
    setErrorMsg('');

    try {
      const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
        method: 'DELETE'
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setUsers(users.filter(u => u.id !== userId));
        setSuccessMsg('User berhasil dihapus!');
        setTimeout(() => setSuccessMsg(''), 2000);
      } else {
        setErrorMsg(data.message || 'Gagal menghapus user');
      }
    } catch (error) {
      // Fallback to local state
      setUsers(users.filter(u => u.id !== userId));
      setSuccessMsg('User dihapus (mode offline)');
      setTimeout(() => setSuccessMsg(''), 2000);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-10">
      {/* Header with Back Button */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-black text-slate-800">Admin Panel</h1>
        {onBack && (
          <button 
            onClick={onBack}
            className="flex items-center space-x-2 text-slate-500 hover:text-pink-600 font-bold transition"
          >
            <span>← Kembali ke Beranda</span>
          </button>
        )}
      </div>

      {/* Stats Header */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center space-x-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">👥</div>
          <div>
            <p className="text-sm text-slate-400 font-bold uppercase tracking-widest">Total Pengguna</p>
            <h3 className="text-2xl font-black">{users.length}</h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center space-x-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">💰</div>
          <div>
            <p className="text-sm text-slate-400 font-bold uppercase tracking-widest">Total Penjualan</p>
            <h3 className="text-2xl font-black">Rp {totalTransactions.toLocaleString()}</h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center space-x-4">
          <div className="p-3 bg-pink-50 text-pink-600 rounded-xl">📋</div>
          <div>
            <p className="text-sm text-slate-400 font-bold uppercase tracking-widest">Pending Verifikasi</p>
            <h3 className="text-2xl font-black">{pendingVerifications.length}</h3>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex space-x-4 border-b pb-1 overflow-x-auto">
        <button 
          onClick={() => setActiveTab('VERIFICATION')}
          className={`pb-4 px-2 text-sm font-bold transition whitespace-nowrap ${activeTab === 'VERIFICATION' ? 'text-pink-600 border-b-2 border-pink-600' : 'text-slate-400 hover:text-slate-600'}`}
        >
          Verifikasi Pembayaran
        </button>
        <button 
          onClick={() => setActiveTab('USERS')}
          className={`pb-4 px-2 text-sm font-bold transition whitespace-nowrap ${activeTab === 'USERS' ? 'text-pink-600 border-b-2 border-pink-600' : 'text-slate-400 hover:text-slate-600'}`}
        >
          Kelola Pengguna
        </button>
        <button 
          onClick={() => setActiveTab('REPORTS')}
          className={`pb-4 px-2 text-sm font-bold transition whitespace-nowrap ${activeTab === 'REPORTS' ? 'text-pink-600 border-b-2 border-pink-600' : 'text-slate-400 hover:text-slate-600'}`}
        >
          Laporan Transaksi
        </button>
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

      {activeTab === 'VERIFICATION' && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold flex items-center text-slate-800">
            Verifikasi Pembayaran 
            <span className="ml-3 bg-pink-500 text-white text-xs px-2 py-0.5 rounded-full">{pendingVerifications.length}</span>
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {pendingVerifications.map(order => (
              <div key={order.id} className="bg-white p-6 rounded-2xl border shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="w-full sm:w-32 h-32 flex-shrink-0 relative group">
                    <img src={order.paymentProof} className="w-full h-full object-cover rounded-xl border cursor-pointer hover:opacity-80 transition" alt="Bukti Transfer" onClick={() => { setSelectedPaymentProof(order.paymentProof); setSelectedOrder(order); }} />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition rounded-xl flex items-center justify-center cursor-pointer" onClick={() => { setSelectedPaymentProof(order.paymentProof); setSelectedOrder(order); }}>
                      <span className="text-white opacity-0 group-hover:opacity-100 font-bold text-xs">🔍 Lihat Detail</span>
                    </div>
                  </div>
                  <div className="flex-grow space-y-3">
                    <div>
                      <p className="font-mono text-xs text-slate-400">{order.id}</p>
                      <h4 className="font-bold text-lg text-slate-800">Rp {order.totalAmount.toLocaleString()}</h4>
                    </div>
                    <div className="space-y-1 text-sm">
                      <p className="text-slate-600"><span className="font-medium">Item:</span> {order.items.length} barang</p>
                      <p className="text-slate-600"><span className="font-medium">Tanggal:</span> {new Date(order.createdAt).toLocaleDateString('id-ID')}</p>
                    </div>
                  </div>
                </div>
                {order.customerInfo && (
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-1 text-sm">
                    <p className="font-bold text-slate-700">Informasi Pembeli</p>
                    <p className="text-slate-600">👤 {order.customerInfo.name}</p>
                    <p className="text-slate-600">📱 {order.customerInfo.phone}</p>
                    <p className="text-slate-600">📍 {order.customerInfo.address}</p>
                  </div>
                )}
                <div className="flex space-x-2 pt-2">
                  <button 
                    onClick={() => onVerify(order.id)}
                    className="flex-1 bg-emerald-600 text-white px-4 py-2.5 rounded-lg text-sm font-bold hover:bg-emerald-700 transition shadow-sm"
                  >
                    ✓ Terima & Verifikasi
                  </button>
                  <button className="flex-1 bg-red-100 text-red-600 px-4 py-2.5 rounded-lg text-sm font-bold hover:bg-red-200 transition">
                    ✕ Tolak Pembayaran
                  </button>
                </div>
              </div>
            ))}
            {pendingVerifications.length === 0 && (
              <div className="col-span-full py-12 text-center bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 text-slate-400">
                Tidak ada bukti transfer yang menunggu verifikasi.
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'USERS' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-slate-800">Data Pengguna</h2>
            <button 
              onClick={handleOpenAddUser}
              className="bg-slate-900 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-slate-800 transition shadow-lg"
            >
              + Tambah Pengguna
            </button>
          </div>

          {isUserFormOpen && (
            <div className="bg-white p-6 rounded-2xl border-2 border-slate-100 shadow-xl space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
              <h3 className="font-bold text-lg text-slate-800">{editingUser ? 'Ubah Data Pengguna' : 'Tambah Pengguna Baru'}</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Nama Lengkap</label>
                  <input placeholder="Nama" className="w-full p-3 border rounded-xl" value={userFormData.name || ''} onChange={e => setUserFormData({...userFormData, name: e.target.value})} />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Email</label>
                  <input placeholder="Email" className="w-full p-3 border rounded-xl" value={userFormData.email || ''} onChange={e => setUserFormData({...userFormData, email: e.target.value})} />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Peran (Role)</label>
                  <select className="w-full p-3 border rounded-xl" value={userFormData.role} onChange={e => setUserFormData({...userFormData, role: e.target.value as UserRole})}>
                    <option value={UserRole.CUSTOMER}>Customer</option>
                    <option value={UserRole.SELLER}>Seller</option>
                    <option value={UserRole.ADMIN}>Admin</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end space-x-3 pt-2">
                <button 
                  onClick={() => { setIsUserFormOpen(false); setErrorMsg(''); setSuccessMsg(''); }} 
                  className="px-6 py-2 text-slate-400 font-bold hover:text-slate-600"
                  disabled={isLoading}
                >
                  Batal
                </button>
                <button 
                  onClick={handleSaveUser} 
                  className="bg-pink-600 text-white px-8 py-2 rounded-xl font-bold hover:bg-pink-700 transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isLoading}
                >
                  {isLoading ? '⏳ Menyimpan...' : (editingUser ? 'Update User' : 'Simpan User')}
                </button>
              </div>
            </div>
          )}

          <div className="bg-white rounded-2xl border overflow-hidden shadow-sm overflow-x-auto">
            <table className="w-full text-left min-w-[600px]">
              <thead className="bg-slate-50 border-b">
                <tr>
                  <th className="p-4 text-xs font-bold text-slate-400 uppercase">Nama</th>
                  <th className="p-4 text-xs font-bold text-slate-400 uppercase">Email</th>
                  <th className="p-4 text-xs font-bold text-slate-400 uppercase">Peran</th>
                  <th className="p-4 text-xs font-bold text-slate-400 uppercase text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {users.map(u => (
                  <tr key={u.id} className="hover:bg-slate-50/50 transition">
                    <td className="p-4">
                      <div className="font-bold text-slate-800">{u.name}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{u.id}</div>
                    </td>
                    <td className="p-4 text-sm text-slate-500">{u.email}</td>
                    <td className="p-4">
                      <span className={`text-[10px] font-bold px-2 py-1 rounded-full border ${
                        u.role === UserRole.ADMIN ? 'bg-pink-50 border-pink-200 text-pink-600' : 
                        u.role === UserRole.SELLER ? 'bg-indigo-50 border-indigo-200 text-indigo-600' :
                        'bg-slate-50 border-slate-200 text-slate-500'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end space-x-2">
                        <button 
                          onClick={() => handleOpenEditUser(u)}
                          className="p-2 text-slate-400 hover:text-indigo-600 transition hover:bg-indigo-50 rounded-lg"
                          disabled={isLoading}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button 
                          onClick={() => deleteUser(u.id)}
                          className="p-2 text-slate-400 hover:text-red-600 transition hover:bg-red-50 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed"
                          disabled={u.email === 'admin@sweetbites.com' || isLoading}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'REPORTS' && (
        <div className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-slate-800">Laporan Transaksi</h2>
            <p className="text-sm text-slate-500">Ringkasan semua transaksi pembelian di sistem</p>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl">
              <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest">Total Order</p>
              <p className="text-2xl font-black text-emerald-700 mt-1">{orders.length}</p>
            </div>
            <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl">
              <p className="text-xs font-bold text-blue-600 uppercase tracking-widest">Completed</p>
              <p className="text-2xl font-black text-blue-700 mt-1">{orders.filter(o => o.status === OrderStatus.COMPLETED).length}</p>
            </div>
            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-xl">
              <p className="text-xs font-bold text-yellow-600 uppercase tracking-widest">Processing</p>
              <p className="text-2xl font-black text-yellow-700 mt-1">{orders.filter(o => o.status === OrderStatus.PROCESSING || o.status === OrderStatus.SHIPPED).length}</p>
            </div>
            <div className="bg-pink-50 border border-pink-200 p-4 rounded-xl">
              <p className="text-xs font-bold text-pink-600 uppercase tracking-widest">Revenue</p>
              <p className="text-2xl font-black text-pink-700 mt-1">Rp {(totalTransactions).toLocaleString()}</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border overflow-hidden shadow-sm overflow-x-auto">
            <table className="w-full text-left min-w-[700px]">
              <thead className="bg-slate-50 border-b">
                <tr>
                  <th className="p-4 text-xs font-bold text-slate-400 uppercase">Order ID</th>
                  <th className="p-4 text-xs font-bold text-slate-400 uppercase">Tanggal</th>
                  <th className="p-4 text-xs font-bold text-slate-400 uppercase">Pembeli</th>
                  <th className="p-4 text-xs font-bold text-slate-400 uppercase">Total</th>
                  <th className="p-4 text-xs font-bold text-slate-400 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {orders.slice().reverse().map(o => (
                  <tr key={o.id} className="hover:bg-slate-50/50 transition">
                    <td className="p-4 font-mono text-xs text-slate-500">{o.id}</td>
                    <td className="p-4 text-sm text-slate-600 whitespace-nowrap">{new Date(o.createdAt).toLocaleDateString('id-ID')}</td>
                    <td className="p-4">
                      <div className="space-y-0.5">
                        <p className="text-sm font-bold text-slate-800">{o.customerInfo?.name || 'N/A'}</p>
                        <p className="text-xs text-slate-500">{o.userId}</p>
                      </div>
                    </td>
                    <td className="p-4 text-sm font-black text-slate-900">Rp {o.totalAmount.toLocaleString()}</td>
                    <td className="p-4">
                      <span className={`text-[10px] font-bold px-3 py-1 rounded-full border ${
                        o.status === OrderStatus.COMPLETED ? 'bg-emerald-50 border-emerald-200 text-emerald-600' :
                        o.status === OrderStatus.PROCESSING || o.status === OrderStatus.SHIPPED ? 'bg-blue-50 border-blue-200 text-blue-600' :
                        o.status === OrderStatus.AWAITING_VERIFICATION ? 'bg-yellow-50 border-yellow-200 text-yellow-600' :
                        'bg-slate-50 border-slate-200 text-slate-500'
                      }`}>
                        {o.status.replace(/_/g, ' ')}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {orders.length === 0 && (
              <div className="p-12 text-center text-slate-400">Belum ada data transaksi.</div>
            )}
          </div>
        </div>
      )}

      {/* Payment Proof Modal */}
      {selectedPaymentProof && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4" onClick={() => { setSelectedPaymentProof(null); setSelectedOrder(null); }}>
          <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between z-10 rounded-t-3xl">
              <h3 className="text-xl font-black text-slate-800">Detail Bukti Pembayaran</h3>
              <button onClick={() => { setSelectedPaymentProof(null); setSelectedOrder(null); }} className="text-slate-400 hover:text-slate-600 text-2xl leading-none">×</button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Payment Proof Image */}
              <div className="bg-slate-50 rounded-2xl p-4 border-2 border-slate-200">
                <img src={selectedPaymentProof} alt="Bukti Transfer" className="w-full h-auto rounded-xl shadow-lg" />
              </div>

              {/* Order Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-pink-50 p-4 rounded-xl border border-pink-100 space-y-2">
                  <p className="text-xs font-bold text-pink-600 uppercase tracking-widest">Informasi Order</p>
                  <div className="space-y-1">
                    <p className="text-sm"><span className="font-bold">Order ID:</span> <span className="font-mono text-slate-600">{selectedOrder.id}</span></p>
                    <p className="text-sm"><span className="font-bold">Total Pembayaran:</span> <span className="text-pink-600 font-black text-lg">Rp {selectedOrder.totalAmount.toLocaleString()}</span></p>
                    <p className="text-sm"><span className="font-bold">Jumlah Item:</span> {selectedOrder.items.length} barang</p>
                    <p className="text-sm"><span className="font-bold">Tanggal Order:</span> {new Date(selectedOrder.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                  </div>
                </div>

                {selectedOrder.customerInfo && (
                  <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 space-y-2">
                    <p className="text-xs font-bold text-blue-600 uppercase tracking-widest">Informasi Pembeli</p>
                    <div className="space-y-1">
                      <p className="text-sm"><span className="font-bold">👤 Nama:</span> {selectedOrder.customerInfo.name}</p>
                      <p className="text-sm"><span className="font-bold">📱 Telepon:</span> {selectedOrder.customerInfo.phone}</p>
                      <p className="text-sm"><span className="font-bold">📍 Alamat:</span> {selectedOrder.customerInfo.address}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Order Items */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                <p className="text-xs font-bold text-slate-600 uppercase tracking-widest">Daftar Produk</p>
                <div className="space-y-2">
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center bg-white p-3 rounded-lg border">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center text-xl">🍰</div>
                        <div>
                          <p className="font-bold text-sm text-slate-800">{item.name}</p>
                          <p className="text-xs text-slate-500">Qty: {item.quantity} × Rp {item.price.toLocaleString()}</p>
                        </div>
                      </div>
                      <p className="font-bold text-slate-800">Rp {(item.price * item.quantity).toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3 pt-4">
                <button onClick={() => { onVerify(selectedOrder.id); setSelectedPaymentProof(null); setSelectedOrder(null); }} className="flex-1 bg-emerald-600 text-white px-6 py-3 rounded-xl text-base font-bold hover:bg-emerald-700 transition shadow-lg">
                  ✓ Terima & Verifikasi
                </button>
                <button onClick={() => { setSelectedPaymentProof(null); setSelectedOrder(null); }} className="flex-1 bg-red-500 text-white px-6 py-3 rounded-xl text-base font-bold hover:bg-red-600 transition shadow-lg">
                  ✕ Tolak Pembayaran
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* REPORTS TAB */}
      {activeTab === 'REPORTS' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Orders Report Card */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 space-y-4">
              <div className="flex items-center space-x-3">
                <span className="text-4xl">📋</span>
                <h3 className="text-xl font-black text-slate-800">Laporan Pesanan</h3>
              </div>
              <p className="text-sm text-slate-500">Download laporan detail semua pesanan dalam format PDF dengan informasi pelanggan, tanggal, dan status.</p>
              <button 
                onClick={() => {
                  const dateStr = new Date().toISOString().split('T')[0];
                  const filename = 'laporan-pesanan-' + dateStr + '.pdf';
                  generateOrdersReport(orders, filename);
                }}
                className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition shadow-lg"
              >
                📥 Download PDF
              </button>
            </div>

            {/* Sales Report Card */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 space-y-4">
              <div className="flex items-center space-x-3">
                <span className="text-4xl">💰</span>
                <h3 className="text-xl font-black text-slate-800">Laporan Penjualan</h3>
              </div>
              <p className="text-sm text-slate-500">Download ringkasan penjualan dengan total revenue, jumlah pesanan, dan top products yang laris terjual.</p>
              <button 
                onClick={() => {
                  const dateStr = new Date().toISOString().split('T')[0];
                  const filename = 'laporan-penjualan-' + dateStr + '.pdf';
                  generateSalesReport(orders, cakes, filename);
                }}
                className="w-full bg-emerald-600 text-white py-3 rounded-xl font-bold hover:bg-emerald-700 transition shadow-lg"
              >
                📥 Download PDF
              </button>
            </div>

            {/* Inventory Report Card */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 space-y-4">
              <div className="flex items-center space-x-3">
                <span className="text-4xl">📦</span>
                <h3 className="text-xl font-black text-slate-800">Laporan Inventaris</h3>
              </div>
              <p className="text-sm text-slate-500">Download laporan stok semua produk dengan nilai inventaris dan peringatan stok rendah (&lt; 10 unit).</p>
              <button 
                onClick={() => {
                  const dateStr = new Date().toISOString().split('T')[0];
                  const filename = 'laporan-inventaris-' + dateStr + '.pdf';
                  generateInventoryReport(cakes, filename);
                }}
                className="w-full bg-purple-600 text-white py-3 rounded-xl font-bold hover:bg-purple-700 transition shadow-lg"
              >
                📥 Download PDF
              </button>
            </div>
          </div>

          {/* Report Info Section */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-8 rounded-2xl border border-slate-100 space-y-4">
            <h3 className="text-lg font-black text-slate-800">ℹ️ Informasi Laporan</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h4 className="font-bold text-slate-700 mb-2">Laporan Pesanan</h4>
                <ul className="text-sm text-slate-600 space-y-1">
                  <li>✓ Daftar semua pesanan</li>
                  <li>✓ Nama pelanggan</li>
                  <li>✓ Tanggal pesanan</li>
                  <li>✓ Total harga</li>
                  <li>✓ Status pesanan</li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-slate-700 mb-2">Laporan Penjualan</h4>
                <ul className="text-sm text-slate-600 space-y-1">
                  <li>✓ Total revenue</li>
                  <li>✓ Pesanan selesai</li>
                  <li>✓ Pesanan pending</li>
                  <li>✓ Top 10 produk</li>
                  <li>✓ Detail kategori produk</li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-slate-700 mb-2">Laporan Inventaris</h4>
                <ul className="text-sm text-slate-600 space-y-1">
                  <li>✓ Semua produk</li>
                  <li>✓ Stok per produk</li>
                  <li>✓ Nilai inventaris</li>
                  <li>✓ Peringatan stok rendah</li>
                  <li>✓ Total nilai stok</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
