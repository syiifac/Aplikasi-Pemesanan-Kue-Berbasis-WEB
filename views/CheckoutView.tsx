
import React, { useState } from 'react';
import { Order, OrderStatus, OrderItem } from '../types';

interface CheckoutViewProps {
  cart: { cakeId: string; quantity: number }[];
  cakes: any[];
  userId: string;
  onComplete: (order: Order) => void;
  onCancel: () => void;
}

const CheckoutView: React.FC<CheckoutViewProps> = ({ cart, cakes, userId, onComplete, onCancel }) => {
  const [step, setStep] = useState<'review' | 'payment' | 'upload'>('review');
  const [paymentMethod, setPaymentMethod] = useState('bank_transfer');
  const [selectedBank, setSelectedBank] = useState('BCA');
  const [paymentProof, setPaymentProof] = useState<string>('');
  const [uploading, setUploading] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');

  const cartItems = cart.map(item => {
    const cake = cakes.find(c => c.id === item.cakeId)!;
    return { ...item, ...cake };
  });

  const totalAmount = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploading(true);
      // Simulasi upload - di production gunakan API upload
      const reader = new FileReader();
      reader.onloadend = () => {
        setPaymentProof(reader.result as string);
        setUploading(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCompleteOrder = () => {
    if (!paymentProof) {
      alert('Harap upload bukti pembayaran terlebih dahulu!');
      return;
    }

    if (!customerName || !customerPhone || !customerAddress) {
      alert('Harap lengkapi data pengiriman!');
      return;
    }

    const orderItems: OrderItem[] = cart.map(item => ({
      cakeId: item.cakeId,
      quantity: item.quantity,
      price: cakes.find(c => c.id === item.cakeId)!.price
    }));

    const newOrder: Order = {
      id: `ORD-${Date.now()}`,
      userId,
      items: orderItems,
      totalAmount,
      status: OrderStatus.AWAITING_VERIFICATION,
      paymentProof,
      paymentMethod: 'Bank Transfer',
      createdAt: new Date().toISOString(),
      customerInfo: {
        name: customerName,
        phone: customerPhone,
        address: customerAddress
      }
    };

    onComplete(newOrder);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Progress Stepper */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
        <div className="flex items-center justify-between">
          <div className={`flex items-center space-x-3 ${step === 'review' ? 'text-pink-600' : 'text-slate-400'}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${step === 'review' ? 'bg-pink-600 text-white' : 'bg-slate-100'}`}>1</div>
            <span className="font-bold text-sm hidden md:block">Review Pesanan</span>
          </div>
          <div className="h-0.5 flex-grow bg-slate-100 mx-4"></div>
          <div className={`flex items-center space-x-3 ${step === 'payment' ? 'text-pink-600' : 'text-slate-400'}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${step === 'payment' ? 'bg-pink-600 text-white' : 'bg-slate-100'}`}>2</div>
            <span className="font-bold text-sm hidden md:block">Info Pembayaran</span>
          </div>
          <div className="h-0.5 flex-grow bg-slate-100 mx-4"></div>
          <div className={`flex items-center space-x-3 ${step === 'upload' ? 'text-pink-600' : 'text-slate-400'}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${step === 'upload' ? 'bg-pink-600 text-white' : 'bg-slate-100'}`}>3</div>
            <span className="font-bold text-sm hidden md:block">Upload Bukti</span>
          </div>
        </div>
      </div>

      {/* Step 1: Review Pesanan */}
      {step === 'review' && (
        <div className="space-y-6">
          <h2 className="text-3xl font-black text-slate-800">Review Pesanan Anda</h2>
          
          {/* Data Pengiriman */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 space-y-4">
            <h3 className="font-bold text-lg text-slate-800">Data Pengiriman</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase">Nama Lengkap</label>
                <input 
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-pink-500 focus:outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase">No. Telepon</label>
                <input 
                  type="tel"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="08123456789"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-pink-500 focus:outline-none"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-xs font-bold text-slate-400 uppercase">Alamat Lengkap</label>
                <textarea 
                  value={customerAddress}
                  onChange={(e) => setCustomerAddress(e.target.value)}
                  placeholder="Jl. Contoh No. 123, Jakarta"
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-pink-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Item List */}
          <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
            <div className="p-6 border-b border-slate-100 bg-slate-50">
              <h3 className="font-bold text-lg">Item Pesanan</h3>
            </div>
            <div className="divide-y divide-slate-100">
              {cartItems.map(item => (
                <div key={item.id} className="p-6 flex items-center space-x-4">
                  <img src={item.image} className="w-16 h-16 rounded-xl object-cover" alt={item.name} />
                  <div className="flex-grow">
                    <h4 className="font-bold text-slate-800">{item.name}</h4>
                    <p className="text-sm text-slate-500">{item.quantity}x @ Rp {item.price.toLocaleString()}</p>
                  </div>
                  <div className="font-bold text-pink-600">
                    Rp {(item.price * item.quantity).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
            <div className="p-6 bg-slate-50 border-t border-slate-200 flex justify-between items-center">
              <span className="font-bold text-slate-800 text-lg">Total Bayar:</span>
              <span className="text-3xl font-black text-pink-600">Rp {totalAmount.toLocaleString()}</span>
            </div>
          </div>

          <div className="flex space-x-4">
            <button 
              onClick={onCancel}
              className="px-8 py-4 rounded-2xl font-bold text-slate-500 hover:bg-slate-100 transition"
            >
              Kembali
            </button>
            <button 
              onClick={() => {
                if (!customerName || !customerPhone || !customerAddress) {
                  alert('Harap lengkapi data pengiriman!');
                  return;
                }
                setStep('payment');
              }}
              className="flex-grow bg-pink-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-pink-700 transition shadow-lg"
            >
              Lanjut ke Pembayaran →
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Pilih Metode Pembayaran */}
      {step === 'payment' && (
        <div className="space-y-6">
          <h2 className="text-3xl font-black text-slate-800">Pilih Metode Pembayaran</h2>
          
          <div className="bg-white p-6 rounded-2xl border border-slate-100 space-y-4">
            <div 
              className={`p-4 rounded-xl border-2 cursor-pointer transition ${paymentMethod === 'bank_transfer' ? 'border-pink-500 bg-pink-50' : 'border-slate-200 hover:border-slate-300'}`}
              onClick={() => setPaymentMethod('bank_transfer')}
            >
              <div className="flex items-center space-x-3">
                <input type="radio" checked={paymentMethod === 'bank_transfer'} readOnly className="w-5 h-5 text-pink-600" />
                <div className="flex-grow">
                  <h4 className="font-bold text-slate-800">Transfer Bank</h4>
                  <p className="text-sm text-slate-500">Bayar melalui transfer ke rekening bank</p>
                </div>
                <div className="text-2xl">🏦</div>
              </div>
            </div>
            <div 
              className={`p-4 rounded-xl border-2 cursor-pointer transition ${paymentMethod === 'qris' ? 'border-pink-500 bg-pink-50' : 'border-slate-200 hover:border-slate-300'}`}
              onClick={() => setPaymentMethod('qris')}
            >
              <div className="flex items-center space-x-3">
                <input type="radio" checked={paymentMethod === 'qris'} readOnly className="w-5 h-5 text-pink-600" />
                <div className="flex-grow">
                  <h4 className="font-bold text-slate-800">QRIS</h4>
                  <p className="text-sm text-slate-500">Bayar menggunakan QRIS (Quick Response Code)</p>
                </div>
                <div className="text-2xl">📱</div>
              </div>
            </div>
          </div>

          {paymentMethod === 'bank_transfer' && (
            <div className="bg-white p-6 rounded-2xl border border-slate-100 space-y-6">
              <h3 className="font-bold text-lg">Pilih Bank Tujuan</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {['BCA', 'Mandiri', 'BNI'].map(bank => (
                  <div 
                    key={bank}
                    onClick={() => setSelectedBank(bank)}
                    className={`p-4 rounded-xl border-2 cursor-pointer text-center transition ${selectedBank === bank ? 'border-pink-500 bg-pink-50' : 'border-slate-200 hover:border-slate-300'}`}
                  >
                    <div className="text-3xl mb-2">🏦</div>
                    <h4 className="font-bold text-slate-800">{bank}</h4>
                  </div>
                ))}
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 space-y-3">
                <h4 className="font-bold text-blue-900">Detail Rekening {selectedBank}</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-blue-700">No. Rekening:</span>
                    <span className="font-bold text-blue-900">1234567890</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-700">Atas Nama:</span>
                    <span className="font-bold text-blue-900">Sweet Bites Bakery</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-700">Jumlah Transfer:</span>
                    <span className="font-bold text-blue-900 text-xl">Rp {totalAmount.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {paymentMethod === 'qris' && (
            <div className="bg-white p-6 rounded-2xl border border-slate-100 space-y-6">
              <div className="flex flex-col items-center space-y-4">
                <div className="bg-slate-100 p-6 rounded-xl">
                  <div className="w-48 h-48 bg-slate-50 border-2 border-dashed border-slate-300 rounded-lg flex items-center justify-center text-6xl">
                    📱
                  </div>
                </div>
                <div className="text-center space-y-2">
                  <h3 className="font-bold text-lg text-slate-800">Scan QRIS untuk Membayar</h3>
                  <p className="text-slate-500">Buka aplikasi e-wallet Anda dan scan kode QRIS di atas</p>
                </div>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-xl p-6 space-y-3">
                <h4 className="font-bold text-green-900">Informasi QRIS</h4>
                <div className="space-y-2 text-green-800">
                  <div className="flex justify-between">
                    <span>Merchant:</span>
                    <span className="font-bold">Sweet Bites Bakery</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Jumlah:</span>
                    <span className="font-bold text-lg">Rp {totalAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Metode:</span>
                    <span className="font-bold">E-wallet / Bank</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex space-x-4">
            <button 
              onClick={() => setStep('review')}
              className="px-8 py-4 rounded-2xl font-bold text-slate-500 hover:bg-slate-100 transition"
            >
              ← Kembali
            </button>
            <button 
              onClick={() => setStep('upload')}
              className="flex-grow bg-pink-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-pink-700 transition shadow-lg"
            >
              Saya Sudah Transfer →
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Upload Bukti Pembayaran */}
      {step === 'upload' && (
        <div className="space-y-6">
          <h2 className="text-3xl font-black text-slate-800">Upload Bukti Pembayaran</h2>
          
          <div className="bg-white p-8 rounded-2xl border border-slate-100 space-y-6">
            <div className="text-center space-y-4">
              {paymentProof ? (
                <div className="space-y-4">
                  <img src={paymentProof} className="max-w-md mx-auto rounded-xl border-4 border-emerald-200" alt="Bukti Transfer" />
                  <p className="text-emerald-600 font-bold">✅ Bukti pembayaran berhasil diupload!</p>
                  <button 
                    onClick={() => setPaymentProof('')}
                    className="text-sm text-slate-500 hover:text-pink-600 underline"
                  >
                    Ganti foto lain
                  </button>
                </div>
              ) : (
                <label className="cursor-pointer block">
                  <div className="border-4 border-dashed border-slate-200 rounded-2xl p-12 hover:border-pink-300 transition">
                    <div className="text-6xl mb-4">📸</div>
                    <h3 className="font-bold text-slate-800 mb-2">Upload Bukti Transfer</h3>
                    <p className="text-slate-500 text-sm mb-4">Klik untuk memilih file atau drag & drop</p>
                    {uploading && <p className="text-pink-600 font-bold">Uploading...</p>}
                  </div>
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <h4 className="font-bold text-amber-900 mb-2">⚠️ Penting!</h4>
              <ul className="text-sm text-amber-800 space-y-1 list-disc list-inside">
                <li>Pastikan foto bukti transfer jelas dan dapat dibaca</li>
                <li>Nominal transfer harus sesuai: Rp {totalAmount.toLocaleString()}</li>
                <li>Verifikasi akan dilakukan dalam 1x24 jam</li>
              </ul>
            </div>
          </div>

          <div className="flex space-x-4">
            <button 
              onClick={() => setStep('payment')}
              className="px-8 py-4 rounded-2xl font-bold text-slate-500 hover:bg-slate-100 transition"
            >
              ← Kembali
            </button>
            <button 
              onClick={handleCompleteOrder}
              disabled={!paymentProof}
              className="flex-grow bg-emerald-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-emerald-700 transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Selesaikan Pesanan ✓
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckoutView;
