
import React, { useState } from 'react';
import { Cake } from '../types';

interface ProductDetailViewProps {
  product: Cake;
  onAddToCart: (id: string, q: number) => void;
  onBack: () => void;
}

const ProductDetailView: React.FC<ProductDetailViewProps> = ({ product, onAddToCart, onBack }) => {
  const [quantity, setQuantity] = useState(1);

  const adjustQuantity = (amount: number) => {
    setQuantity(prev => Math.max(1, Math.min(product.stock, prev + amount)));
  };

  return (
    <div className="max-w-6xl mx-auto pb-20 animate-in slide-in-from-right duration-500">
      <button 
        onClick={onBack}
        className="mb-8 flex items-center space-x-2 text-slate-500 hover:text-pink-600 font-bold transition group"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transform group-hover:-translate-x-1 transition" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        <span>Kembali ke Katalog</span>
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 bg-white p-8 md:p-12 rounded-[3rem] shadow-2xl shadow-slate-200 border border-slate-50">
        {/* Product Image */}
        <div className="relative group">
          <div className="aspect-square rounded-[2rem] overflow-hidden shadow-xl border-8 border-slate-50">
            <img 
              src={product.image} 
              alt={product.name} 
              className="w-full h-full object-cover group-hover:scale-105 transition duration-1000" 
            />
          </div>
          <div className="absolute top-8 right-8 bg-pink-600 text-white px-5 py-2 rounded-2xl font-black shadow-xl ring-4 ring-white">
            Rp {product.price.toLocaleString('id-ID')}
          </div>
        </div>

        {/* Product Info */}
        <div className="flex flex-col justify-center space-y-8">
          <div className="space-y-4">
            <div className="inline-block px-4 py-1 bg-pink-50 text-pink-600 rounded-full text-xs font-black uppercase tracking-widest border border-pink-100">
              {product.category}
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight">{product.name}</h1>
            <div className="flex items-center space-x-4">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="h-5 w-5 fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-sm font-bold text-slate-400">4.9 (120+ Reviews)</span>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-black text-slate-800 uppercase text-xs tracking-widest">Deskripsi Kue</h3>
            <p className="text-slate-500 leading-relaxed text-lg">
              {product.description}
              <br/><br/>
              Dibuat setiap hari dengan bahan-bahan organik premium. Tanpa bahan pengawet dan menggunakan pemanis alami. Sangat cocok untuk acara keluarga, hadiah ulang tahun, atau sekedar teman minum kopi di sore hari.
            </p>
          </div>

          <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Ketersediaan</p>
              <p className={`font-bold ${product.stock > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                {product.stock > 0 ? `Siap Dipesan (${product.stock} Stok)` : 'Stok Habis'}
              </p>
            </div>
            
            <div className="flex items-center bg-white rounded-2xl p-1.5 shadow-sm border border-slate-200">
              <button 
                onClick={() => adjustQuantity(-1)}
                className="w-12 h-12 flex items-center justify-center text-slate-400 hover:text-pink-600 hover:bg-pink-50 rounded-xl transition-all font-black text-xl"
              >
                -
              </button>
              <span className="w-12 text-center text-lg font-black text-slate-800">{quantity}</span>
              <button 
                onClick={() => adjustQuantity(1)}
                className="w-12 h-12 flex items-center justify-center text-slate-400 hover:text-pink-600 hover:bg-pink-50 rounded-xl transition-all font-black text-xl"
                disabled={quantity >= product.stock}
              >
                +
              </button>
            </div>
          </div>

          <div className="pt-4">
            <button 
              onClick={() => {
                onAddToCart(product.id, quantity);
                setQuantity(1);
              }}
              disabled={product.stock <= 0}
              className="w-full bg-pink-600 text-white py-5 rounded-[2rem] font-black text-xl hover:bg-pink-700 transition-all flex items-center justify-center space-x-4 shadow-2xl shadow-pink-200 active:scale-95 disabled:opacity-50"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 100-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3z" />
              </svg>
              <span>Tambahkan ke Keranjang</span>
            </button>
          </div>
        </div>
      </div>

      {/* Trust Badges */}
      <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6">
        {[
          { icon: '🛡️', title: 'Higienis', sub: 'Proses Steril' },
          { icon: '🥚', title: 'Premium', sub: 'Bahan Pilihan' },
          { icon: '🚚', title: 'Aman', sub: 'Packaging Rapi' },
          { icon: '✨', title: 'Fresh', sub: 'Dipanggang Hari Ini' },
        ].map((badge, i) => (
          <div key={i} className="bg-white p-5 rounded-3xl border border-slate-50 text-center space-y-1 shadow-sm">
            <div className="text-2xl">{badge.icon}</div>
            <h4 className="font-bold text-slate-800 text-sm">{badge.title}</h4>
            <p className="text-[10px] text-slate-400 font-bold uppercase">{badge.sub}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductDetailView;
