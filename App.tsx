
import React, { useState, useEffect, useMemo } from 'react';
import { User, Cake, Order, OrderStatus, UserRole, View, CartItem } from './types';
import { INITIAL_CAKES, INITIAL_USERS } from './constants';
import { API_BASE_URL, productAPI } from './services/apiService';
import Navbar from './components/Navbar';
import HomeView from './views/HomeView';
import CatalogView from './views/CatalogView';
import ProductDetailView from './views/ProductDetailView';
import CartView from './views/CartView';
import CheckoutView from './views/CheckoutView';
import OrderHistoryView from './views/OrderHistoryView';
import SellerDashboard from './views/SellerDashboard';
import AdminDashboard from './views/AdminDashboard';
import LoginView from './views/LoginView';
import RegisterView from './views/RegisterView';

const App: React.FC = () => {
  // State
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<View>('HOME');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [cakes, setCakes] = useState<Cake[]>(INITIAL_CAKES);
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [orders, setOrders] = useState<Order[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);

  // Derived state
  const cartCount = useMemo(() => cart.reduce((acc, item) => acc + item.quantity, 0), [cart]);

  // Persistence (Mock DB)
  useEffect(() => {
    const savedOrders = localStorage.getItem('orders');
    if (savedOrders) setOrders(JSON.parse(savedOrders));

    // Load users from backend API
    fetch(`${API_BASE_URL}/users`)
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data) {
          setUsers(data.data);
        } else {
          // Fallback to localStorage or initial users
          const savedUsers = localStorage.getItem('users');
          if (savedUsers) {
            setUsers(JSON.parse(savedUsers));
          } else {
            setUsers(INITIAL_USERS);
          }
        }
      })
      .catch(error => {
        console.error('Failed to fetch users:', error);
        // Fallback to localStorage or initial users
        const savedUsers = localStorage.getItem('users');
        if (savedUsers) {
          setUsers(JSON.parse(savedUsers));
        } else {
          setUsers(INITIAL_USERS);
        }
      });

    // Fetch products from PHP API
    productAPI.getAll()
      .then(data => {
        if (data && data.length > 0) {
          const transformedCakes: Cake[] = data.map((product: any) => ({
            id: product.id.toString(),
            name: product.name,
            description: product.description || '',
            price: parseFloat(product.price),
            category: product.category || 'Lainnya',
            image: product.image_url || 'https://via.placeholder.com/300x200?text=No+Image',
            stock: product.stock || 0,
          }));
          setCakes(transformedCakes);
        } else {
          // Fallback to initial cakes if API returns no data
          setCakes(INITIAL_CAKES);
        }
      })
      .catch(error => {
        console.error('Failed to fetch products:', error);
        // Fallback to initial cakes on error
        setCakes(INITIAL_CAKES);
      });
  }, []);

  useEffect(() => {
    localStorage.setItem('orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('users', JSON.stringify(users));
  }, [users]);

  // Actions
  const handleAddToCart = (cakeId: string, quantity: number) => {
    if (quantity <= 0) return;
    
    setCart(prev => {
      const existing = prev.find(item => item.cakeId === cakeId);
      if (existing) {
        return prev.map(item => item.cakeId === cakeId ? { ...item, quantity: item.quantity + quantity } : item);
      }
      return [...prev, { cakeId, quantity }];
    });
  };

  const handleUpdateCartQuantity = (cakeId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveFromCart(cakeId);
      return;
    }
    setCart(prev => prev.map(item => item.cakeId === cakeId ? { ...item, quantity } : item));
  };

  const handleRemoveFromCart = (cakeId: string) => {
    setCart(prev => prev.filter(item => item.cakeId !== cakeId));
  };

  const handleViewDetail = (id: string) => {
    setSelectedProductId(id);
    setCurrentView('PRODUCT_DETAIL');
  };

  const handleCheckout = () => {
    if (!currentUser) {
      setCurrentView('LOGIN');
      return;
    }
    
    setCurrentView('CHECKOUT');
  };

  const handleCompleteCheckout = (order: Order) => {
    setOrders([order, ...orders]);
    setCart([]);
    alert('✅ Pesanan berhasil dibuat! Silakan tunggu verifikasi pembayaran dari admin.');
    setCurrentView('ORDERS');
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
  };

  const verifyPayment = (orderId: string) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: OrderStatus.PROCESSING, paymentVerified: true } : o));
  };

  const uploadProof = (orderId: string, base64: string) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, paymentProof: base64, status: OrderStatus.AWAITING_VERIFICATION } : o));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCart([]);
    setCurrentView('HOME');
  };

  // Views Router
  const renderView = () => {
    switch (currentView) {
      case 'HOME':
        return <HomeView currentUser={currentUser} cakes={cakes} onAddToCart={handleAddToCart} onNavigate={setCurrentView} onViewDetail={handleViewDetail} />;
      case 'CATALOG':
        return <CatalogView cakes={cakes} onAddToCart={handleAddToCart} onViewDetail={handleViewDetail} />;
      case 'PRODUCT_DETAIL':
        const product = cakes.find(c => c.id === selectedProductId);
        return product ? <ProductDetailView product={product} onAddToCart={handleAddToCart} onBack={() => setCurrentView('CATALOG')} /> : <CatalogView cakes={cakes} onAddToCart={handleAddToCart} onViewDetail={handleViewDetail} />;
      case 'CART':
        return (
          <CartView 
            cart={cart} 
            cakes={cakes} 
            onRemove={handleRemoveFromCart} 
            onUpdateQuantity={handleUpdateCartQuantity}
            onCheckout={handleCheckout} 
          />
        );
      case 'CHECKOUT':
        return (
          <CheckoutView 
            cart={cart} 
            cakes={cakes} 
            userId={currentUser?.id || ''} 
            onComplete={handleCompleteCheckout}
            onCancel={() => setCurrentView('CART')}
          />
        );
      case 'ORDERS':
        return <OrderHistoryView orders={orders.filter(o => o.userId === currentUser?.id)} onUploadProof={uploadProof} />;
      case 'SELLER_DASHBOARD':
        return <SellerDashboard cakes={cakes} setCakes={setCakes} orders={orders} updateStatus={updateOrderStatus} />;
      case 'ADMIN_DASHBOARD':
        return <AdminDashboard users={users} setUsers={setUsers} orders={orders} cakes={cakes} onVerify={verifyPayment} />;
      case 'LOGIN':
        return (
          <LoginView 
            users={users} 
            onLogin={(user) => { 
              setCurrentUser(user); 
              if (user.role === UserRole.ADMIN) setCurrentView('ADMIN_DASHBOARD');
              else if (user.role === UserRole.SELLER) setCurrentView('SELLER_DASHBOARD');
              else setCurrentView('HOME');
            }} 
            onSwitchToRegister={() => setCurrentView('REGISTER')} 
          />
        );
      case 'REGISTER':
        return <RegisterView onRegister={(user) => { setUsers([...users, user]); }} onSwitchToLogin={() => setCurrentView('LOGIN')} />;
      default:
        return <HomeView currentUser={currentUser} cakes={cakes} onAddToCart={handleAddToCart} onNavigate={setCurrentView} onViewDetail={handleViewDetail} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar 
        currentUser={currentUser} 
        cartCount={cartCount} 
        onNavigate={setCurrentView} 
        onLogout={handleLogout}
      />
      <main className="flex-grow container mx-auto px-4 py-8">
        {renderView()}
      </main>
      
      {/* Store Info Section */}
      <section className="bg-gradient-to-br from-pink-50 to-slate-50 border-t py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-6xl mx-auto">
            {/* About Store */}
            <div className="space-y-4">
              <h3 className="text-2xl font-black text-slate-900">Sweet Bites Bakery</h3>
              <p className="text-slate-600 leading-relaxed">
                Toko kue terbaik dengan berbagai pilihan kue lezat dan berkualitas. Dibuat dengan bahan pilihan dan cinta.
              </p>
            </div>
            
            {/* Address */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-slate-900">📍 Alamat Toko</h3>
              <div className="text-slate-600 space-y-2">
                <p>Jl. Raya Bakery No. 123</p>
                <p>Kelurahan Manis, Kecamatan Lezat</p>
                <p>Jakarta Selatan 12345</p>
                <p className="pt-2">📞 Telepon: (021) 1234-5678</p>
                <p>📧 Email: info@sweetbites.com</p>
              </div>
            </div>
            
            {/* Social Media */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-slate-900">🌐 Media Sosial</h3>
              <div className="space-y-3">
                <a href="https://instagram.com/sweetbitesbakery" target="_blank" rel="noopener noreferrer" 
                   className="flex items-center space-x-3 text-slate-600 hover:text-pink-600 transition">
                  <span className="text-2xl">📷</span>
                  <span className="font-medium">@sweetbitesbakery</span>
                </a>
                <a href="https://facebook.com/sweetbitesbakery" target="_blank" rel="noopener noreferrer" 
                   className="flex items-center space-x-3 text-slate-600 hover:text-pink-600 transition">
                  <span className="text-2xl">👥</span>
                  <span className="font-medium">Sweet Bites Bakery</span>
                </a>
                <a href="https://wa.me/628123456789" target="_blank" rel="noopener noreferrer" 
                   className="flex items-center space-x-3 text-slate-600 hover:text-pink-600 transition">
                  <span className="text-2xl">💬</span>
                  <span className="font-medium">+62 812-3456-789</span>
                </a>
                <a href="https://tiktok.com/@sweetbitesbakery" target="_blank" rel="noopener noreferrer" 
                   className="flex items-center space-x-3 text-slate-600 hover:text-pink-600 transition">
                  <span className="text-2xl">🎵</span>
                  <span className="font-medium">@sweetbitesbakery</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-white border-t py-8 text-center text-slate-500">
        <p>&copy; 2026 Sweet bites bakery by Syifa Cahya</p>
      </footer>
    </div>
  );
};

export default App;
