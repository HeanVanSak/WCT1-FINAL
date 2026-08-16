import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, ArrowLeft, CheckCircle, Mail, Send } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Loading } from '../../components/Loading';

export const ForgotPassword: React.FC = () => {
  const { forgotPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setLoading(true);

    try {
      await forgotPassword(email.trim());
      setSuccess(true);
    } catch (err: any) {
      console.error('Password reset error:', err);

      if (err.code === 'auth/invalid-email') {
        setError('Please enter a valid email address.');
      } else if (err.code === 'auth/too-many-requests') {
        setError('Too many requests. Please wait a little and try again.');
      } else if (err.code === 'auth/network-request-failed') {
        setError('Network error. Please check your internet connection and try again.');
      } else if (err.code === 'auth/user-not-found') {
        setError('No account was found with this email address.');
      } else {
        setError(err.message || 'Unable to send the password reset email. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-gray-50/50">
      <div className="w-full max-w-md bg-white border border-gray-200 rounded-3xl p-8 space-y-6 shadow-xl">
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <img
              src="/image/Logo.png"
              alt="HVS Keebs Logo"
              className="w-12 h-12 rounded-full object-cover"
            />
          </div>
          <h1 className="text-2xl font-extrabold text-gray-900">
            Forgot <span className="italic text-blue-600">Password?</span>
          </h1>
          <p className="text-xs text-gray-500 leading-relaxed">
            Enter the email address connected to your HVS Keebs account and we will send you a password reset link.
          </p>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-600 text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 text-xs flex items-start gap-2">
            <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Reset email sent.</p>
              <p className="mt-1 text-emerald-600 leading-relaxed">
                Check your inbox and spam folder for a password reset link sent to {email.trim()}.
              </p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-gray-700 mb-1 font-bold text-[10px] uppercase tracking-wider">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (success) setSuccess(false);
                }}
                className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
              />
              <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !email.trim()}
            className="w-full py-3 bg-gray-900 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-extrabold rounded-full text-xs flex items-center justify-center gap-2 transition-all uppercase tracking-wider shadow-sm"
          >
            {loading ? (
              <Loading message="Sending reset link..." />
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>{success ? 'Send Again' : 'Send Reset Link'}</span>
              </>
            )}
          </button>
        </form>

        <div className="text-center">
          <Link
            to="/login"
            className="inline-flex items-center gap-1.5 text-xs text-blue-600 hover:underline font-bold"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};
