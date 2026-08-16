import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  ArrowLeft, 
  Package, 
  AlertCircle, 
  CheckCircle,
  Search,
  Plus,
  Edit,
  Eye,
  Filter,
  AlertTriangle,
  TrendingUp,
  ShoppingBag
} from 'lucide-react';
import { getProducts } from '../../services/productService';
import { Product } from '../../types';
import { Loading } from '../../components/Loading';

export const LowStockItems: React.FC = () => {
  const { isAdmin } = useAuth();
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [stockFilter, setStockFilter] = useState<number>(5);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(data);
        // Filter products with stock less than 5 by default
        const lowStock = data.filter(p => p.stock < 5);
        setFilteredProducts(lowStock);
      } catch (err) {
        console.error('Failed to load products:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    // Apply filters whenever search or stock filter changes
    let filtered = products.filter(p => p.stock < stockFilter);
    
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(term) ||
        p.categoryName?.toLowerCase().includes(term) ||
        p.brand?.toLowerCase().includes(term)
      );
    }
    
    setFilteredProducts(filtered);
  }, [searchTerm, stockFilter, products]);

  if (!isAdmin) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="bg-rose-500/10 border border-rose-500/30 rounded-2xl p-8 text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-rose-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Access Denied</h2>
          <p className="text-gray-400 text-sm">You don't have permission to view low stock items.</p>
          <Link to="/admin/dashboard" className="mt-6 inline-block px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full text-sm font-bold transition-colors">
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return <Loading fullScreen message="Loading products..." />;
  }

  const lowStockCount = products.filter(p => p.stock < 5).length;
  const zeroStockCount = products.filter(p => p.stock === 0).length;
  const criticalCount = products.filter(p => p.stock > 0 && p.stock < 3).length;

  const getStockStatus = (stock: number) => {
    if (stock === 0) return { label: 'Out of Stock', color: 'bg-rose-500/20 text-rose-400 border-rose-500/30' };
    if (stock < 3) return { label: 'Critical', color: 'bg-orange-500/20 text-orange-400 border-orange-500/30' };
    if (stock < 5) return { label: 'Low Stock', color: 'bg-amber-500/20 text-amber-400 border-amber-500/30' };
    return { label: 'In Stock', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' };
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-4">
            <Link to="/admin/dashboard" className="p-2 hover:bg-gray-800 rounded-full transition-colors">
              <ArrowLeft className="w-5 h-5 text-gray-400" />
            </Link>
            <div>
              <h1 className="text-3xl font-extrabold text-white">
                Low <span className="font-serif italic text-amber-400">Stock</span> Items
              </h1>
              <p className="text-sm text-gray-400 mt-1">
                Monitor and manage products with low inventory levels
              </p>
            </div>
          </div>
          <Link
            to="/admin/products/new"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Product
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-[#121212] border border-gray-800 rounded-2xl p-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-gray-500 uppercase font-bold">Total Low Stock</span>
              <AlertTriangle className="w-5 h-5 text-gray-400" />
            </div>
            <p className="text-2xl font-bold text-white mt-2">{lowStockCount}</p>
          </div>
          <div className="bg-[#121212] border border-gray-800 rounded-2xl p-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-gray-500 uppercase font-bold">Out of Stock</span>
              <AlertCircle className="w-5 h-5 text-gray-400" />
            </div>
            <p className="text-2xl font-bold text-white mt-2">{zeroStockCount}</p>
          </div>
          <div className="bg-[#121212] border border-gray-800 rounded-2xl p-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-gray-500 uppercase font-bold">Critical</span>
              <AlertTriangle className="w-5 h-5 text-gray-400" />
            </div>
            <p className="text-2xl font-bold text-white mt-2">{criticalCount}</p>
          </div>
          <div className="bg-[#121212] border border-gray-800 rounded-2xl p-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-gray-500 uppercase font-bold">Total Products</span>
              <Package className="w-5 h-5 text-gray-400" />
            </div>
            <p className="text-2xl font-bold text-white mt-2">{products.length}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-[#121212] border border-gray-800 rounded-2xl p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="w-4 h-4 text-gray-500 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-[#1a1a1a] border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
            {/* Stock Filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <select
                value={stockFilter}
                onChange={(e) => setStockFilter(Number(e.target.value))}
                className="px-3 py-2 bg-[#1a1a1a] border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500 transition-colors"
              >
                <option value={5}>Stock &lt; 5</option>
                <option value={10}>Stock &lt; 10</option>
                <option value={20}>Stock &lt; 20</option>
                <option value={50}>Stock &lt; 50</option>
                <option value={100}>All Products</option>
              </select>
            </div>
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-[#121212] border border-gray-800 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#1a1a1a] border-b border-gray-800">
                <tr>
                  <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-gray-500">Product</th>
                  <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-gray-500">Category</th>
                  <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-gray-500">Price</th>
                  <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-gray-500">Stock</th>
                  <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-gray-500">Status</th>
                  <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => {
                  const status = getStockStatus(product.stock);
                  return (
                    <tr key={product.id} className="border-b border-gray-800/50 hover:bg-[#1a1a1a] transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-800 shrink-0">
                            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <p className="text-xs font-medium text-white">{product.name}</p>
                            <p className="text-[10px] text-gray-500">{product.brand || 'HVS Keebs'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs text-gray-300">{product.categoryName || 'Uncategorized'}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs font-bold text-white">${product.price.toFixed(2)}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-bold ${product.stock === 0 ? 'text-rose-400' : product.stock < 3 ? 'text-orange-400' : 'text-amber-400'}`}>
                          {product.stock}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-[8px] font-bold uppercase tracking-wider border ${status.color}`}>
                          {status.label}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1">
                          <Link
                            to={`/admin/products/${product.id}`}
                            className="p-1.5 hover:bg-gray-700 rounded-lg transition-colors"
                            title="View Product"
                          >
                            <Eye className="w-4 h-4 text-gray-400" />
                          </Link>
                          <Link
                            to={`/admin/products/${product.id}/edit`}
                            className="p-1.5 hover:bg-gray-700 rounded-lg transition-colors"
                            title="Edit Product"
                          >
                            <Edit className="w-4 h-4 text-gray-400" />
                          </Link>
                          <button
                            className="p-1.5 hover:bg-blue-500/10 rounded-lg transition-colors"
                            title="Restock"
                          >
                            <TrendingUp className="w-4 h-4 text-gray-400" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {filteredProducts.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <CheckCircle className="w-12 h-12 text-emerald-400" />
                        <p className="text-sm font-medium text-white">No low stock items</p>
                        <p className="text-xs text-gray-500">All products are well-stocked!</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link
            to="/admin/products/new"
            className="flex items-center justify-center gap-2 p-3 bg-[#121212] border border-gray-800 rounded-xl hover:border-blue-500/30 hover:bg-blue-500/5 transition-colors"
          >
            <Plus className="w-4 h-4 text-gray-400" />
            <span className="text-xs font-bold text-gray-300">Add Product</span>
          </Link>
          <Link
            to="/admin/orders"
            className="flex items-center justify-center gap-2 p-3 bg-[#121212] border border-gray-800 rounded-xl hover:border-blue-500/30 hover:bg-blue-500/5 transition-colors"
          >
            <ShoppingBag className="w-4 h-4 text-gray-400" />
            <span className="text-xs font-bold text-gray-300">View Orders</span>
          </Link>
          <Link
            to="/admin/categories"
            className="flex items-center justify-center gap-2 p-3 bg-[#121212] border border-gray-800 rounded-xl hover:border-blue-500/30 hover:bg-blue-500/5 transition-colors"
          >
            <Package className="w-4 h-4 text-gray-400" />
            <span className="text-xs font-bold text-gray-300">Categories</span>
          </Link>
          <Link
            to="/admin/dashboard"
            className="flex items-center justify-center gap-2 p-3 bg-[#121212] border border-gray-800 rounded-xl hover:border-blue-500/30 hover:bg-blue-500/5 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-gray-400" />
            <span className="text-xs font-bold text-gray-300">Dashboard</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
