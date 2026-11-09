'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Filter, X } from 'lucide-react';
import { useKebayaStore } from '@/store/useKebayaStore';
import CatalogGrid from './CatalogGrid';
import FilterBar from './FilterBar';
import KebayaDetailModal from './KebayaDetailModal';

export default function CatalogSection() {
  const filteredKebayas = useKebayaStore((state) => state.filteredKebayas);
  const kebayas = useKebayaStore((state) => state.kebayas);
  const applyFilters = useKebayaStore((state) => state.applyFilters);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const displayKebayas = filteredKebayas.length > 0 ? filteredKebayas : kebayas;

  return (
    <section id="katalog" className="relative py-20 sm:py-28 bg-warm-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-deep-navy mb-4">
            Koleksi <span className="text-gradient">Kebaya Premium</span>
          </h2>
          <p className="text-lg text-deep-navy/70 max-w-2xl mx-auto">
            Pilih dari koleksi eksklusif kami yang dirancang dengan detail sempurna untuk momen spesial Anda
          </p>
        </motion.div>

        {/* Filter Toggle Button (Mobile) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="lg:hidden mb-6"
        >
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-white border-2 border-rose-gold rounded-xl shadow-md hover:shadow-lg transition-all duration-200"
          >
            {isFilterOpen ? (
              <>
                <X className="w-5 h-5 text-rose-gold" />
                <span className="font-semibold text-rose-gold">Tutup Filter</span>
              </>
            ) : (
              <>
                <Filter className="w-5 h-5 text-rose-gold" />
                <span className="font-semibold text-rose-gold">Tampilkan Filter</span>
              </>
            )}
          </button>
        </motion.div>

        {/* Filter Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className={`mb-8 ${isFilterOpen ? 'block' : 'hidden lg:block'}`}
        >
          <FilterBar />
        </motion.div>

        {/* Results Count */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-6 text-center lg:text-left"
        >
          <p className="text-deep-navy/70">
            Menampilkan <span className="font-semibold text-rose-gold">{displayKebayas.length}</span> kebaya
          </p>
        </motion.div>

        {/* Kebaya Grid */}
        {displayKebayas.length > 0 ? (
          <CatalogGrid kebayas={displayKebayas} />
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center py-20"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-rose-gold/10 mb-6">
              <Filter className="w-10 h-10 text-rose-gold" />
            </div>
            <h3 className="text-2xl font-semibold text-deep-navy mb-2">
              Tidak ada kebaya yang sesuai
            </h3>
            <p className="text-deep-navy/70">
              Coba sesuaikan filter Anda untuk melihat lebih banyak pilihan
            </p>
          </motion.div>
        )}
      </div>

      {/* Detail Modal */}
      <KebayaDetailModal />
    </section>
  );
}
