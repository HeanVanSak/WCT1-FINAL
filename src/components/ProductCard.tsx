import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { ShoppingBag, Eye, CheckCircle2, AlertCircle } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addItem } = useCart();
  const navigate = useNavigate();
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.stock <= 0) return;

    setAdding(true);
    try {
      await addItem(product, 1);
      setAdded(true);
      setTimeout(() => setAdded(false), 1800);
    } catch (err: any) {
      alert(err.message || 'Failed to add item to cart');
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="group relative bg-[#121212] border border-gray-800/90 hover:border-gray-700 rounded-2xl overflow-hidden shadow-xl transition-all duration-300 flex flex-col h-full hover:-translate-y-1">
      {/* Product Image Container */}
      <div className="relative aspect-4/3 overflow-hidden bg-[#181818] p-3">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Featured / Category Badge */}
        <div className="absolute top-5 left-5 flex flex-wrap gap-1.5 z-10">
          {product.featured && (
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-600 text-white shadow-md">
              Featured
            </span>
          )}
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-[#0d0d0d]/80 backdrop-blur-md text-gray-300 border border-gray-800">
            {product.categoryName}
          </span>
        </div>

        {/* Stock Badge */}
        <div className="absolute bottom-5 right-5 z-10">
          {product.stock > 0 ? (
            <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center space-x-1">
              <CheckCircle2 className="w-3 h-3" />
              <span>{product.stock} in stock</span>
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center space-x-1">
              <AlertCircle className="w-3 h-3" />
              <span>Out of Stock</span>
            </span>
          )}
        </div>
      </div>

      {/* Product Information */}
      <div className="p-5 flex flex-col flex-1 justify-between space-y-4">
        <div className="space-y-1.5">
          <div className="text-[10px] uppercase tracking-[0.2em] font-semibold text-gray-500">
            {product.brand}
          </div>
          <Link to={`/products/${product.id}`} className="block">
            <h3 className="font-bold text-gray-100 group-hover:text-blue-400 transition-colors line-clamp-1 text-base">
              {product.name}
            </h3>
          </Link>
          <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Price & Action */}
        <div className="pt-3 border-t border-gray-800/80 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[9px] uppercase font-bold tracking-widest text-gray-500">Price</span>
            <span className="text-lg font-extrabold text-white">${product.price.toLocaleString()}</span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => navigate(`/products/${product.id}`)}
              className="p-2 rounded-full bg-[#1e1e1e] hover:bg-gray-800 text-gray-300 hover:text-white transition-colors border border-gray-800"
              title="View Details"
              aria-label="View Product Details"
            >
              <Eye className="w-4 h-4" />
            </button>

            <button
              onClick={handleAddToCart}
              disabled={product.stock <= 0 || adding}
              className={`px-4 py-2 rounded-full text-xs font-bold flex items-center space-x-1.5 transition-all ${
                added
                  ? 'bg-emerald-600 text-white'
                  : product.stock <= 0
                  ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                  : 'bg-white text-black hover:bg-gray-200'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>{added ? 'Added' : adding ? 'Adding...' : 'Add'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
