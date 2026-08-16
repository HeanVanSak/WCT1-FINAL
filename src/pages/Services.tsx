import React, { useEffect, useState } from 'react';
import { ServiceItem } from '../types';
import { getServices } from '../services/serviceService';
import { Loading } from '../components/Loading';
import { Wrench, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Services: React.FC = () => {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const list = await getServices();
        setServices(list);
      } catch (err) {
        console.error('Error loading services:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  if (loading) return <Loading fullScreen message="Loading engineering services..." />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-extrabold uppercase tracking-widest">
          <Wrench className="w-3.5 h-3.5" />
          <span>Specialized Hardware Engineering</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
          Professional Workstation <span className="font-serif italic text-gray-400">Services</span>
        </h1>
        <p className="text-gray-400 text-xs sm:text-sm">
          Tailored thermal repasting, custom BIOS flashing, eSports overclocking, and 24/7 enterprise maintenance.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {services.map((srv) => (
          <div
            key={srv.id}
            className="bg-[#121212] border border-gray-800 rounded-3xl p-6 space-y-4 hover:border-gray-700 transition-all duration-300 shadow-xl flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="aspect-16/10 rounded-2xl overflow-hidden bg-[#161616]">
                <img src={srv.image} alt={srv.title} className="w-full h-full object-cover" />
              </div>
              <h3 className="font-extrabold text-white text-lg">{srv.title}</h3>
              <p className="text-gray-400 text-xs leading-relaxed">{srv.description}</p>
            </div>

            <Link
              to="/contact"
              className="w-full py-3 bg-white text-black hover:bg-gray-200 rounded-full text-xs font-extrabold flex items-center justify-center space-x-2 transition-colors mt-4 uppercase tracking-wider"
            >
              <span>Request Consultation</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};
