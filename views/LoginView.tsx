
import React, { useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { API_BASE_URL } from '../services/apiService';

interface LoginViewProps {
  users: User[];
  onLogin: (user: User) => void;
  onSwitchToRegister: () => void;
}

const LoginView: React.FC<LoginViewProps> = ({ users, onLogin, onSwitchToRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Load saved email when component mounts
  useEffect(() => {
    const savedEmail = localStorage.getItem('savedEmail');
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Call PHP backend API untuk login
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok && data.success && data.user) {
        // Login berhasil
        // Save email to localStorage if remember me is checked
        if (rememberMe) {
          localStorage.setItem('savedEmail', email);
        } else {
          localStorage.removeItem('savedEmail');
        }
        
        const user: User = {
          id: data.user.id,
          name: data.user.name,
          email: data.user.email,
          role: data.user.role as UserRole
        };
        onLogin(user);
      } else if (!response.ok && response.status === 404) {
        // API tidak tersedia, fallback ke mock data
        const user = users.find(u => u.email === email);
        if (user) {
          // Save email to localStorage if remember me is checked
          if (rememberMe) {
            localStorage.setItem('savedEmail', email);
          } else {
            localStorage.removeItem('savedEmail');
          }
          onLogin(user);
        } else {
          setError('Email tidak terdaftar.');
        }
      } else {
        setError(data.message || 'Email atau password salah.');
      }
    } catch (err) {
      // Jika API error, gunakan fallback mock data untuk testing
      const user = users.find(u => u.email === email);
      if (user) {
        // Save email to localStorage if remember me is checked
        if (rememberMe) {
          localStorage.setItem('savedEmail', email);
        } else {
          localStorage.removeItem('savedEmail');
        }
        onLogin(user);
      } else {
        setError('Terjadi kesalahan. Silakan coba lagi.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-12 px-4">
      <div className="bg-white p-8 md:p-10 rounded-3xl shadow-xl border border-slate-100 space-y-8">
        <div className="text-center space-y-2">
          <div className="w-16 h-16 bg-pink-500 rounded-2xl flex items-center justify-center text-white text-3xl mx-auto shadow-lg shadow-pink-200">🍪</div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">Selamat Datang</h2>
          <p className="text-slate-400">Masuk ke akun Anda untuk melanjutkan.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Email</label>
            <input 
              type="email" 
              required
              disabled={isLoading}
              className="w-full px-5 py-3.5 rounded-2xl border-2 border-slate-100 focus:border-pink-500 focus:outline-none transition bg-slate-50/30 disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Password</label>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"}
                required
                disabled={isLoading}
                className="w-full px-5 py-3.5 rounded-2xl border-2 border-slate-100 focus:border-pink-500 focus:outline-none transition bg-slate-50/30 disabled:opacity-50 disabled:cursor-not-allowed pr-12"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition disabled:opacity-50"
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-4.803m5.596-3.856a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0m7.322 9.129a4.5 4.5 0 00-4.491-4.5m5.5.662v5.002a1 1 0 11-2 0V9.117m3.823-11.014a10.05 10.05 0 012.25 6.397M2 3l1.414 1.414" />
          <div className="flex items-center space-x-2">
            <input 
              type="checkbox" 
              id="rememberMe"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              disabled={isLoading}
              className="w-4 h-4 text-pink-600 border-slate-300 rounded focus:ring-pink-500 disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <label htmlFor="rememberMe" className="text-sm text-slate-600 select-none cursor-pointer">
              Ingat email saya
            </label>
          </div>

                  </svg>
                )}
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-xl text-xs font-medium border border-red-100 flex items-center space-x-2">
              <span>❌</span>
              <span>{error}</span>
            </div>
          )}

          <button 
            type="submit"
            disabled={isLoading}
            className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black text-lg hover:bg-slate-800 transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? '⏳ Memproses...' : 'Masuk Sekarang'}
          </button>
        </form>

        <div className="text-center">
          <button 
            onClick={onSwitchToRegister}
            disabled={isLoading}
            className="text-pink-600 font-bold hover:underline underline-offset-4 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Belum punya akun? Registrasi di sini
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginView;

