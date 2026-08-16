import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Order } from '../types';
import { CheckCircle, Package, ArrowRight, ShoppingBag } from 'lucide-react';

export const OrderSuccess: React.FC = () => {
  const location = useLocation();
  const order: Order | undefined = location.state?.order;

  if (!order) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-white">Order Information</h2>
        <p className="text-gray-400 text-xs">Please check your account orders page to view recent purchases.</p>
        <Link
          to="/orders"
          className="inline-flex items-center space-x-2 px-6 py-2.5 bg-white text-black rounded-full text-xs font-bold"
        >
          <span>View My Orders</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-16 space-y-8">
      <div className="bg-[#121212] border border-gray-800 rounded-3xl p-8 text-center space-y-6 shadow-2xl">
        <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-400">
            Order Confirmed
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Thank You For Your <span className="font-serif italic text-gray-400">Order!</span>
          </h1>
          <p className="text-gray-400 text-xs sm:text-sm max-w-md mx-auto">
            Your workstation hardware reservation is locked in. We've sent an order summary to{' '}
            <span className="text-gray-200 font-semibold">{order.customerEmail}</span>.
          </p>
        </div>

        {/* Order Details Summary Card */}
        <div className="bg-[#161616] border border-gray-800 rounded-2xl p-6 text-left space-y-4 text-xs">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-800 pb-3">
            <div>
              <p className="text-gray-500 text-[10px] uppercase font-bold">Order Ref ID</p>
              <p className="font-mono font-bold text-white text-sm">{order.id}</p>
            </div>
            <div>
              <p className="text-gray-500 text-[10px] uppercase font-bold">Total Amount</p>
              <p className="font-extrabold text-blue-400 text-sm">
                ${order.total.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-gray-500 text-[10px] uppercase font-bold">Status</p>
              <span className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-bold uppercase text-[10px]">
                Success
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-gray-400 font-bold text-[10px] uppercase tracking-wider">Purchased Systems:</p>
            {order.items.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center text-gray-300">
                <span>
                  {item.name} × {item.quantity}
                </span>
                <span className="font-semibold">${(item.price * item.quantity).toLocaleString()}</span>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-800 pt-3 text-gray-400">
            <p className="font-bold text-gray-300 text-[10px] uppercase tracking-wider">Shipping Address:</p>
            <p>{order.shippingAddress.fullName}</p>
            <p>{order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.country}</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <Link
            to={`/orders/${order.id}`}
            className="w-full sm:w-auto px-6 py-3 rounded-full bg-[#181818] border border-gray-800 hover:bg-gray-800 text-gray-200 text-xs font-bold flex items-center justify-center space-x-2 transition-colors uppercase tracking-wider"
          >
            <Package className="w-4 h-4" />
            <span>View Order Details</span>
          </Link>

          <Link
            to="/products"
            className="w-full sm:w-auto px-6 py-3 rounded-full bg-white text-black hover:bg-gray-200 text-xs font-extrabold flex items-center justify-center space-x-2 transition-all shadow-lg uppercase tracking-wider"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Continue Shopping</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};
