'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Home,
  LogOut,
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  Calendar,
  Image as ImageIcon,
  Tag,
  Ruler,
  DollarSign,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { useKebayaStore } from '@/store/useKebayaStore';
import { Kebaya, KebayaImage } from '@/types';
import { formatPrice } from '@/lib/utils';

export default function AdminDashboard() {
  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const adminEmail = useAuthStore((state) => state.adminEmail);
  const logout = useAuthStore((state) => state.logout);

  const kebayas = useKebayaStore((state) => state.kebayas);
  const addKebaya = useKebayaStore((state) => state.addKebaya);
  const updateKebaya = useKebayaStore((state) => state.updateKebaya);
  const deleteKebaya = useKebayaStore((state) => state.deleteKebaya);
  const addBookedDate = useKebayaStore((state) => state.addBookedDate);

  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showDateManager, setShowDateManager] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState('');

  const [formData, setFormData] = useState<Partial<Kebaya>>({
    name: '',
    description: '',
    price: 0,
    size: 'M',
    color: '',
    status: 'available',
    featured: false,
    tags: [],
    images: [],
  });

  const [newTag, setNewTag] = useState('');
  const [newImage, setNewImage] = useState({ url: '', type: 'full' as const, alt: '' });
  const [newBookedDate, setNewBookedDate] = useState({
    startDate: '',
    endDate: '',
    customerName: '',
  });

  // Auth check
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const resetForm = () => {
    setIsEditing(false);
    setEditingId(null);
    setFormData({
      name: '',
      description: '',
      price: 0,
      size: 'M',
      color: '',
      status: 'available',
      featured: false,
      tags: [],
      images: [],
    });
    setNewTag('');
    setNewImage({ url: '', type: 'full', alt: '' });
  };

  const handleEdit = (kebaya: Kebaya) => {
    setIsEditing(true);
    setEditingId(kebaya.id);
    setFormData({
      name: kebaya.name,
      description: kebaya.description,
      price: kebaya.price,
      size: kebaya.size,
      color: kebaya.color,
      status: kebaya.status,
      featured: kebaya.featured,
      tags: [...kebaya.tags],
      images: [...kebaya.images],
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus kebaya ini?')) {
      deleteKebaya(id);
      setShowSuccess('Kebaya berhasil dihapus!');
      setTimeout(() => setShowSuccess(''), 3000);
    }
  };

  const handleAddTag = () => {
    if (newTag.trim() && formData.tags && !formData.tags.includes(newTag.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, newTag.trim()],
      });
      setNewTag('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setFormData({
      ...formData,
      tags: formData.tags?.filter((t) => t !== tag) || [],
    });
  };

  const handleAddImage = () => {
    if (newImage.url.trim() && newImage.alt.trim()) {
      const imageWithId: KebayaImage = {
        id: `img-${Date.now()}`,
        ...newImage,
      };
      setFormData({
        ...formData,
        images: [...(formData.images || []), imageWithId],
      });
      setNewImage({ url: '', type: 'full', alt: '' });
    }
  };

  const handleRemoveImage = (imageId: string) => {
    setFormData({
      ...formData,
      images: formData.images?.filter((img) => img.id !== imageId) || [],
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.description || !formData.price || !formData.color) {
      alert('Mohon lengkapi semua field yang wajib diisi');
      return;
    }

    if (isEditing && editingId) {
      updateKebaya(editingId, formData);
      setShowSuccess('Kebaya berhasil diupdate!');
    } else {
      const newKebaya: Kebaya = {
        id: `kebaya-${Date.now()}`,
        name: formData.name!,
        description: formData.description!,
        price: formData.price!,
        size: formData.size!,
        color: formData.color!,
        status: formData.status!,
        featured: formData.featured!,
        tags: formData.tags || [],
        images: formData.images || [],
        bookedDates: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      addKebaya(newKebaya);
      setShowSuccess('Kebaya baru berhasil ditambahkan!');
    }

    setTimeout(() => setShowSuccess(''), 3000);
    resetForm();
  };

  const handleAddBookedDate = (kebayaId: string) => {
    if (!newBookedDate.startDate || !newBookedDate.endDate) {
      alert('Mohon isi tanggal mulai dan selesai');
      return;
    }

    addBookedDate(kebayaId, {
      startDate: newBookedDate.startDate,
      endDate: newBookedDate.endDate,
      customerName: newBookedDate.customerName,
    });

    setNewBookedDate({ startDate: '', endDate: '', customerName: '' });
    setShowDateManager(null);
    setShowSuccess('Tanggal booking berhasil ditambahkan!');
    setTimeout(() => setShowSuccess(''), 3000);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-warm-white">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-rose-gold border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-deep-navy/70">Redirecting...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFFDF9] py-8 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-6 mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="font-serif text-3xl font-bold text-deep-navy mb-2">
                Kebayaku <span className="text-gradient">Admin Central</span>
              </h1>
              <p className="text-deep-navy/70">
                Logged in as: <span className="font-semibold text-rose-gold">{adminEmail}</span>
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => router.push('/')}
                className="flex items-center space-x-2 px-6 py-3 bg-gray-100 text-deep-navy rounded-xl font-medium hover:bg-gray-200 transition-colors"
              >
                <Home className="w-5 h-5" />
                <span>Kembali ke Beranda</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleLogout}
                className="flex items-center space-x-2 px-6 py-3 bg-red-500 text-white rounded-xl font-medium hover:bg-red-600 transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Success Message */}
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="bg-emerald-green text-white px-6 py-4 rounded-xl shadow-lg mb-6 flex items-center space-x-3"
          >
            <CheckCircle className="w-6 h-6 flex-shrink-0" />
            <span className="font-medium">{showSuccess}</span>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column: Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-2xl shadow-lg p-6 lg:p-8 h-fit lg:sticky lg:top-24"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-deep-navy flex items-center space-x-2">
                <Plus className="w-6 h-6 text-rose-gold" />
                <span>{isEditing ? 'Edit Kebaya' : 'Tambah Kebaya Baru'}</span>
              </h2>
              {isEditing && (
                <button
                  onClick={resetForm}
                  className="text-sm text-rose-gold hover:text-rose-gold/80 font-medium flex items-center space-x-1"
                >
                  <X className="w-4 h-4" />
                  <span>Batal</span>
                </button>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-deep-navy mb-2">
                  Nama Kebaya *
                </label>
                <input
                  type="text"
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-rose-gold focus:outline-none transition-colors"
                  placeholder="Contoh: Kebaya Brokat Champagne"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-deep-navy mb-2">
                  Deskripsi *
                </label>
                <textarea
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-rose-gold focus:outline-none transition-colors resize-none"
                  placeholder="Deskripsi detail kebaya..."
                  required
                />
              </div>

              {/* Price, Size, Color */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-deep-navy mb-2">
                    <DollarSign className="w-4 h-4 inline mr-1" />
                    Harga *
                  </label>
                  <input
                    type="number"
                    value={formData.price || 0}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full px-3 py-3 border-2 border-gray-200 rounded-lg focus:border-rose-gold focus:outline-none transition-colors"
                    min="0"
                    step="1000"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-deep-navy mb-2">
                    <Ruler className="w-4 h-4 inline mr-1" />
                    Ukuran *
                  </label>
                  <select
                    value={formData.size || 'M'}
                    onChange={(e) => setFormData({ ...formData, size: e.target.value as any })}
                    className="w-full px-3 py-3 border-2 border-gray-200 rounded-lg focus:border-rose-gold focus:outline-none transition-colors"
                  >
                    <option value="S">S</option>
                    <option value="M">M</option>
                    <option value="L">L</option>
                    <option value="XL">XL</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-deep-navy mb-2">
                    Warna *
                  </label>
                  <input
                    type="text"
                    value={formData.color || ''}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    className="w-full px-3 py-3 border-2 border-gray-200 rounded-lg focus:border-rose-gold focus:outline-none transition-colors"
                    placeholder="Rose Gold"
                    required
                  />
                </div>
              </div>

              {/* Status & Featured */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-deep-navy mb-2">
                    Status
                  </label>
                  <select
                    value={formData.status || 'available'}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-rose-gold focus:outline-none transition-colors"
                  >
                    <option value="available">Available</option>
                    <option value="booked">Booked</option>
                  </select>
                </div>

                <div className="flex items-end">
                  <label className="flex items-center space-x-2 cursor-pointer px-4 py-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors w-full">
                    <input
                      type="checkbox"
                      checked={formData.featured || false}
                      onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                      className="w-5 h-5 text-rose-gold border-gray-300 rounded focus:ring-rose-gold"
                    />
                    <span className="text-sm font-medium text-deep-navy">Featured/Premium</span>
                  </label>
                </div>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-deep-navy mb-2">
                  <Tag className="w-4 h-4 inline mr-1" />
                  Tags/Kategori
                </label>
                <div className="flex space-x-2 mb-3">
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                    placeholder="Tambah tag..."
                    className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-rose-gold focus:outline-none transition-colors"
                  />
                  <button
                    type="button"
                    onClick={handleAddTag}
                    className="px-4 py-2 bg-rose-gold text-white rounded-lg hover:bg-rose-gold/90 transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.tags?.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center space-x-1 px-3 py-1.5 bg-rose-gold/10 text-rose-gold rounded-lg text-sm font-medium"
                    >
                      <span>{tag}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="hover:text-rose-gold/70"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Images */}
              <div>
                <label className="block text-sm font-medium text-deep-navy mb-2">
                  <ImageIcon className="w-4 h-4 inline mr-1" />
                  Gambar
                </label>
                <div className="space-y-2 mb-3">
                  <input
                    type="url"
                    value={newImage.url}
                    onChange={(e) => setNewImage({ ...newImage, url: e.target.value })}
                    placeholder="URL Gambar"
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-rose-gold focus:outline-none transition-colors"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <select
                      value={newImage.type}
                      onChange={(e) => setNewImage({ ...newImage, type: e.target.value as any })}
                      className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-rose-gold focus:outline-none transition-colors"
                    >
                      <option value="full">Full</option>
                      <option value="close-up">Close-up</option>
                      <option value="sleeve">Sleeve</option>
                      <option value="bottom">Bottom</option>
                      <option value="back">Back</option>
                    </select>
                    <input
                      type="text"
                      value={newImage.alt}
                      onChange={(e) => setNewImage({ ...newImage, alt: e.target.value })}
                      placeholder="Alt text"
                      className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-rose-gold focus:outline-none transition-colors"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleAddImage}
                    className="w-full px-4 py-2 bg-rose-gold text-white rounded-lg hover:bg-rose-gold/90 transition-colors flex items-center justify-center space-x-2"
                  >
                    <ImageIcon className="w-5 h-5" />
                    <span>Tambah Gambar</span>
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {formData.images?.map((img) => (
                    <div
                      key={img.id}
                      className="relative group bg-gray-50 rounded-lg p-3 border-2 border-gray-200 hover:border-rose-gold transition-colors"
                    >
                      <div className="text-xs font-medium text-rose-gold mb-1">{img.type}</div>
                      <div className="text-xs text-deep-navy/70 line-clamp-2">{img.alt}</div>
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(img.id)}
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full flex items-center justify-center space-x-2 px-6 py-4 gradient-rose-gold text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all"
              >
                <Save className="w-5 h-5" />
                <span>{isEditing ? 'Update Kebaya' : 'Tambah Kebaya'}</span>
              </button>
            </form>
          </motion.div>

          {/* Right Column: List */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-deep-navy mb-6">
                Daftar Kebaya ({kebayas.length})
              </h2>

              {kebayas.length === 0 ? (
                <div className="text-center py-12">
                  <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">Belum ada kebaya. Tambahkan kebaya pertama Anda!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {kebayas.map((kebaya) => (
                    <div key={kebaya.id} className="bg-gray-50 rounded-xl p-5 border-2 border-gray-100 hover:border-rose-gold/30 transition-colors">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="font-serif text-xl font-bold text-deep-navy mb-2">
                            {kebaya.name}
                          </h3>
                          <p className="text-sm text-deep-navy/70 mb-3 line-clamp-2">
                            {kebaya.description}
                          </p>
                          <div className="flex flex-wrap gap-2 mb-3">
                            <span className="px-3 py-1 bg-rose-gold/10 text-rose-gold text-xs font-semibold rounded-full">
                              {kebaya.size}
                            </span>
                            <span className="px-3 py-1 bg-champagne-gold/10 text-champagne-gold text-xs font-semibold rounded-full">
                              {kebaya.color}
                            </span>
                            <span
                              className={`px-3 py-1 text-xs font-semibold rounded-full ${
                                kebaya.status === 'available'
                                  ? 'bg-emerald-green/10 text-emerald-green'
                                  : 'bg-amber-orange/10 text-amber-orange'
                              }`}
                            >
                              {kebaya.status === 'available' ? 'Tersedia' : 'Dipinjam'}
                            </span>
                            <span className="px-3 py-1 bg-deep-navy/10 text-deep-navy text-xs font-bold rounded-full">
                              {formatPrice(kebaya.price)}
                            </span>
                            {kebaya.featured && (
                              <span className="px-3 py-1 bg-gradient-to-r from-rose-gold to-champagne-gold text-white text-xs font-bold rounded-full">
                                PREMIUM
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => handleEdit(kebaya)}
                          className="flex items-center space-x-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
                        >
                          <Edit className="w-4 h-4" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => setShowDateManager(showDateManager === kebaya.id ? null : kebaya.id)}
                          className="flex items-center space-x-1 px-4 py-2 bg-emerald-green text-white rounded-lg hover:bg-emerald-green/90 transition-colors text-sm font-medium"
                        >
                          <Calendar className="w-4 h-4" />
                          <span>Kelola Tanggal</span>
                        </button>
                        <button
                          onClick={() => handleDelete(kebaya.id)}
                          className="flex items-center space-x-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm font-medium"
                        >
                          <Trash2 className="w-4 h-4" />
                          <span>Hapus</span>
                        </button>
                      </div>

                      {/* Date Manager */}
                      {showDateManager === kebaya.id && (
                        <div className="mt-4 p-4 bg-white rounded-lg border-2 border-emerald-green/20">
                          <h4 className="text-sm font-semibold text-deep-navy mb-3">
                            Kelola Tanggal Booking
                          </h4>
                          
                          <div className="space-y-2 mb-3">
                            <input
                              type="date"
                              value={newBookedDate.startDate}
                              onChange={(e) =>
                                setNewBookedDate({ ...newBookedDate, startDate: e.target.value })
                              }
                              className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg text-sm focus:border-rose-gold focus:outline-none"
                              min={new Date().toISOString().split('T')[0]}
                            />
                            <input
                              type="date"
                              value={newBookedDate.endDate}
                              onChange={(e) =>
                                setNewBookedDate({ ...newBookedDate, endDate: e.target.value })
                              }
                              className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg text-sm focus:border-rose-gold focus:outline-none"
                              min={newBookedDate.startDate || new Date().toISOString().split('T')[0]}
                            />
                            <input
                              type="text"
                              value={newBookedDate.customerName}
                              onChange={(e) =>
                                setNewBookedDate({ ...newBookedDate, customerName: e.target.value })
                              }
                              placeholder="Nama Customer (opsional)"
                              className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg text-sm focus:border-rose-gold focus:outline-none"
                            />
                            <button
                              onClick={() => handleAddBookedDate(kebaya.id)}
                              className="w-full px-4 py-2 bg-emerald-green text-white rounded-lg hover:bg-emerald-green/90 text-sm font-medium"
                            >
                              Tambah Tanggal Booking
                            </button>
                          </div>

                          <div className="space-y-2">
                            <div className="text-xs font-medium text-deep-navy/70 mb-1">
                              Tanggal Terbooking:
                            </div>
                            {kebaya.bookedDates.length === 0 ? (
                              <div className="text-xs text-deep-navy/50 italic">Belum ada booking</div>
                            ) : (
                              kebaya.bookedDates.map((date, idx) => (
                                <div
                                  key={idx}
                                  className="text-xs px-3 py-2 bg-amber-orange/10 rounded border border-amber-orange/20 text-deep-navy"
                                >
                                  {new Date(date.startDate).toLocaleDateString('id-ID')} -{' '}
                                  {new Date(date.endDate).toLocaleDateString('id-ID')}
                                  {date.customerName && (
                                    <span className="ml-2 text-rose-gold font-medium">({date.customerName})</span>
                                  )}
                                </div>
                              ))
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
