
import React, { useState, useMemo } from 'react';
import { Cake } from '../types';

interface CatalogViewProps {
  cakes: Cake[];
  onAddToCart: (id: string, q: number) => void;
  onViewDetail: (id: string) => void;
}

const CatalogView: React.FC<CatalogViewProps> = ({ cakes, onAddToCart, onViewDetail }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');

  const categories = useMemo(() => {
    return ['Semua', ...Array.from(new Set(cakes.map(c => c.category)))];
  }, [cakes]);

  const filteredCakes = useMemo(() => {
    return cakes.filter(cake => {
      const matchesSearch = cake.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            cake.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'Semua' || cake.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [cakes, searchQuery, selectedCategory]);

  return (
    <div className="space-y-12 pb-20 animate-in fade-in duration-500">
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <h1 className="text-5xl font-black text-slate-900 tracking-tight">Katalog Produk</h1>
        <p className="text-slate-500 font-medium">Pilih kue favoritmu dari berbagai kategori terbaik kami.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-6 items-center justify-between bg-white p-6 rounded-3xl border shadow-sm">
        {/* Search */}
        <div className="relative w-full md:w-96">
          <input 
            type="text" 
            placeholder="Cari kue idamanmu..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 rounded-2xl border-2 border-slate-50 focus:border-pink-500 focus:outline-none transition-all font-medium"
          />
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        {/* Categories */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-6 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat 
                ? 'bg-pink-600 text-white shadow-lg shadow-pink-100' 
                : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {filteredCakes.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredCakes.map(cake => (
            <div key={cake.id} className="bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-slate-100 group flex flex-col">
              <div className="relative h-64 overflow-hidden cursor-pointer" onClick={() => onViewDetail(cake.id)}>
                <img src={cake.image} alt={cake.name} className="w-full h-full object-cover group-hover:scale-110 transition duration-700" />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-4 py-1.5 rounded-full text-xs font-black text-pink-600 shadow-sm">
                  Stok: {cake.stock}
                </div>
              </div>
              <div className="p-6 flex-grow space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{cake.category}</span>
                  <span className="text-lg font-black text-slate-900">Rp {cake.price.toLocaleString('id-ID')}</span>
                </div>
                <h3 className="text-xl font-bold text-slate-800 group-hover:text-pink-600 transition cursor-pointer leading-tight" onClick={() => onViewDetail(cake.id)}>{cake.name}</h3>
                <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed">{cake.description}</p>
              </div>
              <div className="p-6 pt-0">
                <button 
                  onClick={() => onAddToCart(cake.id, 1)}
                  className="w-full bg-slate-900 text-white py-3.5 rounded-2xl font-black hover:bg-pink-600 transition-all flex items-center justify-center space-x-2 shadow-xl shadow-slate-200"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 100-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3z" />
                  </svg>
                  <span>Tambah Keranjang</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-32 text-center space-y-6">
          <div className="text-7xl opacity-20">🧁</div>
          <h3 className="text-2xl font-black text-slate-300">Kue tidak ditemukan</h3>
          <button 
            onClick={() => { setSearchQuery(''); setSelectedCategory('Semua'); }}
            className="bg-pink-600 text-white px-8 py-3 rounded-full font-bold shadow-lg"
          >
            Tampilkan Semua
          </button>
        </div>
      )}
    </div>
  );
};

export default CatalogView;
