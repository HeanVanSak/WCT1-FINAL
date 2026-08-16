import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  ArrowLeft, 
  Mail, 
  Shield, 
  Calendar,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { getAllCustomers, setAdminRole } from '../../services/authService';
import { UserProfile } from '../../types';
import { Loading } from '../../components/Loading';

export const ManageUsers: React.FC = () => {
  const { isAdmin } = useAuth();
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const data = await getAllCustomers();
      setUsers(data);
    } catch (err) {
      console.error('Failed to load users:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isAdmin) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="bg-rose-500/10 border border-rose-500/30 rounded-2xl p-8 text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-rose-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Access Denied</h2>
          <p className="text-gray-400 text-sm">You don't have permission to manage users.</p>
          <Link to="/admin/dashboard" className="mt-6 inline-block px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full text-sm font-bold transition-colors">
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return <Loading fullScreen message="Loading users..." />;
  }

  const handlePromoteToAdmin = async (uid: string) => {
    if (!confirm('Promote this user to admin?')) return;
    try {
      await setAdminRole(uid);
      await fetchUsers();
      setSuccess('User promoted to admin successfully!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to promote user.');
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link to="/admin/dashboard" className="p-2 hover:bg-gray-800 rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-400" />
          </Link>
          <div>
            <h1 className="text-3xl font-extrabold text-white">
              Users <span className="font-serif italic text-blue-400">Management</span>
            </h1>
            <p className="text-sm text-gray-400 mt-1">Manage all registered users</p>
          </div>
        </div>

        {/* Messages */}
        {success && (
          <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-emerald-400 text-sm flex items-center gap-3">
            <CheckCircle className="w-5 h-5" />
            <span>{success}</span>
          </div>
        )}
        {error && (
          <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/30 rounded-2xl text-rose-400 text-sm flex items-center gap-3">
            <AlertCircle className="w-5 h-5" />
            <span>{error}</span>
          </div>
        )}

        {/* Users Table */}
        <div className="bg-[#121212] border border-gray-800 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#1a1a1a] border-b border-gray-800">
                <tr>
                  <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-gray-500">User</th>
                  <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-gray-500">Email</th>
                  <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-gray-500">Role</th>
                  <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-gray-500">Joined</th>
                  <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.uid} className="border-b border-gray-800/50 hover:bg-[#1a1a1a] transition-colors">
                    <td className="px-4 py-3">
                      <span className="text-xs font-medium text-white">{user.name}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Mail className="w-3 h-3 text-gray-500" />
                        <span className="text-xs text-gray-300">{user.email}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-[8px] font-bold uppercase tracking-wider border ${
                        user.role === 'admin'
                          ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                          : 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3 h-3 text-gray-500" />
                        <span className="text-xs text-gray-400">
                          {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        {user.role !== 'admin' && (
                          <button
                            onClick={() => handlePromoteToAdmin(user.uid)}
                            className="p-1.5 hover:bg-amber-500/10 rounded-lg transition-colors"
                            title="Promote to Admin"
                          >
                            <Shield className="w-4 h-4 text-gray-400" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-gray-500 text-sm">
                      No users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-6 grid grid-cols-3 gap-4">
          <div className="bg-[#121212] border border-gray-800 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-white">{users.length}</p>
            <p className="text-[10px] uppercase tracking-wider text-gray-500">Total Users</p>
          </div>
          <div className="bg-[#121212] border border-gray-800 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-amber-400">{users.filter(u => u.role === 'admin').length}</p>
            <p className="text-[10px] uppercase tracking-wider text-gray-500">Admins</p>
          </div>
          <div className="bg-[#121212] border border-gray-800 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-blue-400">{users.filter(u => u.role === 'customer').length}</p>
            <p className="text-[10px] uppercase tracking-wider text-gray-500">Customers</p>
          </div>
        </div>
      </div>
    </div>
  );
};
