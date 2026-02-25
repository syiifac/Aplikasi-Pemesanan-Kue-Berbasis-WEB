
import React, { useState } from 'react';
import { User, UserRole } from '../types';
import { API_BASE_URL } from '../services/apiService';

interface RegisterViewProps {
  onRegister: (user: User) => void;
  onSwitchToLogin: () => void;
}

const RegisterView: React.FC<RegisterViewProps> = ({ onRegister, onSwitchToLogin }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validasi input
    if (name.length < 3) {
      setError('Nama harus minimal 3 karakter.');
      return;
    }
    if (password.length < 6) {
      setError('Password harus minimal 6 karakter.');
      return;
    }
    if (password !== passwordConfirm) {
      setError('Password tidak cocok.');
      return;
    }

    setIsLoading(true);

    try {
      // Call PHP backend API untuk register
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          password,
          role: 'CUSTOMER'
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Register berhasil
        setSuccess('Registrasi berhasil! Silakan login.');
        setTimeout(() => {
          onSwitchToLogin();
        }, 1500);
      } else if (!response.ok && response.status === 404) {
        // API tidak tersedia, buat user lokal untuk testing
        const newUser: User = {
          id: `u-${Date.now()}`,
          name,
          email,
          role: UserRole.CUSTOMER
        };
        onRegister(newUser);
        setSuccess('Akun berhasil dibuat! Silakan login.');
        setTimeout(() => {
          onSwitchToLogin();
        }, 1500);
      } else {
        setError(data.message || 'Registrasi gagal. Email mungkin sudah terdaftar.');
      }
    } catch (err) {
      // Fallback ke local user creation untuk testing
      const newUser: User = {
        id: `u-${Date.now()}`,
        name,
        email,
        role: UserRole.CUSTOMER
      };
      onRegister(newUser);
      setSuccess('Akun berhasil dibuat! Silakan login.');
      setTimeout(() => {
        onSwitchToLogin();
      }, 1500);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-12">
      <div className="bg-white p-10 rounded-3xl shadow-xl border border-slate-100 space-y-8">
        <div className="text-center space-y-2">
          <div className="w-16 h-16 bg-pink-500 rounded-2xl flex items-center justify-center text-white text-3xl mx-auto shadow-lg shadow-pink-200">🍪</div>
          <h2 className="text-3xl font-black text-slate-800">Daftar Akun</h2>
          <p className="text-slate-400">Bergabunglah dengan komunitas Sweet Bites.</p>
        </div>

        {success && (
          <div className="bg-emerald-50 text-emerald-600 p-3 rounded-xl text-xs font-medium border border-emerald-100 flex items-center space-x-2">
            <span>✅</span>
            <span>{success}</span>
          </div>
        )}
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-xl text-xs font-medium border border-red-100 flex items-center space-x-2">
            <span>❌</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Nama Lengkap</label>
            <input 
              type="text" 
              required
              disabled={isLoading}
              className="w-full px-5 py-4 rounded-2xl border-2 border-slate-100 focus:border-pink-500 focus:outline-none transition disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="Nama Lengkap"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Email</label>
            <input 
              type="email" 
              required
              disabled={isLoading}
              className="w-full px-5 py-4 rounded-2xl border-2 border-slate-100 focus:border-pink-500 focus:outline-none transition disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Password</label>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"}
                required
                disabled={isLoading}
                className="w-full px-5 py-4 rounded-2xl border-2 border-slate-100 focus:border-pink-500 focus:outline-none transition disabled:opacity-50 disabled:cursor-not-allowed pr-12"
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
                  </svg>
                )}
              </button>
            </div>
            <p className="text-xs text-slate-400 ml-1 flex items-center space-x-1">
              <span>ℹ️</span>
              <span>Password harus minimal 6 karakter</span>
            </p>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Konfirmasi Password</label>
            <div className="relative">
              <input 
                type={showPasswordConfirm ? "text" : "password"}
                required
                disabled={isLoading}
                className="w-full px-5 py-4 rounded-2xl border-2 border-slate-100 focus:border-pink-500 focus:outline-none transition disabled:opacity-50 disabled:cursor-not-allowed pr-12"
                placeholder="••••••••"
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                disabled={isLoading}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition disabled:opacity-50"
              >
                {showPasswordConfirm ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-4.803m5.596-3.856a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0m7.322 9.129a4.5 4.5 0 00-4.491-4.5m5.5.662v5.002a1 1 0 11-2 0V9.117m3.823-11.014a10.05 10.05 0 012.25 6.397M2 3l1.414 1.414" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <button 
            type="submit"
            disabled={isLoading}
            className="w-full bg-pink-600 text-white py-4 rounded-2xl font-black text-lg hover:bg-pink-700 transition shadow-lg shadow-pink-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? '⏳ Mendaftar...' : 'Daftar Sekarang'}
          </button>
        </form>

        <div className="text-center">
          <button 
            onClick={onSwitchToLogin}
            disabled={isLoading}
            className="text-slate-400 font-bold hover:text-slate-600 underline underline-offset-4 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Sudah punya akun? Masuk saja
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegisterView;
