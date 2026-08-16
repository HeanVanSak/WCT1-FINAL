import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  Users, 
  ShoppingBag, 
  Package, 
  DollarSign, 
  ShoppingCart,
  AlertCircle,
  CheckCircle,
  ArrowRight,
  Plus,
  Eye,
  Layers
} from 'lucide-react';
import { getProducts } from '../../services/productService';
import { getAllOrders } from '../../services/orderService';
import { getAllCustomers } from '../../services/authService';
import { getCategories } from '../../services/categoryService';
import { Product, Order } from '../../types';
import { Loading } from '../../components/Loading';

export const AdminDashboard: React.FC = () => {
  const { user, isAdmin } = useAuth();
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  // Stats
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalCustomers: 0,
    totalCategories: 0,
    lowStockItems: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [productsData, ordersData, customersData, categoriesData] = await Promise.all([
          getProducts(),
          getAllOrders(),
          getAllCustomers(),
          getCategories(),
        ]);

        setProducts(productsData);
        setOrders(ordersData);

        // Calculate stats
        const totalRevenue = ordersData.reduce((sum: number, order: Order) => sum + order.total, 0);
        const totalOrders = ordersData.length;
        const totalProducts = productsData.length;
        const totalCustomers = customersData.length;
        const totalCategories = categoriesData.length;
        const lowStockItems = productsData.filter((p: Product) => p.stock < 5).length;

        setStats({
          totalRevenue,
          totalOrders,
          totalProducts,
          totalCustomers,
          totalCategories,
          lowStockItems,
        });
      } catch (error) {
        console.error('Failed to load admin data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // If not admin, show access denied
  if (!isAdmin) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center px-4">
        <div className="bg-rose-500/10 border border-rose-500/30 rounded-2xl p-8 text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-rose-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Access Denied</h2>
          <p className="text-gray-400 text-sm">
            You don't have permission to access the admin dashboard.
            Please contact your system administrator.
          </p>
          <Link to="/" className="mt-6 inline-block px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full text-sm font-bold transition-colors">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return <Loading fullScreen message="Loading admin dashboard..." />;
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white">
              Admin <span className="font-serif italic text-blue-400">Dashboard</span>
            </h1>
            <p className="text-sm text-gray-400 mt-1">
              Welcome back, {user?.name}! Here's what's happening with your store.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/admin/products/new"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Product
            </Link>
            <Link
              to="/admin/orders"
              className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-200 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-colors"
            >
              <Eye className="w-4 h-4" />
              View All
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 mb-8">
          <div className="bg-[#121212] border border-gray-800 rounded-2xl p-4">
            <div className="flex items-center justify-between">
              <DollarSign className="w-5 h-5 text-gray-400" />
              <span className="text-[10px] text-gray-500 uppercase font-bold">Revenue</span>
            </div>
            <p className="text-xl font-bold text-white mt-2">${stats.totalRevenue.toFixed(2)}</p>
          </div>

          <div className="bg-[#121212] border border-gray-800 rounded-2xl p-4">
            <div className="flex items-center justify-between">
              <ShoppingCart className="w-5 h-5 text-gray-400" />
              <span className="text-[10px] text-gray-500 uppercase font-bold">Orders</span>
            </div>
            <p className="text-xl font-bold text-white mt-2">{stats.totalOrders}</p>
          </div>

          <div className="bg-[#121212] border border-gray-800 rounded-2xl p-4">
            <div className="flex items-center justify-between">
              <Package className="w-5 h-5 text-gray-400" />
              <span className="text-[10px] text-gray-500 uppercase font-bold">Products</span>
            </div>
            <p className="text-xl font-bold text-white mt-2">{stats.totalProducts}</p>
          </div>

          <div className="bg-[#121212] border border-gray-800 rounded-2xl p-4">
            <div className="flex items-center justify-between">
              <Users className="w-5 h-5 text-gray-400" />
              <span className="text-[10px] text-gray-500 uppercase font-bold">Customers</span>
            </div>
            <p className="text-xl font-bold text-white mt-2">{stats.totalCustomers}</p>
          </div>

          <div className="bg-[#121212] border border-gray-800 rounded-2xl p-4">
            <div className="flex items-center justify-between">
              <Layers className="w-5 h-5 text-gray-400" />
              <span className="text-[10px] text-gray-500 uppercase font-bold">Categories</span>
            </div>
            <p className="text-xl font-bold text-white mt-2">{stats.totalCategories}</p>
          </div>

          <div className="bg-[#121212] border border-gray-800 rounded-2xl p-4">
            <div className="flex items-center justify-between">
              {stats.lowStockItems > 0 ? (
                <AlertCircle className="w-5 h-5 text-gray-400" />
              ) : (
                <CheckCircle className="w-5 h-5 text-gray-400" />
              )}
              <span className="text-[10px] text-gray-500 uppercase font-bold">Low Stock</span>
            </div>
            <p className={`text-xl font-bold mt-2 ${stats.lowStockItems > 0 ? 'text-rose-400' : 'text-green-400'}`}>
              {stats.lowStockItems}
            </p>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Recent Orders */}
          <div className="bg-[#121212] border border-gray-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Recent Orders
              </h3>
              <Link to="/admin/orders" className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1">
                View All <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="space-y-3">
              {orders.slice(0, 5).map((order) => (
                <div key={order.id} className="flex items-center justify-between p-3 bg-[#1a1a1a] rounded-xl border border-gray-800/50">
                  <div>
                    <p className="text-xs font-bold text-white">#{order.id}</p>
                    <p className="text-[10px] text-gray-400">{order.customerName}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-white">${order.total.toFixed(2)}</span>
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[8px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      <CheckCircle className="w-3 h-3" />
                      Success
                    </span>
                  </div>
                </div>
              ))}
              {orders.length === 0 && (
                <p className="text-center text-gray-500 text-xs py-4">No orders yet.</p>
              )}
            </div>
          </div>

          {/* Low Stock Alert */}
          <div className="bg-[#121212] border border-gray-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Low Stock Items
              </h3>
              <Link to="/admin/products" className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1">
                View All <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="space-y-3">
              {products.filter(p => p.stock < 5).slice(0, 5).map((product) => (
                <div key={product.id} className="flex items-center justify-between p-3 bg-[#1a1a1a] rounded-xl border border-gray-800/50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-800 shrink-0">
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white truncate max-w-150px">{product.name}</p>
                      <p className="text-[10px] text-gray-400">Stock: {product.stock}</p>
                    </div>
                  </div>
                  <span className="px-2 py-1 bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded-full text-[8px] font-bold uppercase tracking-wider">
                    Low Stock
                  </span>
                </div>
              ))}
              {products.filter(p => p.stock < 5).length === 0 && (
                <p className="text-center text-green-400 text-xs py-4 flex items-center justify-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  All products are well-stocked!
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="bg-[#121212] border border-gray-800 rounded-2xl p-6">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
            Quick Actions
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link
              to="/admin/products/new"
              className="flex flex-col items-center justify-center p-4 bg-[#1a1a1a] border border-gray-800/50 rounded-xl hover:border-blue-500/30 hover:bg-blue-500/5 transition-all group"
            >
              <Plus className="w-6 h-6 text-gray-400 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-bold text-gray-300 mt-2">Add Product</span>
            </Link>

            <Link
              to="/admin/orders"
              className="flex flex-col items-center justify-center p-4 bg-[#1a1a1a] border border-gray-800/50 rounded-xl hover:border-blue-500/30 hover:bg-blue-500/5 transition-all group"
            >
              <ShoppingBag className="w-6 h-6 text-gray-400 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-bold text-gray-300 mt-2">View Orders</span>
            </Link>

            <Link
              to="/admin/categories"
              className="flex flex-col items-center justify-center p-4 bg-[#1a1a1a] border border-gray-800/50 rounded-xl hover:border-blue-500/30 hover:bg-blue-500/5 transition-all group"
            >
              <Layers className="w-6 h-6 text-gray-400 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-bold text-gray-300 mt-2">Manage Categories</span>
            </Link>

            <Link
              to="/admin/users"
              className="flex flex-col items-center justify-center p-4 bg-[#1a1a1a] border border-gray-800/50 rounded-xl hover:border-blue-500/30 hover:bg-blue-500/5 transition-all group"
            >
              <Users className="w-6 h-6 text-gray-400 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-bold text-gray-300 mt-2">Manage Users</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
