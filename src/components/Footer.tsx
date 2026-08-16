import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Truck, RefreshCw, Headphones, MapPin, Phone } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className=" bg-white/90 border-t border-gray-800 text-gray-400 text-xs">
      {/* Value Proposition Bar */}
      <div className="border-b border-gray-800/60 bg-[#0d0d0d]">
        <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center md:text-left">
          <div className="flex flex-col items-center md:items-start space-y-2">
            <div className="p-2.5 rounded-full bg-blue-600/10 text-blue-400 border border-blue-500/20">
              <Truck className="w-5 h-5" />
            </div>
            <h4 className="text-xs font-bold text-gray-200 uppercase tracking-wider">Express Global Shipping</h4>
            <p className="text-[11px] text-gray-500">Free delivery on orders over $1,500</p>
          </div>

          <div className="flex flex-col items-center md:items-start space-y-2">
            <div className="p-2.5 rounded-full bg-blue-600/10 text-blue-400 border border-blue-500/20">
              <Shield className="w-5 h-5" />
            </div>
            <h4 className="text-xs font-bold text-gray-200 uppercase tracking-wider">3-Year Enterprise Warranty</h4>
            <p className="text-[11px] text-gray-500">Full hardware replacement guarantee</p>
          </div>

          <div className="flex flex-col items-center md:items-start space-y-2">
            <div className="p-2.5 rounded-full bg-blue-600/10 text-blue-400 border border-blue-500/20">
              <RefreshCw className="w-5 h-5" />
            </div>
            <h4 className="text-xs font-bold text-gray-200 uppercase tracking-wider">30-Day Money Back</h4>
            <p className="text-[11px] text-gray-500">Hassle-free return policy</p>
          </div>

          <div className="flex flex-col items-center md:items-start space-y-2">
            <div className="p-2.5 rounded-full bg-blue-600/10 text-blue-400 border border-blue-500/20">
              <Headphones className="w-5 h-5" />
            </div>
            <h4 className="text-xs font-bold text-gray-200 uppercase tracking-wider">24/7 Tech Concierge</h4>
            <p className="text-[11px] text-gray-500">Live engineer support</p>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-5 gap-8">
        <div className="md:col-span-2 space-y-4">
          <Link to="/" className="flex items-center space-x-2.5 shrink-0 group">
                <img src="/image/Logo.png" alt="Company Logo" className="w-16 h-16 rounded-full object-cover" />
              <div className="flex flex-col">
                <span className="font-extrabold text-lg tracking-tight text-gray-900">
                  HVS<span className="font-serif italic text-purple-600">Keebs</span>
                </span>
                <span className="text-[9px] uppercase tracking-[0.2em] text-gray-500 font-semibold -mt-1">
              COMPUTER & ACCESSORIES
               </span>
              </div>
            </Link>
          <p className="text-gray-400 text-xs max-w-sm leading-relaxed">
           We offer good quility keyboard and keyboard accessories.
          </p>
          <div className="flex items-center space-x-4 text-xs text-gray-400 pt-2">
            <div className="flex items-center space-x-1.5">
              <MapPin className="w-3.5 h-3.5 text-blue-400" />
              <span>Phnom Penh, CAMBODIA</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <Phone className="w-3.5 h-3.5 text-blue-400" />
              <span>+(855)97-3682-442</span>
            </div>
          </div>
        </div>

        <div>
          <h5 className="font-bold mb-3 text-[10px] uppercase tracking-[0.2em]">Navigation</h5>
          <ul className="space-y-2 text-xs">
            <li><Link to="/products" className="hover:text-white transition-colors">Catalog</Link></li>
            <li><Link to="/services" className="hover:text-white transition-colors">Services</Link></li>
            <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
            <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h5 className="font-bold mb-3 text-[10px] uppercase tracking-[0.2em]">Account</h5>
          <ul className="space-y-2 text-xs">
            <li><Link to="/orders" className="hover:text-white transition-colors">My Orders</Link></li>
            <li><Link to="/cart" className="hover:text-white transition-colors">Shopping Cart</Link></li>
            <li><Link to="/profile" className="hover:text-white transition-colors">Profile</Link></li>
            <li><Link to="/login" className="hover:text-white transition-colors">Login / Register</Link></li>
          </ul>
        </div>

        <div>
          <h5 className="font-bold mb-3 text-[10px] uppercase tracking-[0.2em]">Newsletter</h5>
          <p className="text-xs text-gray-500 mb-3">Get exclusive product drops and engineering discounts.</p>
          <form onSubmit={(e) => e.preventDefault()} className="space-y-2">
            <div className="relative">
              <input
                type="email"
                className="w-full pl-3 pr-16 py-2 bg-[#161616] border border-gray-800 rounded-full text-xs text-gray-200 placeholder-gray-500 focus:outline-none focus:border-blue-500"
              />
              <button
                type="submit"
                className="absolute right-1 top-1 bottom-1 px-3 bg-white text-black rounded-full text-[10px] font-bold hover:bg-gray-200 transition-colors"
              >
                Join
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="border-t border-gray-800/60 py-6 text-center text-xs text-gray-600">
        <p>© {new Date().getFullYear()} HVS Keebs. All rights reserved.</p>
      </div>
    </footer>
  );
};
