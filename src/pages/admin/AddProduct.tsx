import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  ArrowLeft, 
  Plus, 
  Image, 
  Tag, 
  DollarSign, 
  Package, 
  AlignLeft,
  CheckCircle,
  AlertCircle,
  Layers,
  Cpu
} from 'lucide-react';
import { createProduct } from '../../services/productService';
import { getCategories } from '../../services/categoryService';
import { Category } from '../../types';

export const AddProduct: React.FC = () => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    categoryId: '',
    stock: '',
    image: '',
    featured: false,
    brand: '',
    cpu: '',
    display: '',
    gpu: '',
    ram: '',
    storage: ''
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (err) {
        console.error('Failed to load categories:', err);
      }
    };
    fetchCategories();
  }, []);

  // If not admin, redirect
  if (!isAdmin) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="bg-rose-500/10 border border-rose-500/30 rounded-2xl p-8 text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-rose-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Access Denied</h2>
          <p className="text-gray-400 text-sm">You don't have permission to add products.</p>
          <Link to="/admin/dashboard" className="mt-6 inline-block px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full text-sm font-bold transition-colors">
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }


  const selectedCategory = categories.find((category) => category.id === form.categoryId);
  const isAccessories = selectedCategory?.name.toLowerCase().includes('accessor') ?? false;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const specifications: Record<string, string> = isAccessories
        ? {}
        : {
            CPU: form.cpu.trim(),
            DISPLAY: form.display.trim(),
            GPU: form.gpu.trim(),
            RAM: form.ram.trim(),
            STORAGE: form.storage.trim()
          };

      const productData = {
        name: form.name,
        description: form.description,
        price: parseFloat(form.price),
        categoryId: form.categoryId,
        categoryName: categories.find(c => c.id === form.categoryId)?.name || '',
        stock: parseInt(form.stock),
        image: form.image || '/image/image copy.png',
        brand: form.brand || 'HVS Keebs',
        specifications,
        featured: form.featured
      };

      await createProduct(productData);
      setSuccess(true);
      setTimeout(() => {
        navigate('/admin/dashboard');
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Failed to create product.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-100 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link to="/admin/dashboard" className="p-2 hover:bg-gray-800 rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-400" />
          </Link>
          <div>
            <h1 className="text-3xl font-extrabold text-white">
              Add <span className="font-serif italic text-blue-400">Product</span>
            </h1>
            <p className="text-sm text-gray-400 mt-1">Add a new product to your catalog</p>
          </div>
        </div>

        {/* Success Message */}
        {success && (
          <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-emerald-400 text-sm flex items-center gap-3">
            <CheckCircle className="w-5 h-5" />
            <span>Product created successfully! Redirecting...</span>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/30 rounded-2xl text-rose-400 text-sm flex items-center gap-3">
            <AlertCircle className="w-5 h-5" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-[#121212] border border-gray-800 rounded-2xl p-6 md:p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Product Name */}
            <div className="md:col-span-2">
              <label className="block text-gray-400 mb-1 font-bold text-[10px] uppercase tracking-wider">
                Product Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full pl-9 pr-3 py-2.5 bg-[#1a1a1a] border border-gray-700 rounded-xl text-white focus:outline-none focus:border-blue-500 transition-colors"
                />
                <Tag className="w-4 h-4 text-gray-500 absolute left-3 top-3" />
              </div>
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="block text-gray-400 mb-1 font-bold text-[10px] uppercase tracking-wider">
                Description
              </label>
              <div className="relative">
                <textarea
                  rows={4}
                  required
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full pl-9 pr-3 py-2.5 bg-[#1a1a1a] border border-gray-700 rounded-xl text-white focus:outline-none focus:border-blue-500 transition-colors"
                />
                <AlignLeft className="w-4 h-4 text-gray-500 absolute left-3 top-3" />
              </div>
            </div>

            {/* Price */}
            <div>
              <label className="block text-gray-400 mb-1 font-bold text-[10px] uppercase tracking-wider">
                Price ($)
              </label>
              <div className="relative">
                <input
                  type="number"
                  required
                  step="0.01"
                  min="0"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  className="w-full pl-9 pr-3 py-2.5 bg-[#1a1a1a] border border-gray-700 rounded-xl text-white focus:outline-none focus:border-blue-500 transition-colors"
                />
                <DollarSign className="w-4 h-4 text-gray-500 absolute left-3 top-3" />
              </div>
            </div>

            {/* Stock */}
            <div>
              <label className="block text-gray-400 mb-1 font-bold text-[10px] uppercase tracking-wider">
                Stock Quantity
              </label>
              <div className="relative">
                <input
                  type="number"
                  required
                  min="0"
                  value={form.stock}
                  onChange={(e) => setForm({ ...form, stock: e.target.value })}
                  className="w-full pl-9 pr-3 py-2.5 bg-[#1a1a1a] border border-gray-700 rounded-xl text-white focus:outline-none focus:border-blue-500 transition-colors"
                />
                <Package className="w-4 h-4 text-gray-500 absolute left-3 top-3" />
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="block text-gray-400 mb-1 font-bold text-[10px] uppercase tracking-wider">
                Category
              </label>
              <div className="relative">
                <select
                  required
                  value={form.categoryId}
                  onChange={(e) => {
                    const categoryId = e.target.value;
                    const category = categories.find((cat) => cat.id === categoryId);
                    const selectingAccessories = category?.name.toLowerCase().includes('accessor') ?? false;

                    setForm({
                      ...form,
                      categoryId,
                      ...(selectingAccessories
                        ? { cpu: '', display: '', gpu: '', ram: '', storage: '' }
                        : {})
                    });
                  }}
                  className="w-full pl-9 pr-3 py-2.5 bg-[#1a1a1a] border border-gray-700 rounded-xl text-white focus:outline-none focus:border-blue-500 transition-colors appearance-none"
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
                <Layers className="w-4 h-4 text-gray-500 absolute left-3 top-3" />
              </div>
              {/* Show selected category name */}
              {form.categoryId && (
                <p className="text-[10px] text-emerald-400 mt-1">
                  ✓ Selected: {selectedCategory?.name}
                </p>
              )}
            </div>

            {/* Brand */}
            <div>
              <label className="block text-gray-400 mb-1 font-bold text-[10px] uppercase tracking-wider">
                Brand
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={form.brand}
                  onChange={(e) => setForm({ ...form, brand: e.target.value })}
                  className="w-full pl-9 pr-3 py-2.5 bg-[#1a1a1a] border border-gray-700 rounded-xl text-white focus:outline-none focus:border-blue-500 transition-colors"
                />
                <Tag className="w-4 h-4 text-gray-500 absolute left-3 top-3" />
              </div>
            </div>

            {/* Image URL */}
            <div className="md:col-span-2">
              <label className="block text-gray-400 mb-1 font-bold text-[10px] uppercase tracking-wider">
                Image URL
              </label>
              <div className="relative">
                <input
                  type="url"
                  value={form.image}
                  onChange={(e) => setForm({ ...form, image: e.target.value })}
                  className="w-full pl-9 pr-3 py-2.5 bg-[#1a1a1a] border border-gray-700 rounded-xl text-white focus:outline-none focus:border-blue-500 transition-colors"
                />
                <Image className="w-4 h-4 text-gray-500 absolute left-3 top-3" />
              </div>
              <p className="text-[10px] text-gray-500 mt-1">Leave empty to use default image</p>
            </div>
          </div>

          {/* Laptop Specifications Section - hidden for accessories */}
          {!isAccessories && (
          <div className="border-t border-gray-800 pt-6">
            <div className="flex items-center gap-2 mb-4">
              <Cpu className="w-5 h-5 text-gray-400" />
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Laptop Specifications</h3>
                <p className="text-[10px] text-gray-500 mt-1">Enter CPU, display, GPU, RAM and storage. These values are saved automatically with the product.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* CPU */}
              <div>
                <label className="block text-gray-400 mb-1 font-bold text-[10px] uppercase tracking-wider">CPU</label>
                <input
                  type="text"
                  required
                  value={form.cpu}
                  onChange={(e) => setForm({ ...form, cpu: e.target.value })}
                  className="w-full px-3 py-2.5 bg-[#1a1a1a] border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>

              {/* Display */}
              <div>
                <label className="block text-gray-400 mb-1 font-bold text-[10px] uppercase tracking-wider">Display</label>
                <input
                  type="text"
                  required
                  value={form.display}
                  onChange={(e) => setForm({ ...form, display: e.target.value })}
                  className="w-full px-3 py-2.5 bg-[#1a1a1a] border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>

              {/* GPU */}
              <div>
                <label className="block text-gray-400 mb-1 font-bold text-[10px] uppercase tracking-wider">GPU</label>
                <input
                  type="text"
                  required
                  value={form.gpu}
                  onChange={(e) => setForm({ ...form, gpu: e.target.value })}
                  className="w-full px-3 py-2.5 bg-[#1a1a1a] border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>

              {/* RAM */}
              <div>
                <label className="block text-gray-400 mb-1 font-bold text-[10px] uppercase tracking-wider">RAM</label>
                <input
                  type="text"
                  required
                  value={form.ram}
                  onChange={(e) => setForm({ ...form, ram: e.target.value })}
                  className="w-full px-3 py-2.5 bg-[#1a1a1a] border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>

              {/* Storage */}
              <div className="md:col-span-2">
                <label className="block text-gray-400 mb-1 font-bold text-[10px] uppercase tracking-wider">Storage</label>
                <input
                  type="text"
                  required
                  value={form.storage}
                  onChange={(e) => setForm({ ...form, storage: e.target.value })}
                  className="w-full px-3 py-2.5 bg-[#1a1a1a] border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
            </div>
          </div>
          )}

          {/* Featured Toggle */}
          <div className="flex items-center gap-3 p-4 bg-[#1a1a1a] rounded-xl border border-gray-700">
            <input
              type="checkbox"
              id="featured"
              checked={form.featured}
              onChange={(e) => setForm({ ...form, featured: e.target.checked })}
              className="w-4 h-4 accent-blue-500"
            />
            <label htmlFor="featured" className="text-xs font-bold text-gray-300">
              Featured Product
            </label>
            <span className="text-[10px] text-gray-500">(Show on homepage)</span>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={submitting}
              className="px-8 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-extrabold rounded-full text-xs flex items-center gap-2 transition-colors uppercase tracking-wider"
            >
              <Plus className="w-4 h-4" />
              {submitting ? 'Creating...' : 'Create Product'}
            </button>
            <Link
              to="/admin/dashboard"
              className="px-8 py-3 bg-gray-800 hover:bg-gray-700 text-gray-300 font-extrabold rounded-full text-xs flex items-center gap-2 transition-colors uppercase tracking-wider"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};