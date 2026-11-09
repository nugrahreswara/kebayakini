'use client';

import { motion } from 'framer-motion';
import { Eye, Calendar } from 'lucide-react';
import { useKebayaStore } from '@/store/useKebayaStore';
import { Kebaya } from '@/types';
import { formatPrice } from '@/lib/utils';
import SafeImage from '@/components/SafeImage';

interface KebayaCardProps {
  kebaya: Kebaya;
}

export default function KebayaCard({ kebaya }: KebayaCardProps) {
  const setSelectedKebaya = useKebayaStore((state) => state.setSelectedKebaya);
  const toggleDetailModal = useKebayaStore((state) => state.toggleDetailModal);

  const handleCardClick = () => {
    setSelectedKebaya(kebaya);
    toggleDetailModal();
  };

  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
      onClick={handleCardClick}
      className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer"
    >
      {/* Image Container */}
      <div className="relative w-full aspect-[3/4] overflow-hidden bg-gray-100">
        <SafeImage
          src={kebaya.images?.[0]?.url || (kebaya as any).mainImage}
          alt={kebaya.name}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-500"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          loading="lazy"
        />

        {/* Status Badge */}
        <div className="absolute top-4 right-4 z-10">
          <span
            className={`px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg backdrop-blur-sm ${
              kebaya.status === 'available'
                ? 'bg-emerald-green/90 text-white'
                : 'bg-amber-orange/90 text-white'
            }`}
          >
            {kebaya.status === 'available' ? 'Tersedia' : 'Dipinjam'}
          </span>
        </div>

        {/* Overlay on Hover */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <motion.div
            initial={{ scale: 0 }}
            whileHover={{ scale: 1 }}
            transition={{ duration: 0.3 }}
            className="flex items-center space-x-2 px-6 py-3 bg-white rounded-full"
          >
            <Eye className="w-5 h-5 text-rose-gold" />
            <span className="text-sm font-semibold text-deep-navy">Lihat Detail</span>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 space-y-3">
        {/* Title */}
        <h3 className="font-serif text-xl font-bold text-deep-navy line-clamp-1 group-hover:text-rose-gold transition-colors">
          {kebaya.name}
        </h3>

        {/* Description */}
        <p className="text-sm text-deep-navy/70 line-clamp-2">
          {kebaya.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {(kebaya.tags || []).slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 bg-rose-gold/10 text-rose-gold text-xs rounded-md font-medium"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Details */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center space-x-4 text-sm text-deep-navy/70">
            <div className="flex items-center space-x-1">
              <span className="font-medium">Size:</span>
              <span>{kebaya.size}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Calendar className="w-4 h-4" />
              <span>{kebaya.bookedDates?.length || 0}</span>
            </div>
          </div>
        </div>

        {/* Price */}
        <div className="pt-2">
          <div className="text-xs text-deep-navy/50 mb-1">Mulai dari</div>
          <div className="text-2xl font-bold text-gradient">{formatPrice(kebaya.price)}</div>
        </div>
      </div>

      {/* Featured Badge */}
      {kebaya.featured && (
        <div className="absolute top-4 left-4 z-10">
          <span className="px-3 py-1.5 bg-champagne-gold text-white text-xs font-semibold rounded-full shadow-lg">
            Premium
          </span>
        </div>
      )}
    </motion.div>
  );
}
