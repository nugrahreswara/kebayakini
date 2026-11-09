'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lock, Mail, AlertCircle } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AdminLoginModal({ isOpen, onClose }: AdminLoginModalProps) {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate loading delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    const success = login(formData.email, formData.password);

    if (success) {
      setIsLoading(false);
      onClose();
      router.push('/admin');
    } else {
      setError('Email atau password salah. Silakan coba lagi.');
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({ email: '', password: '' });
    setError('');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden pointer-events-auto"
            >
              {/* Close Button */}
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 z-10 p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5 text-deep-navy" />
              </button>

              {/* Header */}
              <div className="bg-gradient-to-r from-rose-gold to-champagne-gold p-8 pb-12">
                <div className="flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full mx-auto mb-4">
                  <Lock className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-serif font-bold text-white text-center">
                  Admin Login
                </h2>
                <p className="text-white/90 text-center mt-2">
                  Masuk untuk mengakses dashboard admin
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-8 -mt-6 bg-white rounded-t-3xl">
                <div className="space-y-5">
                  {/* Error Message */}
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-start space-x-3 p-4 bg-red-50 border border-red-200 rounded-lg"
                    >
                      <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm text-red-800 font-medium">Login Gagal</p>
                        <p className="text-sm text-red-600 mt-1">{error}</p>
                      </div>
                    </motion.div>
                  )}

                  {/* Email Field */}
                  <div>
                    <label className="block text-sm font-medium text-deep-navy mb-2">
                      Email Admin
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="admin@kebayaku.com"
                        className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-rose-gold focus:outline-none transition-colors"
                        required
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  {/* Password Field */}
                  <div>
                    <label className="block text-sm font-medium text-deep-navy mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        placeholder="••••••••"
                        className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-rose-gold focus:outline-none transition-colors"
                        required
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  {/* Demo Credentials Info */}
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-900 font-medium mb-2">
                      Demo Credentials:
                    </p>
                    <div className="space-y-1 text-sm text-blue-800">
                      <p>Email: <code className="bg-blue-100 px-2 py-0.5 rounded">admin@kebayaku.com</code></p>
                      <p>Password: <code className="bg-blue-100 px-2 py-0.5 rounded">admin123</code></p>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <motion.button
                    type="submit"
                    disabled={isLoading}
                    whileHover={{ scale: isLoading ? 1 : 1.02 }}
                    whileTap={{ scale: isLoading ? 1 : 0.98 }}
                    className="w-full py-3 gradient-rose-gold text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center space-x-2">
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Memproses...</span>
                      </span>
                    ) : (
                      'Masuk ke Dashboard'
                    )}
                  </motion.button>
                </div>
              </form>

              {/* Footer */}
              <div className="px-8 pb-8 -mt-2">
                <p className="text-center text-sm text-gray-500">
                  Gunakan kredensial admin yang valid untuk mengakses panel manajemen.
                </p>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
