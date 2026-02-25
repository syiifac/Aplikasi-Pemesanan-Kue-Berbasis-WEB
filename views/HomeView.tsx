
import React, { useState } from 'react';
import { Cake, User, View } from '../types';
import { getCakeRecommendations } from '../services/geminiService';

interface HomeViewProps {
  currentUser: User | null;
  cakes: Cake[];
  onAddToCart: (cakeId: string, quantity: number) => void;
  onNavigate: (view: View) => void;
  onViewDetail: (id: string) => void;
}

const HomeView: React.FC<HomeViewProps> = ({ currentUser, cakes, onAddToCart, onNavigate, onViewDetail }) => {
  const [mood, setMood] = useState('');
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loadingAi, setLoadingAi] = useState(false);
  const [aiError, setAiError] = useState('');

  const handleAskAi = async () => {
    if (!mood.trim()) {
      setAiError('Tulis mood kamu dulu ya.');
      return;
    }

    setLoadingAi(true);
    setAiError('');
    setRecommendations([]);

    try {
      const recs = await getCakeRecommendations(mood, cakes);
      if (!Array.isArray(recs) || recs.length === 0) {
        setAiError('AI belum terhubung. Pastikan VITE_GEMINI_API_KEY sudah diatur.');
      }
      setRecommendations(recs || []);
    } catch (error) {
      setAiError('AI belum terhubung. Pastikan VITE_GEMINI_API_KEY sudah diatur.');
    } finally {
      setLoadingAi(false);
    }
  };

  const featuredCakes = cakes.slice(0, 4);

  return (
    <div className="space-y-16 pb-20">
      {/* Welcome Banner */}
      {currentUser && (
        <div className="bg-gradient-to-r from-pink-600 to-rose-500 rounded-3xl p-8 text-white shadow-xl flex items-center justify-between overflow-hidden relative">
          <div className="relative z-10 space-y-2">
            <h2 className="text-3xl font-black">Halo, {currentUser.name}! 👋</h2>
            <p className="text-pink-100 font-medium">Siap untuk memanjakan lidahmu hari ini?</p>
          </div>
          <div className="hidden md:block text-7xl opacity-20 transform translate-x-4 translate-y-4">🧁</div>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative h-[500px] rounded-[3rem] overflow-hidden shadow-2xl">
        <img src="https://images.unsplash.com/photo-1495147466023-ac5c588e2e94?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8a3VlJTIwa2VyaW5nfGVufDB8fDB8fHww" className="w-full h-full object-cover" alt="Bakery Hero" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-center items-center text-center p-8">
          <h1 className="text-5xl md:text-7xl font-black text-white mb-6 drop-shadow-lg">Freshly Baked Daily</h1>
          <p className="text-xl text-pink-100 max-w-2xl mb-8 font-medium">Nikmati kelembutan kue premium kami yang dibuat dengan cinta dan bahan terbaik.</p>
          <button 
            onClick={() => onNavigate('CATALOG')}
            className="bg-white text-pink-600 px-10 py-4 rounded-full font-black text-lg hover:bg-pink-50 transition-all transform hover:scale-105 shadow-xl"
          >
            Lihat Katalog Lengkap
          </button>
        </div>
      </section>

      {/* AI Assistant Section */}
      <section className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 bg-indigo-50 text-indigo-600 rounded-full text-xs font-black uppercase tracking-widest border border-indigo-100">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            <span>Sweet AI Assistant</span>
          </div>
          <h2 className="text-3xl font-black text-slate-800">Cari Kue Berdasarkan Mood?</h2>
          <div className="flex flex-col md:flex-row gap-3">
            <input 
              type="text" 
              value={mood}
              onChange={(e) => setMood(e.target.value)}
              placeholder="Contoh: 'Butuh penyemangat setelah hari yang lelah'..."
              className="flex-grow px-6 py-4 rounded-2xl border-2 border-slate-100 focus:border-indigo-500 focus:outline-none transition-all shadow-sm font-medium"
            />
            <button 
              onClick={handleAskAi}
              disabled={loadingAi}
              className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black hover:bg-slate-800 transition shadow-lg disabled:opacity-50"
            >
              {loadingAi ? 'Menganalisa...' : '✨ Tanya AI'}
            </button>
          </div>

          {aiError && (
            <div className="bg-amber-50 border border-amber-200 text-amber-700 px-4 py-3 rounded-2xl text-sm font-medium">
              {aiError}
            </div>
          )}

          {recommendations.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left animate-in fade-in slide-in-from-bottom-4 duration-500">
              {recommendations.map((rec, i) => (
                <div key={i} className="bg-indigo-50/50 p-6 rounded-3xl border border-indigo-100 flex items-start space-x-4">
                  <div className="text-3xl">🎯</div>
                  <div className="space-y-1">
                    <h4 className="font-black text-indigo-700">{rec.cakeName}</h4>
                    <p className="text-sm text-indigo-600/80 leading-relaxed italic">"{rec.reason}"</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Featured Products Snippet */}
      <section className="space-y-8">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-4xl font-black text-slate-800">Favorit Pelanggan</h2>
            <p className="text-slate-400 font-medium">Koleksi pilihan yang paling banyak dicari minggu ini.</p>
          </div>
          <button onClick={() => onNavigate('CATALOG')} className="text-pink-600 font-bold hover:underline">Lihat Semua →</button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {featuredCakes.map(cake => (
            <div key={cake.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-slate-100 group">
              <div className="relative h-48 overflow-hidden cursor-pointer" onClick={() => onViewDetail(cake.id)}>
                <img src={cake.image} alt={cake.name} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-pink-600 shadow-sm border border-pink-50">
                  Rp {cake.price.toLocaleString('id-ID')}
                </div>
              </div>
              <div className="p-5 space-y-3">
                <h3 className="text-lg font-bold text-slate-800 truncate cursor-pointer hover:text-pink-600" onClick={() => onViewDetail(cake.id)}>{cake.name}</h3>
                <button 
                  onClick={() => onAddToCart(cake.id, 1)}
                  className="w-full py-2.5 rounded-xl border-2 border-slate-100 text-slate-600 font-bold hover:bg-pink-600 hover:text-white hover:border-pink-600 transition"
                >
                  Cepat Beli
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomeView;
