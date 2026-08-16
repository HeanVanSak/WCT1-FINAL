import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { createOrder } from '../services/orderService';
import { PaymentMethod, ShippingAddress, OrderItem } from '../types';
import { Loading } from '../components/Loading';
import {
  CreditCard,
  Truck,
  ShieldCheck,
  Lock,
  ArrowLeft,
  AlertCircle
} from 'lucide-react';

export const Checkout: React.FC = () => {
  const { user } = useAuth();
  const { cart, subtotal, shippingFee, total } = useCart();
  const navigate = useNavigate();

  const [address, setAddress] = useState<ShippingAddress>({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    city: '',
    country: 'United States',
    postalCode: ''
  });

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cod');
  const cardDetails = {
    cardNumber: '4242 •••• •••• 4242',
    expDate: '12/28',
    cvv: '999'
  };

  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (cart.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-amber-500 mx-auto" />
        <h2 className="text-2xl font-bold text-white">No Items to Checkout</h2>
        <p className="text-gray-400 text-xs">Please add items to your shopping cart before checking out.</p>
        <Link
          to="/products"
          className="inline-flex items-center space-x-2 px-6 py-2.5 bg-white text-black rounded-full text-xs font-bold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Catalog</span>
        </Link>
      </div>
    );
  }

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!address.fullName || !address.email || !address.phone || !address.address || !address.city) {
      setError('Please fill in all required shipping address fields.');
      return;
    }

    setPlacing(true);

    try {
      const orderItems: OrderItem[] = cart.map((c) => ({
        productId: c.productId,
        name: c.name,
        price: c.price,
        quantity: c.quantity,
        image: c.image
      }));

      const newOrder = await createOrder(
        user?.uid || 'guest-user',
        address.fullName,
        address.email,
        orderItems,
        subtotal,
        shippingFee,
        address,
        paymentMethod
      );

      navigate('/order-success', { state: { order: newOrder } });
    } catch (err: any) {
      setError(err.message || 'Failed to process order placement.');
    } finally {
      setPlacing(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex items-center space-x-2 text-xs text-gray-500">
        <Link to="/cart" className="hover:text-gray-300">
          Cart
        </Link>
        <span>/</span>
        <span className="text-blue-400 font-semibold">Checkout</span>
      </div>

      <h1 className="text-3xl font-extrabold text-white">Secure <span className="font-serif italic text-gray-400">Checkout</span></h1>

      {error && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-2xl text-rose-300 text-xs flex items-center space-x-2">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Form: Shipping & Payment */}
        <div className="lg:col-span-8 space-y-8">
          {/* Shipping Address */}
          <div className="bg-[#121212] border border-gray-800 rounded-3xl p-6 space-y-4">
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-white flex items-center space-x-2 border-b border-gray-800 pb-3">
              <Truck className="w-5 h-5 text-blue-400" />
              <span>Shipping Information</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-gray-400 mb-1 font-semibold text-[10px] uppercase tracking-wider">Full Name *</label>
                <input
                  type="text"
                  required
                  value={address.fullName}
                  onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#161616] border border-gray-800 rounded-xl text-gray-200 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-1 font-semibold text-[10px] uppercase tracking-wider">Email Address *</label>
                <input
                  type="email"
                  required
                  value={address.email}
                  onChange={(e) => setAddress({ ...address, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#161616] border border-gray-800 rounded-xl text-gray-200 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-1 font-semibold text-[10px] uppercase tracking-wider">Phone Number *</label>
                <input
                  type="tel"
                  required
                  value={address.phone}
                  onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#161616] border border-gray-800 rounded-xl text-gray-200 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-1 font-semibold text-[10px] uppercase tracking-wider">Country *</label>
                <input
                  type="text"
                  required
                  value={address.country}
                  onChange={(e) => setAddress({ ...address, country: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#161616] border border-gray-800 rounded-xl text-gray-200 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-gray-400 mb-1 font-semibold text-[10px] uppercase tracking-wider">Street Address *</label>
                <input
                  type="text"
                  required
                  value={address.address}
                  onChange={(e) => setAddress({ ...address, address: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#161616] border border-gray-800 rounded-xl text-gray-200 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-1 font-semibold text-[10px] uppercase tracking-wider">City *</label>
                <input
                  type="text"
                  required
                  value={address.city}
                  onChange={(e) => setAddress({ ...address, city: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#161616] border border-gray-800 rounded-xl text-gray-200 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-1 font-semibold text-[10px] uppercase tracking-wider">Postal / ZIP Code</label>
                <input
                  type="text"
                  value={address.postalCode}
                  onChange={(e) => setAddress({ ...address, postalCode: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#161616] border border-gray-800 rounded-xl text-gray-200 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-[#121212] border border-gray-800 rounded-3xl p-6 space-y-4">
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-white flex items-center space-x-2 border-b border-gray-800 pb-3">
              <CreditCard className="w-5 h-5 text-blue-400" />
              <span>Payment Option</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div
                onClick={() => setPaymentMethod('cod')}
                className={`p-4 rounded-2xl border cursor-pointer flex items-center space-x-3 transition-colors ${
                  paymentMethod === 'cod'
                    ? 'bg-blue-600/10 border-blue-500 text-blue-300'
                    : 'bg-[#161616] border-gray-800 text-gray-400 hover:border-gray-700'
                }`}
              >
                <Truck className="w-5 h-5 text-blue-400 shrink-0" />
                <div>
                  <h4 className="font-bold text-xs text-white">Cash on Delivery (COD)</h4>
                  <p className="text-[10px] text-gray-500">Pay upon courier delivery</p>
                </div>
              </div>

              <div
                onClick={() => setPaymentMethod('card')}
                className={`p-4 rounded-2xl border cursor-pointer flex items-center space-x-3 transition-colors ${
                  paymentMethod === 'card'
                    ? 'bg-blue-600/10 border-blue-500 text-blue-300'
                    : 'bg-[#161616] border-gray-800 text-gray-400 hover:border-gray-700'
                }`}
              >
                <CreditCard className="w-5 h-5 text-blue-400 shrink-0" />
                <div>
                  <h4 className="font-bold text-xs text-white">Demo Credit Card</h4>
                  <p className="text-[10px] text-gray-500">Simulated instant approval</p>
                </div>
              </div>
            </div>

            {paymentMethod === 'card' && (
              <div className="p-4 bg-[#161616] border border-gray-800 rounded-2xl space-y-3 text-xs">
                <p className="text-[10px] text-blue-400 font-semibold uppercase tracking-wider">
                  Simulated Gateway Integration
                </p>
                <div className="grid grid-cols-3 gap-3">
                  <div className="col-span-3">
                    <label className="text-gray-500 text-[10px] uppercase">Card Number</label>
                    <input
                      type="text"
                      disabled
                      value={cardDetails.cardNumber}
                      className="w-full px-3 py-1.5 bg-[#121212] border border-gray-800 rounded-xl text-gray-300 font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-gray-500 text-[10px] uppercase">Expiry</label>
                    <input
                      type="text"
                      disabled
                      value={cardDetails.expDate}
                      className="w-full px-3 py-1.5 bg-[#121212] border border-gray-800 rounded-xl text-gray-300 font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-gray-500 text-[10px] uppercase">CVV</label>
                    <input
                      type="text"
                      disabled
                      value={cardDetails.cvv}
                      className="w-full px-3 py-1.5 bg-[#121212] border border-gray-800 rounded-xl text-gray-300 font-mono"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Summary Sidebar */}
        <div className="lg:col-span-4 bg-[#121212] border border-gray-800 rounded-3xl p-6 space-y-6 sticky top-24">
          <h3 className="text-sm font-extrabold text-white uppercase tracking-wider border-b border-gray-800 pb-3">
            Items in Order
          </h3>

          <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
            {cart.map((item) => (
              <div key={item.id} className="flex items-center space-x-3 text-xs">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-12 h-12 rounded-xl object-cover bg-[#161616] border border-gray-800 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-gray-200 truncate">{item.name}</p>
                  <p className="text-gray-500">Qty: {item.quantity}</p>
                </div>
                <div className="font-bold text-white">
                  ${(item.price * item.quantity).toLocaleString()}
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-2 border-t border-gray-800 pt-4 text-xs">
            <div className="flex justify-between text-gray-400">
              <span>Subtotal</span>
              <span className="font-semibold text-gray-200">${subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-gray-400">
              <span>Shipping Fee</span>
              <span className="font-semibold text-gray-200">
                {shippingFee === 0 ? 'FREE' : `$${shippingFee}`}
              </span>
            </div>
            <div className="border-t border-gray-800 pt-3 flex justify-between text-base font-extrabold text-white">
              <span>Grand Total</span>
              <span className="text-blue-400">${total.toLocaleString()}</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={placing}
            className="w-full py-3.5 bg-white text-black font-extrabold rounded-full text-xs flex items-center justify-center space-x-2 shadow-lg hover:bg-gray-200 disabled:opacity-50 transition-all uppercase tracking-wider"
          >
            {placing ? (
              <Loading message="Processing order..." />
            ) : (
              <>
                <Lock className="w-4 h-4" />
                <span>Place Order (${total.toLocaleString()})</span>
              </>
            )}
          </button>

          <div className="flex items-center justify-center space-x-2 text-[10px] text-gray-500 pt-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Money-back Guarantee & Fast Dispatch</span>
          </div>
        </div>
      </form>
    </div>
  );
};
