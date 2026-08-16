import React, { useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Product, Category, FilterState } from '../types';
import { listenToProducts } from '../services/productService';
import { getCategories } from '../services/categoryService';
import { ProductCard } from '../components/ProductCard';
import { Loading } from '../components/Loading';
import { Search, SlidersHorizontal, RotateCcw, Filter, PackageX } from 'lucide-react';

export const Products: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || '';
  const initialSearch = searchParams.get('search') || '';

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState<FilterState>({
    search: initialSearch,
    category: initialCategory,
    brand: '',
    minPrice: 0,
    maxPrice: 10000,
    inStockOnly: false,
    sortBy: 'featured'
  });

  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Load categories (static – could also listen, but optional)
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const cats = await getCategories();
        setCategories(cats);
      } catch (err) {
        console.error('Failed to load categories:', err);
      }
    };
    loadCategories();
  }, []);

  // 🔥 REAL‑TIME PRODUCTS LISTENER
  useEffect(() => {
    setLoading(true);
    const unsubscribe = listenToProducts((updatedProducts) => {
      setProducts(updatedProducts);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Sync URL params with filters
  useEffect(() => {
    const qCat = searchParams.get('category');
    const qSearch = searchParams.get('search');
    if (qCat !== null && qCat !== filters.category) {
      setFilters((prev) => ({ ...prev, category: qCat }));
    }
    if (qSearch !== null && qSearch !== filters.search) {
      setFilters((prev) => ({ ...prev, search: qSearch }));
    }
  }, [searchParams]);

  // Update URL when filters change (debounced via useEffect)
  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.search) params.set('search', filters.search);
    if (filters.category) params.set('category', filters.category);
    setSearchParams(params, { replace: true });
  }, [filters.search, filters.category, setSearchParams]);

  // Brands
  const brands = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => {
      if (p.brand) set.add(p.brand);
    });
    return Array.from(set).sort();
  }, [products]);

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        if (filters.search) {
          const q = filters.search.toLowerCase();
          const matchName = p.name.toLowerCase().includes(q);
          const matchBrand = p.brand?.toLowerCase().includes(q);
          const matchCategory = p.categoryName?.toLowerCase().includes(q);
          const matchDesc = p.description?.toLowerCase().includes(q);
          if (!matchName && !matchBrand && !matchCategory && !matchDesc) return false;
        }
        if (filters.category && p.categoryId !== filters.category) return false;
        if (filters.brand && p.brand !== filters.brand) return false;
        if (p.price < filters.minPrice || p.price > filters.maxPrice) return false;
        if (filters.inStockOnly && p.stock <= 0) return false;
        return true;
      })
      .sort((a, b) => {
        if (filters.sortBy === 'price-asc') return a.price - b.price;
        if (filters.sortBy === 'price-desc') return b.price - a.price;
        if (filters.sortBy === 'name-asc') return a.name.localeCompare(b.name);
        if (filters.sortBy === 'newest') {
          return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
        }
        if (a.featured !== b.featured) return a.featured ? -1 : 1;
        return 0;
      });
  }, [products, filters]);

  const resetFilters = () => {
    setFilters({
      search: '',
      category: '',
      brand: '',
      minPrice: 0,
      maxPrice: 10000,
      inStockOnly: false,
      sortBy: 'featured'
    });
    setSearchParams({});
  };

  if (loading) return <Loading fullScreen message="Loading catalog..." />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Catalog Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-800 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-white">Hardware <span className="font-serif italic text-gray-400">Catalog</span></h1>
          <p className="text-xs text-gray-400 mt-1">
            Showing <span className="font-bold text-blue-400">{filteredProducts.length}</span> of {products.length} systems
          </p>
        </div>

        {/* Search & Mobile Filter Toggle */}
        <div className="flex items-center space-x-3">
          <div className="relative flex-1 md:w-72">
            <input
              type="text"
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="w-full pl-9 pr-4 py-2 bg-[#161616] border border-gray-800 rounded-full text-xs text-gray-100 placeholder-gray-500 focus:outline-none focus:border-blue-500"
            />
            <Search className="w-3.5 h-3.5 text-gray-500 absolute left-3.5 top-3" />
          </div>

          <button
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="lg:hidden p-2.5 bg-[#161616] border border-gray-800 rounded-full text-gray-300 hover:text-white flex items-center space-x-1.5 text-xs font-semibold"
          >
            <SlidersHorizontal className="w-4 h-4 text-blue-400" />
            <span>Filters</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Filters */}
        <aside
          className={`lg:block ${
            mobileFilterOpen ? 'block' : 'hidden'
          } bg-[#121212] border border-gray-800 rounded-2xl p-6 space-y-6 h-fit sticky top-24`}
        >
          <div className="flex items-center justify-between border-b border-gray-800 pb-4">
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-blue-400" />
              <h3 className="font-bold text-xs uppercase tracking-wider text-gray-200">Filter Products</h3>
            </div>
            <button
              onClick={resetFilters}
              className="text-xs text-gray-400 hover:text-blue-400 flex items-center space-x-1 transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>

          {/* Sort By */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Sort By</label>
            <select
              value={filters.sortBy}
              onChange={(e) => setFilters({ ...filters, sortBy: e.target.value as any })}
              className="w-full px-3 py-2 bg-[#181818] border border-gray-800 rounded-xl text-xs text-gray-200 focus:outline-none focus:border-blue-500"
            >
              <option value="featured">Featured First</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="newest">Newest Arrivals</option>
              <option value="name-asc">Name: A to Z</option>
            </select>
          </div>

          {/* Category Filter */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Category</label>
            <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
              <button
                onClick={() => setFilters({ ...filters, category: '' })}
                className={`w-full text-left px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  filters.category === ''
                    ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30 font-bold'
                    : 'text-gray-400 hover:bg-gray-800/60 hover:text-gray-200'
                }`}
              >
                All Categories
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setFilters({ ...filters, category: cat.id })}
                  className={`w-full text-left px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                    filters.category === cat.id
                      ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30 font-bold'
                      : 'text-gray-400 hover:bg-gray-800/60 hover:text-gray-200'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Brand Filter */}
          {brands.length > 0 && (
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Brand</label>
              <select
                value={filters.brand}
                onChange={(e) => setFilters({ ...filters, brand: e.target.value })}
                className="w-full px-3 py-2 bg-[#181818] border border-gray-800 rounded-xl text-xs text-gray-200 focus:outline-none focus:border-blue-500"
              >
                <option value="">All Brands</option>
                {brands.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>
          )}

          {/* Price Filter */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Max Price</label>
              <span className="text-xs font-bold text-blue-400">${filters.maxPrice}</span>
            </div>
            <input
              type="range"
              min="100"
              max="5000"
              step="100"
              value={filters.maxPrice}
              onChange={(e) => setFilters({ ...filters, maxPrice: Number(e.target.value) })}
              className="w-full accent-blue-500"
            />
          </div>

          {/* Availability Filter */}
          <div className="pt-2 border-t border-gray-800">
            <label className="flex items-center space-x-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.inStockOnly}
                onChange={(e) => setFilters({ ...filters, inStockOnly: e.target.checked })}
                className="w-4 h-4 rounded bg-[#181818] border-gray-700 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-xs font-medium text-gray-300">In Stock Only</span>
            </label>
          </div>
        </aside>

        {/* Product Grid */}
        <main className="lg:col-span-3">
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          ) : (
            <div className="bg-[#121212] border border-gray-800 rounded-2xl p-12 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-gray-800/80 flex items-center justify-center mx-auto text-gray-400">
                <PackageX className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">No matching systems found</h3>
              <p className="text-xs text-gray-400 max-w-sm mx-auto">
                Try loosening your filters or searching for another hardware specification.
              </p>
              <button
                onClick={resetFilters}
                className="px-6 py-2.5 bg-white text-black rounded-full text-xs font-bold hover:bg-gray-200 transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
