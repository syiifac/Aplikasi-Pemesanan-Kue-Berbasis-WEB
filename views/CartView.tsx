
import React from 'react';
import { Cake, CartItem } from '../types';

interface CartViewProps {
  cart: CartItem[];
  cakes: Cake[];
  onRemove: (id: string) => void;
  onUpdateQuantity: (id: string, q: number) => void;
  onCheckout: () => void;
  onBack?: () => void;
}

const CartView: React.FC<CartViewProps> = ({ cart, cakes, onRemove, onUpdateQuantity, onCheckout, onBack }) => {
  const cartCakes = cart.map(item => {
    const cake = cakes.find(c => c.id === item.cakeId)!;
    return { ...item, ...cake };
  });

  const total = cartCakes.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  if (cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-6">
        <div className="text-8xl">🛒</div>
        <h2 className="text-3xl font-bold">Keranjang Kosong</h2>
        <p className="text-slate-500">Wah, sepertinya kamu belum memilih kue apapun.</p>
        <button className="bg-pink-600 text-white px-8 py-3 rounded-full font-bold">Mulai Belanja</button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-extrabold text-slate-800">Keranjang Belanja</h1>
        <div className="flex items-center space-x-4">
          <span className="bg-slate-100 px-4 py-1 rounded-full text-xs font-bold text-slate-500">
            {cart.length} Jenis Kue
          </span>
          {onBack && (
            <button 
              onClick={onBack}
              className="text-slate-500 hover:text-pink-600 font-bold transition"
            >
              ← Kembali
            </button>
          )}
        </div>
      </div>
      
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="divide-y divide-slate-100">
          {cartCakes.map(item => (
            <div key={item.id} className="p-6 flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
              <img src={item.image} className="w-24 h-24 object-cover rounded-2xl shadow-sm" alt={item.name} />
              <div className="flex-grow text-center sm:text-left">
                <h3 className="text-lg font-bold text-slate-800">{item.name}</h3>
                <p className="text-slate-400 text-sm mb-2">{item.category}</p>
                <div className="text-pink-600 font-extrabold">Rp {item.price.toLocaleString('id-ID')}</div>
              </div>
              
              <div className="flex items-center space-x-6">
                {/* Quantity Controls in Cart */}
                <div className="flex items-center bg-slate-50 rounded-xl p-1 border border-slate-100">
                  <button 
                    onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                    className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-pink-600 hover:bg-white rounded-lg transition shadow-sm"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                    </svg>
                  </button>
                  <span className="w-12 text-center text-sm font-black text-slate-800">{item.quantity}</span>
                  <button 
                    onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                    className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-pink-600 hover:bg-white rounded-lg transition shadow-sm"
                    disabled={item.quantity >= item.stock}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                </div>

                <div className="text-right min-w-[100px] hidden md:block">
                  <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Subtotal</p>
                  <p className="font-bold text-slate-800 text-lg">Rp {(item.price * item.quantity).toLocaleString('id-ID')}</p>
                </div>

                <button 
                  onClick={() => onRemove(item.id)}
                  className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition"
                  title="Hapus"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-slate-900 text-white p-8 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl shadow-slate-200">
        <div className="space-y-1 text-center md:text-left">
          <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">Total Bayar</p>
          <h2 className="text-4xl font-black tracking-tight">Rp {total.toLocaleString('id-ID')}</h2>
        </div>
        <button 
          onClick={onCheckout}
          className="bg-pink-600 hover:bg-pink-500 text-white px-12 py-4 rounded-2xl font-black text-xl transition-all transform hover:scale-105 active:scale-95 shadow-xl shadow-pink-900/40 w-full md:w-auto"
        >
          Lanjut ke Pembayaran
        </button>
      </div>

      <div className="bg-indigo-50 border border-indigo-100 p-6 rounded-2xl flex items-start space-x-4">
        <div className="bg-indigo-600 p-2 rounded-lg text-white">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="space-y-1">
          <h4 className="font-bold text-indigo-900">Instruksi Pembayaran</h4>
          <p className="text-indigo-700 text-sm leading-relaxed">Setelah klik checkout, Anda akan diarahkan untuk mengunggah bukti transfer. Pastikan nominal transfer sesuai dengan total di atas agar verifikasi berjalan cepat.</p>
        </div>
      </div>
    </div>
  );
};

export default CartView;
