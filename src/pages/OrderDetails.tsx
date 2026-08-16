import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Order } from '../types';
import { getOrderById } from '../services/orderService';
import { Loading } from '../components/Loading';
import { ArrowLeft, Package, Truck, CreditCard } from 'lucide-react';

export const OrderDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!id) return;
      try {
        const data = await getOrderById(id);
        setOrder(data);
      } catch (err) {
        console.error('Error loading order detail:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  if (loading) return <Loading fullScreen message="Loading order receipt..." />;

  if (!order) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-white">Order Not Found</h2>
        <p className="text-gray-400 text-xs">We could not locate the specified order record.</p>
        <Link
          to="/orders"
          className="inline-flex items-center space-x-2 px-6 py-2.5 bg-white text-black rounded-full text-xs font-bold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to My Orders</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex items-center space-x-2 text-xs text-gray-500">
        <Link to="/orders" className="hover:text-gray-300">
          My Orders
        </Link>
        <span>/</span>
        <span className="text-blue-400 font-mono font-semibold">{order.id}</span>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-800 pb-6">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-blue-400">
            Order Receipt
          </span>
          <h1 className="text-2xl font-extrabold text-white font-mono">{order.id}</h1>
          <p className="text-xs text-gray-400 mt-1">
            Placed on {new Date(order.createdAt).toLocaleString()}
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full text-xs font-bold uppercase">
            Order: Success
          </span>
          <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full text-xs font-bold uppercase">
            Payment: {order.paymentStatus}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Purchased Products */}
        <div className="lg:col-span-8 bg-[#121212] border border-gray-800 rounded-3xl p-6 space-y-4">
          <h3 className="text-xs font-extrabold text-white uppercase tracking-wider flex items-center space-x-2 border-b border-gray-800 pb-3">
            <Package className="w-4 h-4 text-blue-400" />
            <span>Hardware Items</span>
          </h3>

          <div className="space-y-4">
            {order.items.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 bg-[#161616] border border-gray-800/80 rounded-2xl"
              >
                <div className="flex items-center space-x-3">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-14 h-14 rounded-xl object-cover bg-[#121212]"
                  />
                  <div>
                    <h4 className="font-bold text-gray-200 text-xs">{item.name}</h4>
                    <p className="text-xs text-gray-500">
                      ${item.price.toLocaleString()} × {item.quantity}
                    </p>
                  </div>
                </div>

                <div className="text-xs font-extrabold text-white">
                  ${(item.price * item.quantity).toLocaleString()}
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-800 pt-4 space-y-2 text-xs">
            <div className="flex justify-between text-gray-400">
              <span>Subtotal</span>
              <span className="font-semibold text-gray-200">${order.subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-gray-400">
              <span>Shipping Fee</span>
              <span className="font-semibold text-gray-200">
                {order.shippingFee === 0 ? 'FREE' : `$${order.shippingFee}`}
              </span>
            </div>
            <div className="flex justify-between text-base font-extrabold text-white pt-2 border-t border-gray-800">
              <span>Total Paid</span>
              <span className="text-blue-400">${order.total.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Shipping & Payment Meta */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-[#121212] border border-gray-800 rounded-3xl p-6 space-y-3">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-white flex items-center space-x-2 border-b border-gray-800 pb-2">
              <Truck className="w-4 h-4 text-blue-400" />
              <span>Shipping Address</span>
            </h3>
            <div className="text-xs text-gray-300 space-y-1">
              <p className="font-bold text-white">{order.shippingAddress.fullName}</p>
              <p>{order.shippingAddress.email}</p>
              <p>{order.shippingAddress.phone}</p>
              <p>{order.shippingAddress.address}</p>
              <p>
                {order.shippingAddress.city}, {order.shippingAddress.country}
              </p>
            </div>
          </div>

          <div className="bg-[#121212] border border-gray-800 rounded-3xl p-6 space-y-3">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-white flex items-center space-x-2 border-b border-gray-800 pb-2">
              <CreditCard className="w-4 h-4 text-blue-400" />
              <span>Payment Details</span>
            </h3>
            <div className="text-xs text-gray-300 space-y-1">
              <p className="uppercase font-mono">Method: {order.paymentMethod}</p>
              <p className="capitalize">Status: {order.paymentStatus}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
