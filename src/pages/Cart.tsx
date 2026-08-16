import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { getProductById } from '../services/productService';
import { Loading } from '../components/Loading';
import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  Truck
} from 'lucide-react';

export const Cart: React.FC = () => {
  const { cart, loading, subtotal, shippingFee, total, updateQuantity, removeItem, clearCartItems } = useCart();
  const navigate = useNavigate();

  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const handleQtyChange = async (cartItemId: string, productId: string, currentQty: number, delta: number) => {
    setUpdatingId(cartItemId);
    try {
      const product = await getProductById(productId);
      const maxStock = product ? product.stock : 99;
      await updateQuantity(cartItemId, currentQty + delta, maxStock);
    } catch (err: any) {
      alert(err.message || 'Error updating quantity');
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) return <Loading fullScreen message="Loading shopping cart..." />;

  if (cart.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-20 h-20 bg-[#121212] border border-gray-800 rounded-full flex items-center justify-center mx-auto text-gray-500">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-white">Your Cart is Empty</h2>
          <p className="text-gray-400 text-xs max-w-sm mx-auto">
            Explore our hardware catalog and assemble your workstation today.
          </p>
        </div>
        <Link
          to="/products"
          className="inline-flex items-center space-x-2 px-6 py-3 bg-white text-black rounded-full text-xs font-bold hover:bg-gray-200 transition-all shadow-lg"
        >
          <span>Explore Hardware Catalog</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex items-center justify-between border-b border-gray-800 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Shopping <span className="font-serif italic text-gray-400">Cart</span></h1>
          <p className="text-xs text-gray-400 mt-1">
            You have <span className="font-bold text-blue-400">{cart.length}</span> system(s) in your cart
          </p>
        </div>
        <button
          onClick={clearCartItems}
          className="text-xs text-rose-400 hover:text-rose-300 font-semibold flex items-center space-x-1"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear Cart</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Cart Item List */}
        <div className="lg:col-span-8 space-y-4">
          {cart.map((item) => (
            <div
              key={item.id}
              className="bg-[#121212] border border-gray-800 rounded-3xl p-4 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4"
            >
              <div className="flex items-center space-x-4 w-full sm:w-auto">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-20 rounded-2xl object-cover bg-[#161616] border border-gray-800/80 shrink-0"
                />
                <div className="space-y-1">
                  <Link
                    to={`/products/${item.productId}`}
                    className="font-bold text-white hover:text-blue-300 transition-colors text-sm line-clamp-1"
                  >
                    {item.name}
                  </Link>
                  <p className="text-xs text-blue-400 font-semibold">
                    ${item.price.toLocaleString()} each
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end space-x-6 w-full sm:w-auto border-t sm:border-t-0 border-gray-800/80 pt-3 sm:pt-0">
                {/* Quantity Controls */}
                <div className="flex items-center bg-[#181818] border border-gray-800 rounded-full p-1">
                  <button
                    onClick={() => handleQtyChange(item.id, item.productId, item.quantity, -1)}
                    disabled={updatingId === item.id}
                    className="p-1 rounded-full text-gray-400 hover:text-white disabled:opacity-40"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-3 font-bold text-xs text-white">{item.quantity}</span>
                  <button
                    onClick={() => handleQtyChange(item.id, item.productId, item.quantity, 1)}
                    disabled={updatingId === item.id}
                    className="p-1 rounded-full text-gray-400 hover:text-white disabled:opacity-40"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Subtotal & Delete */}
                <div className="text-right">
                  <div className="text-sm font-extrabold text-white">
                    ${(item.price * item.quantity).toLocaleString()}
                  </div>
                </div>

                <button
                  onClick={() => removeItem(item.id)}
                  className="p-2 text-gray-500 hover:text-rose-400 rounded-full hover:bg-[#181818] transition-colors"
                  aria-label="Remove item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-4 bg-[#121212] border border-gray-800 rounded-3xl p-6 space-y-6 sticky top-24">
          <h3 className="text-sm font-extrabold text-white uppercase tracking-wider border-b border-gray-800 pb-3">
            Order Summary
          </h3>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between text-gray-400">
              <span>Subtotal</span>
              <span className="font-semibold text-gray-200">${subtotal.toLocaleString()}</span>
            </div>

            <div className="flex justify-between text-gray-400">
              <span>Estimated Shipping</span>
              <span className="font-semibold text-gray-200">
                {shippingFee === 0 ? 'FREE' : `$${shippingFee}`}
              </span>
            </div>

            {shippingFee > 0 && (
              <p className="text-[10px] text-gray-500 italic">
                Free express shipping on orders over $1,500.
              </p>
            )}

            <div className="border-t border-gray-800 pt-3 flex justify-between text-base font-extrabold text-white">
              <span>Total</span>
              <span className="text-blue-400">${total.toLocaleString()}</span>
            </div>
          </div>

          <button
            onClick={() => navigate('/checkout')}
            className="w-full py-3.5 bg-white text-black font-extrabold rounded-full text-xs flex items-center justify-center space-x-2 shadow-lg hover:bg-gray-200 transition-all uppercase tracking-wider"
          >
            <span>Proceed to Checkout</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <div className="space-y-2 pt-2 border-t border-gray-800 text-[10px] text-gray-400">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-blue-400 shrink-0" />
              <span>Encrypted SSL 256-Bit Processing</span>
            </div>
            <div className="flex items-center space-x-2">
              <Truck className="w-4 h-4 text-blue-400 shrink-0" />
              <span>Free 30-Day Returns & Exchanges</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
