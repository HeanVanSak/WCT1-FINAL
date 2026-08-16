import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Save, CheckCircle2 } from 'lucide-react';

export const Profile: React.FC = () => {
  const { user, updateProfile } = useAuth();

  const [form, setForm] = useState({
    name: user?.name || ''
  });

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  if (!user) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProfile(form);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err: any) {
      alert(err.message || 'Error updating profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-white">
          Account <span className="font-serif italic text-gray-400">Profile</span>
        </h1>
        <p className="text-xs text-gray-400 mt-1">Manage your personal information</p>
      </div>

      <div className="bg-[#121212] border border-gray-800 rounded-3xl p-6 sm:p-8 space-y-6">
        {/* Profile Card Header */}
        <div className="flex items-center space-x-4 border-b border-gray-800 pb-6">
          <div className="w-16 h-16 rounded-full bg-[#181818] text-white border border-gray-800 flex items-center justify-center font-bold text-2xl uppercase">
            {user.name ? user.name.charAt(0) : 'U'}
          </div>
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <h2 className="text-lg font-bold text-white">{user.name}</h2>
              <span className="px-3 py-0.5 text-[10px] uppercase font-extrabold rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                {user.role}
              </span>
            </div>
            <p className="text-xs text-gray-400">{user.email}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Full Name */}
          <div>
            <label className="block text-gray-400 mb-1 font-bold text-[10px] uppercase tracking-wider">
              Full Name
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full pl-9 pr-3 py-2.5 bg-[#161616] border border-gray-800/80 rounded-xl text-white focus:outline-none focus:border-white"
              />
              <User className="w-4 h-4 text-gray-500 absolute left-3 top-3" />
            </div>
          </div>

          {/* Email (Read-Only) */}
          <div>
            <label className="block text-gray-400 mb-1 font-bold text-[10px] uppercase tracking-wider">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                disabled
                value={user.email}
                className="w-full pl-9 pr-3 py-2.5 bg-[#161616]/60 border border-gray-800/50 rounded-xl text-gray-500 cursor-not-allowed"
              />
              <Mail className="w-4 h-4 text-gray-600 absolute left-3 top-3" />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={saving}
            className={`py-3 px-8 rounded-full font-extrabold text-xs flex items-center justify-center space-x-2 transition-all uppercase tracking-wider ${
              saved
                ? 'bg-emerald-600 text-white'
                : 'bg-white text-black hover:bg-gray-200'
            }`}
          >
            {saved ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Saved Changes!</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>{saving ? 'Saving...' : 'Update Profile'}</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
