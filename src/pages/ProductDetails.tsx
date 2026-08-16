import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Product } from '../types';
import { listenToProduct } from '../services/productService'; // ✅ use listener
import { useCart } from '../context/CartContext';
import { Loading } from '../components/Loading';
import {
  ShoppingBag,
  Zap,
  CheckCircle2,
  AlertCircle,
  Truck,
  Shield,
  ArrowLeft,
  Minus,
  Plus
} from 'lucide-react';

export const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addItem } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);

  // 🔥 Real‑time product subscription
  useEffect(() => {
    if (!id) return;
    setLoading(true);
    const unsubscribe = listenToProduct(id, (updatedProduct) => {
      setProduct(updatedProduct);
      setLoading(false);
    });
    return () => unsubscribe(); // Cleanup on unmount or id change
  }, [id]);

  // Reset quantity when product changes
  useEffect(() => {
    setQuantity(1);
  }, [product?.id]);

  if (loading) return <Loading fullScreen message="Retrieving hardware specs..." />;

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
        <h2 className="text-2xl font-bold text-white">System Not Found</h2>
        <p className="text-gray-400 text-xs">The requested hardware model may have been archived or removed.</p>
        <Link
          to="/products"
          className="inline-flex items-center space-x-2 px-6 py-2.5 bg-white text-black rounded-full text-xs font-bold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Catalog</span>
        </Link>
      </div>
    );
  }

  const isAccessories = product.categoryName?.toLowerCase().includes('accessor') ?? false;

  const handleAddToCart = async () => {
    if (product.stock <= 0) return;
    setAdding(true);
    try {
      await addItem(product, quantity);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } catch (err: any) {
      alert(err.message || 'Error adding to cart');
    } finally {
      setAdding(false);
    }
  };

  const handleBuyNow = async () => {
    if (product.stock <= 0) return;
    await addItem(product, quantity);
    navigate('/checkout');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center space-x-2 text-xs text-gray-500">
        <Link to="/" className="hover:text-gray-300">
          Home
        </Link>
        <span>/</span>
        <Link to="/products" className="hover:text-gray-300">
          Catalog
        </Link>
        <span>/</span>
        <span className="text-blue-400 font-semibold truncate max-w-xs">{product.name}</span>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left: Product Image */}
        <div className="lg:col-span-6 space-y-4">
          <div className="aspect-4/3 rounded-3xl overflow-hidden bg-[#181818] border border-gray-800 p-3 shadow-2xl relative">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover rounded-2xl"
            />
            {product.featured && (
              <span className="absolute top-6 left-6 px-3 py-1 bg-blue-600 text-white font-extrabold text-[10px] uppercase tracking-wider rounded-full shadow-md">
                Featured Flagship
              </span>
            )}
          </div>
        </div>

        {/* Right: Product Details & Controls */}
        <div className="lg:col-span-6 space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-gray-500">
                {product.brand}
              </span>
              <span className="text-[10px] uppercase tracking-wider text-gray-400 bg-[#161616] px-3 py-1 rounded-full border border-gray-800">
                {product.categoryName}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">{product.name}</h1>

            <div className="flex items-center space-x-4 pt-2">
              <span className="text-3xl font-black text-white">
                ${product.price.toLocaleString()}
              </span>

              {product.stock > 0 ? (
                <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full text-xs font-semibold flex items-center space-x-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>In Stock ({product.stock} units)</span>
                </span>
              ) : (
                <span className="px-3 py-1 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-full text-xs font-semibold flex items-center space-x-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>Out of Stock</span>
                </span>
              )}
            </div>
          </div>

          <div className="border-t border-gray-800/80 pt-4">
            <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-gray-500 mb-2">Description</h4>
            <p className="text-gray-300 text-xs leading-relaxed">{product.description}</p>
          </div>

          {/* Quantity Selector & Action Buttons */}
          {product.stock > 0 && (
            <div className="space-y-4 pt-4 border-t border-gray-800/80">
              <div className="flex items-center space-x-4">
                <span className="text-xs font-semibold text-gray-300">Quantity:</span>
                <div className="flex items-center bg-[#161616] border border-gray-800 rounded-full p-1">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    className="p-1.5 rounded-full text-gray-400 hover:text-white disabled:opacity-40"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-4 font-bold text-xs text-white">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    disabled={quantity >= product.stock}
                    className="p-1.5 rounded-full text-gray-400 hover:text-white disabled:opacity-40"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <span className="text-[10px] text-gray-500">Max {product.stock} units</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  onClick={handleAddToCart}
                  disabled={adding}
                  className={`py-3.5 px-6 rounded-full font-bold text-xs flex items-center justify-center space-x-2 transition-all shadow-lg uppercase tracking-wider ${
                    added
                      ? 'bg-emerald-600 text-white'
                      : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/30'
                  }`}
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>{added ? 'Added to Cart!' : adding ? 'Adding...' : 'Add to Cart'}</span>
                </button>

                <button
                  onClick={handleBuyNow}
                  className="py-3.5 px-6 rounded-full font-extrabold text-xs bg-white text-black hover:bg-gray-200 flex items-center justify-center space-x-2 transition-all shadow-lg uppercase tracking-wider"
                >
                  <Zap className="w-4 h-4 fill-black" />
                  <span>Buy Now</span>
                </button>
              </div>
            </div>
          )}

          {/* Warranty & Guarantee Highlights */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-800/80">
            <div className="flex items-center space-x-3 bg-[#121212] p-3.5 rounded-2xl border border-gray-800">
              <Truck className="w-5 h-5 text-blue-400 shrink-0" />
              <div>
                <h5 className="text-xs font-bold text-white uppercase tracking-wider">Express Air Shipping</h5>
                <p className="text-[10px] text-gray-500">Dispatched in 24 hours</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 bg-[#121212] p-3.5 rounded-2xl border border-gray-800">
              <Shield className="w-5 h-5 text-blue-400 shrink-0" />
              <div>
                <h5 className="text-xs font-bold text-white uppercase tracking-wider">3-Year On-Site Swap</h5>
                <p className="text-[10px] text-gray-500">Includes thermal tuning</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Specifications Table */}
      {!isAccessories && product.specifications && Object.keys(product.specifications).length > 0 && (
        <div className="bg-[#121212] border border-gray-800 rounded-3xl p-6 sm:p-8 space-y-6">
          <h3 className="text-lg font-bold text-white flex items-center space-x-2">
            <span>Technical <span className="font-serif italic text-gray-400">Specifications</span></span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(product.specifications).map(([key, val]) => (
              <div
                key={key}
                className="flex items-center justify-between p-3.5 rounded-xl bg-[#161616] border border-gray-800/80"
              >
                <span className="text-xs font-semibold text-gray-400">{key}</span>
                <span className="text-xs font-bold text-gray-200">{val}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
