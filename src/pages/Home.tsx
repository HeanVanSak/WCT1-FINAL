import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types';
import { getProducts } from '../services/productService';
import { ProductCard } from '../components/ProductCard';
import { Loading } from '../components/Loading';
import {
  ArrowRight,
  ShieldCheck,
  Cpu,
  Award,
  Wrench,
  Laptop
} from 'lucide-react';

export const Home: React.FC = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const prods = await getProducts();
        setFeaturedProducts(prods.filter((p) => p.featured).slice(0, 4));
      } catch (err) {
        console.error('Failed to load homepage data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <Loading fullScreen message="Initializing hardware catalog..." />;

  return (
    <div className="space-y-20 pb-20  bg-white">
      {/* Hero Section */}
      {/* Hero Section with Background Image */}
      <section className="relative overflow-hidden pt-16 pb-24 border-b border-gray-800/80">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/image/imagecopy3.png')" }}
        />

        {/* Dark Overlay for readability */}
        <div className="absolute inset-0 bg-black/70" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight">
                HVS Keebs <span className="font-serif italic text-purple-400">Store</span>
              </h1>

              <p className="text-gray-200 text-base sm:text-lg max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Experience extreme computing capabilities with hand-crafted laptops, liquid thermal cooling solutions, and enterprise-grade hardware warranties.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  to="/products"
                  className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-white text-black hover:bg-gray-200 font-extrabold text-xs tracking-wider uppercase transition-all shadow-lg flex items-center justify-center space-x-2"
                >
                  <span>Explore Catalog</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  to="/services"
                  className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#161616]/80 backdrop-blur-sm border border-gray-700 hover:border-gray-500 text-gray-200 font-bold text-xs tracking-wider uppercase flex items-center justify-center space-x-2 transition-colors"
                >
                  <Wrench className="w-4 h-4 text-blue-400" />
                  <span>Custom Builds</span>
                </Link>
              </div>

              <div className="pt-8 grid grid-cols-3 gap-4 border-t border-gray-600/50">
                <div>
                  <div className="text-2xl font-extrabold text-white">100%</div>
                  <div className="text-[10px] uppercase tracking-widest text-gray-300">Stress Tested</div>
                </div>
                <div>
                  <div className="text-2xl font-extrabold text-white">3-Yr</div>
                  <div className="text-[10px] uppercase tracking-widest text-gray-300">Hardware Warranty</div>
                </div>
                <div>
                  <div className="text-2xl font-extrabold text-white">24/7</div>
                  <div className="text-[10px] uppercase tracking-widest text-gray-300">Live Engineers</div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none rounded-3xl bg-[#121212] border border-gray-800 p-3 shadow-2xl">
                <img
                  src="/image/imagecopy2.png"
                  alt="Flagship Gaming Rig"
                  className="rounded-2xl object-cover w-full h-380px"
                />
  
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Featured Products */}
      <section className="max-w-7xl  mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-gray-500 mb-1">
              Engineered Hardwares
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Featured <span className="font-serif italic text-gray-400">Hardwares</span>
            </h2>
          </div>
          <Link
            to="/products"
            className="inline-flex items-center space-x-1.5 text-xs font-bold uppercase tracking-wider text-blue-400 hover:text-blue-300"
          >
            <span>View Full Catalog</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>


      {/* Why Choose Us */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-black">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="text-[10px] font-extrabold uppercase tracking-[0.2em]">
              Why HVS Keebs
            </div>
            <h2 className="text-3xl font-extrabold leading-tight">
              Built for Power Users, Developers & <span className="font-serif italic text-gray-400">Creators</span>
            </h2>
            <p className=" text-black text-xs sm:text-sm leading-relaxed">
              Every system is stress-tested with heavy synthetic benchmarks prior to dispatch. We ensure optimal thermal dissipation, noise control, and memory stability.
            </p>

            <div className="space-y-4 pt-2">
              <div className="flex items-start space-x-3">
                <div className="p-2 rounded-full bg-blue-600/10 text-blue-400 border border-blue-500/20 mt-0.5">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-xs uppercase tracking-wider">3-Year On-Site Hardware Replacement</h4>
                  <p className="text-xs text-gray-500">No lengthy repairs or waiting times. Instant swap guarantee.</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="p-2 rounded-full bg-blue-600/10 text-blue-400 border border-blue-500/20 mt-0.5">
                  <Cpu className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold  text-xs uppercase tracking-wider">Custom BIOS & Thermal Repasting</h4>
                  <p className="text-xs text-gray-500">Liquid metal paste applied for up to 15°C lower operating temps.</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="p-2 rounded-full bg-blue-600/10 text-blue-400 border border-blue-500/20 mt-0.5">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-xs uppercase tracking-wider">Zero Bloatware Guarantee</h4>
                  <p className="text-xs text-gray-500">Clean operating system installations stripped of unwanted OEM tracking.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative bg-[#121212] border border-gray-800 rounded-3xl p-8 space-y-6 shadow-2xl">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-blue-600/20 text-blue-400 rounded-full border border-blue-500/30">
                <Laptop className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-white text-base">Configure Your Custom Hardware</h3>
                <p className="text-xs text-gray-500">Talk directly with our system architects</p>
              </div>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed">
              Need custom RAM allocations, RAID storage setups, or Linux dual-boot pre-configurations? Our engineers configure systems to your exact technical specifications.
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center space-x-2 px-6 py-3 rounded-full bg-white text-black hover:bg-gray-200 text-xs font-bold uppercase tracking-wider transition-all shadow-md"
            >
              <span>Contact System Architect</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};
