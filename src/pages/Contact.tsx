import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';

export const Contact: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center space-y-3 max-w-xl mx-auto">
        <h1 className="text-3xl font-extrabold text-white">
          Contact<span className="font-serif italic text-purple-400"> Us</span>
        </h1>
        <p className="text-gray-400 text-xs sm:text-sm">
          Have questions regarding keyboard Send us a message.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        <div className="md:col-span-5 bg-[#121212] border border-gray-800 rounded-3xl p-6 space-y-6">
          <h3 className="font-extrabold text-white text-xs uppercase tracking-wider border-b border-gray-800 pb-3">
            Contact Information
          </h3>

          <div className="space-y-4 text-xs">
            <div className="flex items-start space-x-3">
              <MapPin className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-white">Location</p>
                <p className="text-gray-400">Cambodia ,Phnom Penh, Sen Sok, Street 1011</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Phone className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-white">Phone number </p>
                <p className="text-gray-400">+(855)97-3682-442</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Mail className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-white">Email</p>
                <p className="text-gray-400">heanvansak27737@gmail.com</p>
              </div>
            </div>
          </div>
        </div>

        <div className="md:col-span-7 bg-[#121212] border border-gray-800 rounded-3xl p-6">
          {submitted ? (
            <div className="py-12 text-center space-y-4">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
              <h3 className="text-lg font-extrabold text-white">Inquiry Received</h3>
              <p className="text-xs text-gray-400 max-w-xs mx-auto">
                Our technical support engineers will respond within 2 business hours.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="px-6 py-2.5 bg-white text-black text-xs font-bold rounded-full uppercase tracking-wider"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-gray-400 mb-1 font-bold text-[10px] uppercase tracking-wider">Your Name</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-3 py-2.5 bg-[#161616] border border-gray-800/80 rounded-xl text-white focus:outline-none focus:border-white"
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-1 font-bold text-[10px] uppercase tracking-wider">Your Email</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full px-3 py-2.5 bg-[#161616] border border-gray-800/80 rounded-xl text-white focus:outline-none focus:border-white"
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-1 font-bold text-[10px] uppercase tracking-wider">Subject</label>
                <input
                  type="text"
                  required
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  className="w-full px-3 py-2.5 bg-[#161616] border border-gray-800/80 rounded-xl text-white focus:outline-none focus:border-white"
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-1 font-bold text-[10px] uppercase tracking-wider">Message</label>
                <textarea
                  rows={4}
                  required
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full px-3 py-2.5 bg-[#161616] border border-gray-800/80 rounded-xl text-white focus:outline-none focus:border-white"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-white text-black hover:bg-gray-200 font-extrabold rounded-full text-xs flex items-center justify-center space-x-2 transition-colors uppercase tracking-wider"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Inquiry</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
