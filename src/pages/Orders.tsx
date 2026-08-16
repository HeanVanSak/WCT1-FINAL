import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getCustomerOrders } from '../services/orderService';
import { Order } from '../types';
import { Loading } from '../components/Loading';
import { Package, Eye, CheckCircle2 } from 'lucide-react';

export const Orders: React.FC = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;
      try {
        const list = await getCustomerOrders(user.uid);
        setOrders(list);
      } catch (err) {
        console.error('Error loading orders:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [user]);

  if (loading) return <Loading fullScreen message="Loading order history..." />;

  const getStatusBadge = () => (
    <span className="px-3 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center space-x-1">
      <CheckCircle2 className="w-3 h-3" />
      <span>Success</span>
    </span>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-white">My Order <span className="font-serif italic text-gray-400">History</span></h1>
        <p className="text-xs text-gray-400 mt-1">Track current shipments and review past workstation purchases</p>
      </div>

      {orders.length === 0 ? (
        <div className="bg-[#121212] border border-gray-800 rounded-3xl p-12 text-center space-y-4">
          <Package className="w-12 h-12 text-gray-500 mx-auto" />
          <h3 className="text-lg font-bold text-white">No Orders Placed Yet</h3>
          <p className="text-xs text-gray-400 max-w-sm mx-auto">
            You haven't placed any hardware orders. Browse our catalog to assemble your first rig.
          </p>
          <Link
            to="/products"
            className="inline-block px-6 py-2.5 bg-white text-black rounded-full text-xs font-bold hover:bg-gray-200 transition-colors"
          >
            Explore Hardware Catalog
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-[#121212] border border-gray-800 hover:border-gray-700 rounded-3xl p-6 transition-colors space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-800 pb-4">
                <div className="space-y-1">
                  <div className="flex items-center space-x-3">
                    <span className="font-mono font-bold text-white text-sm">{order.id}</span>
                    {getStatusBadge()}
                  </div>
                  <p className="text-xs text-gray-500">
                    Placed on {new Date(order.createdAt).toLocaleDateString()} at{' '}
                    {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-[10px] uppercase font-bold text-gray-500">Total</p>
                    <p className="text-base font-extrabold text-blue-400">
                      ${order.total.toLocaleString()}
                    </p>
                  </div>

                  <Link
                    to={`/orders/${order.id}`}
                    className="px-4 py-2 bg-[#181818] border border-gray-800 hover:bg-gray-800 text-white rounded-full text-xs font-bold flex items-center space-x-1.5 transition-colors uppercase tracking-wider"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Details</span>
                  </Link>
                </div>
              </div>

              {/* Items Preview */}
              <div className="flex items-center space-x-3 overflow-x-auto pb-1">
                {order.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center space-x-2 bg-[#161616] px-3 py-1.5 rounded-full border border-gray-800/80 shrink-0 text-xs"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-6 h-6 rounded-full object-cover"
                    />
                    <span className="text-gray-300 max-w-[140px] truncate">{item.name}</span>
                    <span className="text-gray-500 font-bold">×{item.quantity}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
