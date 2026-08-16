import React from 'react';
import { Shield, Cpu } from 'lucide-react';

export const About: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-blue-400">
          Engineering Excellence
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
          About <span className="font-serif italic text-gray-400">HVS Keebs</span>
        </h1>
        <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">
          Founded in Cambodia, Phnom Penh, HVS Keebs is dedicated to engineering custom high-performance workstations and gaming laptops for software architects, digital artists, AI researchers, and eSports competitors.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6">
        <div className="bg-[#121212] border border-gray-800 rounded-3xl p-8 space-y-3">
          <Cpu className="w-8 h-8 text-blue-400" />
          <h3 className="text-lg font-extrabold text-white">Hand-Built & Calibrated</h3>
          <p className="text-xs text-gray-400 leading-relaxed">
            Unlike mass-market laptops, every system undergoes 24 hours of synthetic thermal stress tests, memory latency tuning, and liquid metal repasting before shipment.
          </p>
        </div>

        <div className="bg-[#121212] border border-gray-800 rounded-3xl p-8 space-y-3">
          <Shield className="w-8 h-8 text-blue-400" />
          <h3 className="text-lg font-extrabold text-white">Enterprise Swap Warranty</h3>
          <p className="text-xs text-gray-400 leading-relaxed">
            We provide a 3-year replacement hardware warranty with priority 24/7 technical support. If your workstation experiences a component failure, we dispatch a replacement immediately.
          </p>
        </div>
      </div>
    </div>
  );
};
