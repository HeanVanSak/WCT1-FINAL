import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  ArrowLeft,
  Eye,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { getAllOrders } from '../../services/orderService';
import { Order } from '../../types';
import { Loading } from '../../components/Loading';

export const ViewOrders: React.FC = () => {
  const { isAdmin } = useAuth();
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getAllOrders();
        setOrders(data);
      } catch (err) {
        console.error('Failed to load orders:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (!isAdmin) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="bg-rose-500/10 border border-rose-500/30 rounded-2xl p-8 text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-rose-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Access Denied</h2>
          <p className="text-gray-400 text-sm">You don't have permission to view orders.</p>
          <Link
            to="/admin/dashboard"
            className="mt-6 inline-block px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full text-sm font-bold transition-colors"
          >
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return <Loading fullScreen message="Loading orders..." />;
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link to="/admin/dashboard" className="p-2 hover:bg-gray-800 rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-400" />
          </Link>
          <div>
            <h1 className="text-3xl font-extrabold text-white">
              Orders <span className="italic text-blue-400">Management</span>
            </h1>
            <p className="text-sm text-gray-400 mt-1">View all successful customer orders</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6 max-w-lg">
          <div className="bg-[#121212] border border-gray-800 rounded-xl p-4">
            <p className="text-[10px] uppercase tracking-wider text-gray-500">Total Orders</p>
            <p className="text-2xl font-bold text-white mt-1">{orders.length}</p>
          </div>
          <div className="bg-[#121212] border border-emerald-500/20 rounded-xl p-4">
            <p className="text-[10px] uppercase tracking-wider text-emerald-400">Success</p>
            <p className="text-2xl font-bold text-emerald-400 mt-1">{orders.length}</p>
          </div>
        </div>

        <div className="bg-[#121212] border border-gray-800 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#1a1a1a] border-b border-gray-800">
                <tr>
                  <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-gray-500">Order ID</th>
                  <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-gray-500">Customer</th>
                  <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-gray-500">Total</th>
                  <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-gray-500">Status</th>
                  <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-gray-500">Date</th>
                  <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-b border-gray-800/50 hover:bg-[#1a1a1a] transition-colors">
                    <td className="px-4 py-3">
                      <span className="text-xs font-mono text-gray-300">#{order.id.slice(0, 8)}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <p className="text-xs font-medium text-white">{order.customerName}</p>
                        <p className="text-[10px] text-gray-500">{order.customerEmail}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs font-bold text-white">${order.total.toFixed(2)}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[8px] font-bold uppercase tracking-wider border bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                        <CheckCircle className="w-3 h-3" />
                        Success
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs text-gray-400">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        to={`/admin/orders/${order.id}`}
                        className="p-1.5 hover:bg-gray-700 rounded-lg transition-colors inline-flex"
                      >
                        <Eye className="w-4 h-4 text-gray-400" />
                      </Link>
                    </td>
                  </tr>
                ))}
                {orders.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-gray-500 text-sm">
                      No orders found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
