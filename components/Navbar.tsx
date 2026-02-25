
import React from 'react';
import { User, UserRole, View } from '../types';

interface NavbarProps {
  currentUser: User | null;
  cartCount: number;
  onNavigate: (view: View) => void;
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentUser, cartCount, onNavigate, onLogout }) => {
  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2 cursor-pointer" onClick={() => onNavigate('HOME')}>
          <div className="w-10 h-10 bg-pink-500 rounded-full flex items-center justify-center text-white font-bold text-xl">🍪</div>
          <span className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-rose-400 bg-clip-text text-transparent">Sweet Bites</span>
        </div>

        <div className="hidden md:flex items-center space-x-8">
          <button onClick={() => onNavigate('HOME')} className="text-slate-600 hover:text-pink-600 font-medium transition">Beranda</button>
          <button onClick={() => onNavigate('CATALOG')} className="text-slate-600 hover:text-pink-600 font-medium transition">Katalog</button>
          {currentUser?.role === UserRole.CUSTOMER && (
            <>
              <button onClick={() => onNavigate('ORDERS')} className="text-slate-600 hover:text-pink-600 font-medium transition">Pesanan Saya</button>
            </>
          )}
          {currentUser?.role === UserRole.SELLER && (
            <button onClick={() => onNavigate('SELLER_DASHBOARD')} className="bg-pink-50 text-pink-600 px-4 py-2 rounded-lg font-medium">Dashboard Penjual</button>
          )}
          {currentUser?.role === UserRole.ADMIN && (
            <button onClick={() => onNavigate('ADMIN_DASHBOARD')} className="bg-slate-100 text-slate-700 px-4 py-2 rounded-lg font-medium">Admin Panel</button>
          )}
        </div>

        <div className="flex items-center space-x-4">
          <button onClick={() => onNavigate('CART')} className="relative p-2 text-slate-600 hover:text-pink-600 transition">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full ring-2 ring-white">
                {cartCount}
              </span>
            )}
          </button>

          {currentUser ? (
            <div className="flex items-center space-x-4">
              <div className="flex flex-col text-right">
                <span className="text-sm font-semibold">{currentUser.name}</span>
                <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">{currentUser.role}</span>
              </div>
              <button onClick={onLogout} className="text-sm text-slate-400 hover:text-red-500 transition underline underline-offset-4">Logout</button>
            </div>
          ) : (
            <div className="flex space-x-2">
              <button 
                onClick={() => onNavigate('LOGIN')} 
                className="bg-pink-600 hover:bg-pink-700 text-white px-5 py-2 rounded-full font-medium transition shadow-md shadow-pink-200"
              >
                Login
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
