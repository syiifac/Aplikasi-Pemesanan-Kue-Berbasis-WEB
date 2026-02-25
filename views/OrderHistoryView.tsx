
import React from 'react';
import { Order, OrderStatus } from '../types';

interface OrderHistoryViewProps {
  orders: Order[];
  onUploadProof: (orderId: string, proof: string) => void;
  onBack?: () => void;
}

const OrderHistoryView: React.FC<OrderHistoryViewProps> = ({ orders, onUploadProof, onBack }) => {
  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PENDING_PAYMENT: return 'bg-amber-100 text-amber-700';
      case OrderStatus.AWAITING_VERIFICATION: return 'bg-blue-100 text-blue-700';
      case OrderStatus.PROCESSING: return 'bg-indigo-100 text-indigo-700';
      case OrderStatus.SHIPPED: return 'bg-purple-100 text-purple-700';
      case OrderStatus.COMPLETED: return 'bg-emerald-100 text-emerald-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  const handleFileChange = (orderId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onUploadProof(orderId, reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  if (orders.length === 0) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-slate-400">Belum ada pesanan.</h2>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-extrabold">Pesanan Saya</h1>
        {onBack && (
          <button 
            onClick={onBack}
            className="flex items-center space-x-2 text-slate-500 hover:text-pink-600 font-bold transition group"
          >
            <span>← Kembali</span>
          </button>
        )}
      </div>
      
      <div className="space-y-6">
        {orders.map(order => (
          <div key={order.id} className="bg-white rounded-2xl border shadow-sm overflow-hidden">
            <div className="p-6 flex flex-col md:flex-row justify-between gap-4 border-b bg-slate-50/50">
              <div className="space-y-1">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">ID Pesanan</span>
                <p className="font-mono font-bold">{order.id}</p>
                <p className="text-xs text-slate-400">{new Date(order.createdAt).toLocaleDateString('id-ID', { dateStyle: 'long' })}</p>
              </div>
              <div className="flex flex-col md:items-end space-y-2">
                <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide ${getStatusColor(order.status)}`}>
                  {order.status.replace(/_/g, ' ')}
                </span>
                <p className="text-xl font-black text-slate-900">Rp {order.totalAmount.toLocaleString('id-ID')}</p>
              </div>
            </div>
            
            <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="space-y-4">
                  <h4 className="font-bold text-slate-800">Item Pesanan</h4>
                  <ul className="space-y-2">
                    {order.items.map((item, idx) => (
                      <li key={idx} className="flex justify-between text-sm">
                        <span className="text-slate-600">{item.name} x {item.quantity}</span>
                        <span className="font-bold">Rp {(item.price * item.quantity).toLocaleString('id-ID')}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {order.customerInfo && (
                  <div className="space-y-3 p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <h4 className="font-bold text-slate-800 text-sm">Informasi Pengiriman</h4>
                    <div className="space-y-1.5 text-sm">
                      <p className="text-slate-600"><span className="font-medium">Nama:</span> {order.customerInfo.name}</p>
                      <p className="text-slate-600"><span className="font-medium">No HP:</span> {order.customerInfo.phone}</p>
                      <p className="text-slate-600"><span className="font-medium">Alamat:</span> {order.customerInfo.address}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <h4 className="font-bold text-slate-800">Pembayaran</h4>
                {order.status === OrderStatus.PENDING_PAYMENT ? (
                  <div className="bg-white p-4 border-2 border-dashed border-slate-200 rounded-xl space-y-4">
                    <p className="text-xs text-slate-500">Silakan transfer ke BCA 12345678 a/n Sweet Bites Bakery lalu upload bukti transfer di sini.</p>
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={(e) => handleFileChange(order.id, e)}
                      className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-pink-50 file:text-pink-700 hover:file:bg-pink-100"
                    />
                  </div>
                ) : (
                  <div className="flex items-center space-x-4">
                    {order.paymentProof && (
                      <img src={order.paymentProof} alt="Bukti Transfer" className="w-20 h-20 object-cover rounded-lg border shadow-sm" />
                    )}
                    <div className="text-sm">
                      <p className="font-medium text-slate-700">Bukti transfer terkirim</p>
                      <p className="text-slate-500 text-xs">Menunggu verifikasi admin</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderHistoryView;
