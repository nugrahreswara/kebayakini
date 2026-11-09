'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle } from 'lucide-react';

interface RulesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function RulesModal({ isOpen, onClose }: RulesModalProps) {
  const [activeTab, setActiveTab] = useState<'rental' | 'fitting'>('rental');

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            data-lenis-prevent
          />

          {/* Modal */}
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
            data-lenis-prevent
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative w-full max-w-2xl max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden pointer-events-auto"
              data-lenis-prevent
            >
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 z-20 p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                aria-label="Close modal"
              >
                <X className="w-6 h-6 text-deep-navy" />
              </button>

              {/* Header */}
              <div className="bg-gradient-to-r from-rose-gold to-champagne-gold p-6">
                <h2 className="text-2xl font-serif font-bold text-white">
                  Ketentuan & Aturan
                </h2>
                <p className="text-white/90 text-sm mt-1">
                  Syarat dan ketentuan penyewaan Kebaya Kini
                </p>
              </div>

              {/* Tabs */}
              <div className="flex border-b border-gray-200">
                <button
                  onClick={() => setActiveTab('rental')}
                  className={`flex-1 px-6 py-3 text-center font-medium transition-colors ${
                    activeTab === 'rental'
                      ? 'text-rose-gold border-b-2 border-rose-gold'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Rules Sewa
                </button>
                <button
                  onClick={() => setActiveTab('fitting')}
                  className={`flex-1 px-6 py-3 text-center font-medium transition-colors ${
                    activeTab === 'fitting'
                      ? 'text-rose-gold border-b-2 border-rose-gold'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Ketentuan Fitting
                </button>
              </div>

              {/* Content */}
              <div
                className="overflow-y-auto max-h-[calc(90vh-180px)] p-6 lg:p-8 space-y-6 scrollbar-thin scrollbar-thumb-amber-300 scrollbar-track-transparent"
                data-lenis-prevent
              >
                {activeTab === 'rental' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-bold text-deep-navy mb-4 flex items-center space-x-2">
                        <CheckCircle className="w-5 h-5 text-emerald-green" />
                        <span>RULES SEWA</span>
                      </h3>

                      <div className="space-y-4">
                        {/* DP Rule */}
                        <div className="bg-amber-50 border-l-4 border-amber-orange p-4 rounded">
                          <h4 className="font-semibold text-deep-navy mb-2">Deposit Awal (DP)</h4>
                          <ul className="space-y-1 text-sm text-deep-navy/80">
                            <li>• Minimum DP: <strong>50%</strong> dari total harga sewa</li>
                            <li>• DP non-refundable (tidak dapat ditukar/dikembalikan uang)</li>
                            <li>• DP berlaku jika Anda membatalkan pesanan</li>
                          </ul>
                        </div>

                        {/* Pelunasan Rule */}
                        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                          <h4 className="font-semibold text-deep-navy mb-2">
                            Pelunasan & Deposit Kembalian
                          </h4>
                          <ul className="space-y-1 text-sm text-deep-navy/80">
                            <li>
                              • Pelunasan 100% + Deposit Kembalian <strong>Rp 100.000</strong>
                            </li>
                            <li>• Dibayarkan saat pengambilan (H-1 sebelum acara)</li>
                            <li>• Durasi minimal sewa: <strong>3 hari</strong></li>
                            <li>• Deposit kembalian dikembalikan saat pengembalian kebaya</li>
                          </ul>
                        </div>

                        {/* Pengembalian Rule */}
                        <div className="bg-emerald-50 border-l-4 border-emerald-green p-4 rounded">
                          <h4 className="font-semibold text-deep-navy mb-2">Pengembalian Kebaya</h4>
                          <ul className="space-y-1 text-sm text-deep-navy/80">
                            <li>
                              • <strong>H+1 maksimal pukul 17:00 WITA</strong> (Waktu Indonesia Tengah)
                            </li>
                            <li>• Denda keterlambatan: <strong>Rp 5.000/jam</strong></li>
                            <li>• Atau denda harian: <strong>Rp 50.000/hari</strong></li>
                            <li>• Pengembalian harus dalam kondisi bersih dan rapi</li>
                          </ul>
                        </div>

                        {/* Identitas Rule */}
                        <div className="bg-orange-50 border-l-4 border-amber-orange p-4 rounded">
                          <h4 className="font-semibold text-deep-navy mb-2">Jaminan Identitas</h4>
                          <ul className="space-y-1 text-sm text-deep-navy/80">
                            <li>• Wajib meninggalkan fotokopi KTP atau SIM</li>
                            <li>• Sebagai jaminan kebaya saat pengambilan</li>
                          </ul>
                        </div>

                        {/* Prohibited Rule */}
                        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                          <h4 className="font-semibold text-deep-navy mb-2">Dilarang (Prohibited)</h4>
                          <ul className="space-y-1 text-sm text-deep-navy/80">
                            <li>❌ Mencuci / laundry kebaya</li>
                            <li>❌ Mengubah ukuran / resize</li>
                            <li>❌ Menulisi / menulis di kebaya</li>
                            <li>❌ Menyemprot perfume langsung ke kain</li>
                            <li>❌ Menggunakan jarum / peniti langsung pada kain</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'fitting' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-bold text-deep-navy mb-4 flex items-center space-x-2">
                        <CheckCircle className="w-5 h-5 text-emerald-green" />
                        <span>KETENTUAN FITTING</span>
                      </h3>

                      <div className="space-y-4">
                        {/* Reservation Rule */}
                        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                          <h4 className="font-semibold text-deep-navy mb-2">Reservasi Wajib</h4>
                          <ul className="space-y-1 text-sm text-deep-navy/80">
                            <li>• Fitting hanya dilakukan dengan reservasi terlebih dahulu</li>
                            <li>• Hubungi kami via WhatsApp untuk membuat jadwal fitting</li>
                            <li>• Waktu fitting: Jam 10:00 - 17:00 WITA</li>
                          </ul>
                        </div>

                        {/* Personal Manset Rule */}
                        <div className="bg-amber-50 border-l-4 border-amber-orange p-4 rounded">
                          <h4 className="font-semibold text-deep-navy mb-2">Bawa Manset Pribadi</h4>
                          <ul className="space-y-1 text-sm text-deep-navy/80">
                            <li>• <strong>Wajib membawa manset (inner) pribadi</strong></li>
                            <li>• Untuk menjaga kebersihan dan kenyamanan fitting</li>
                            <li>• Manset disediakan jika tidak membawa</li>
                          </ul>
                        </div>

                        {/* Booked Client Fitting */}
                        <div className="bg-emerald-50 border-l-4 border-emerald-green p-4 rounded">
                          <h4 className="font-semibold text-deep-navy mb-2">
                            Fitting untuk Klien Booking
                          </h4>
                          <ul className="space-y-1 text-sm text-deep-navy/80">
                            <li>• Maksimal fitting: <strong>3 kebaya</strong> (gratis)</li>
                            <li>• Kebaya tambahan: <strong>+Rp 30.000/kebaya</strong></li>
                            <li>• Durasi fitting: ~30 menit per kebaya</li>
                          </ul>
                        </div>

                        {/* Non-Booked Client Fitting */}
                        <div className="bg-indigo-50 border-l-4 border-indigo-500 p-4 rounded">
                          <h4 className="font-semibold text-deep-navy mb-2">
                            Fitting untuk Non-Booking
                          </h4>
                          <ul className="space-y-1 text-sm text-deep-navy/80">
                            <li>
                              • Fitting 1 kebaya: <strong>Rp 30.000</strong> (konsultasi gratis)
                            </li>
                            <li>• Kebaya tambahan: <strong>+Rp 30.000/kebaya</strong></li>
                            <li>• Hasil fitting dapat digunakan untuk booking</li>
                          </ul>
                        </div>

                        {/* Makeup & Accessories Rule */}
                        <div className="bg-rose-50 border-l-4 border-rose-gold p-4 rounded">
                          <h4 className="font-semibold text-deep-navy mb-2">
                            Makeup & Aksesoris
                          </h4>
                          <ul className="space-y-1 text-sm text-deep-navy/80">
                            <li>❌ Hindari makeup tebal / riasan berat saat fitting</li>
                            <li>❌ Jangan gunakan lipstik gelap saat coba kebaya</li>
                            <li>❌ Hindari aksesoris tajam / kasar yang bisa merusak kain</li>
                            <li>✓ Gunakan makeup ringan untuk hasil fitting optimal</li>
                          </ul>
                        </div>

                        {/* Tips Fitting */}
                        <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded">
                          <h4 className="font-semibold text-deep-navy mb-2">Tips Fitting Terbaik</h4>
                          <ul className="space-y-1 text-sm text-deep-navy/80">
                            <li>✓ Datang tepat waktu sesuai jadwal</li>
                            <li>✓ Bawa foto referensi styling yang diinginkan</li>
                            <li>✓ Tanyakan tips styling & aksesori pendamping</li>
                            <li>✓ Dokumentasi foto fitting untuk kenang-kenangan</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="border-t border-gray-200 p-4 bg-gray-50 flex justify-end space-x-3">
                <button
                  onClick={onClose}
                  className="px-6 py-2 bg-white border border-gray-300 text-deep-navy rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Tutup
                </button>
                <button
                  onClick={() => window.open('https://wa.me/6281234567890', '_blank')}
                  className="px-6 py-2 bg-gradient-to-r from-rose-gold to-champagne-gold text-white rounded-lg hover:shadow-lg transition-all font-medium"
                >
                  Hubungi Kami
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
