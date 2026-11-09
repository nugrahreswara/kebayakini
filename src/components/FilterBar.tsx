'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Calendar, SlidersHorizontal, X } from 'lucide-react';
import { useKebayaStore } from '@/store/useKebayaStore';

export default function FilterBar() {
  const kebayas = useKebayaStore((state) => state.kebayas);
  const filters = useKebayaStore((state) => state.filters);
  const setFilters = useKebayaStore((state) => state.setFilters);
  const applyFilters = useKebayaStore((state) => state.applyFilters);

  const [localStartDate, setLocalStartDate] = useState('');
  const [localEndDate, setLocalEndDate] = useState('');

  // Extract unique sizes (maxLD values) dynamically from kebaya data
  const availableSizes = useMemo(() => {
    const uniqueSizes = new Set<string>();
    kebayas.forEach((kebaya) => {
      const sizeValue = (kebaya as any).maxLD || '';
      if (sizeValue && sizeValue.trim()) {
        uniqueSizes.add(sizeValue.trim());
      }
    });
    return ['Semua', ...Array.from(uniqueSizes).sort()];
  }, [kebayas]);

  // Extract unique colors dynamically from kebaya data
  const availableColors = useMemo(() => {
    const uniqueColors = new Set<string>();
    kebayas.forEach((kebaya) => {
      const colorValue = (kebaya as any).color || kebaya.color || '';
      if (colorValue && colorValue.trim()) {
        uniqueColors.add(colorValue.trim());
      }
    });
    return ['Semua', ...Array.from(uniqueColors).sort()];
  }, [kebayas]);

  const handleSizeToggle = (size: string) => {
    if (size === 'Semua') {
      setFilters({ size: [] });
    } else {
      const newSizes = filters.size.includes(size)
        ? filters.size.filter((s) => s !== size)
        : [...filters.size, size];
      setFilters({ size: newSizes });
    }
    applyFilters();
  };

  const handleColorToggle = (color: string) => {
    if (color === 'Semua') {
      setFilters({ color: [] });
    } else {
      const newColors = filters.color.includes(color)
        ? filters.color.filter((c) => c !== color)
        : [...filters.color, color];
      setFilters({ color: newColors });
    }
    applyFilters();
  };

  const handleDateChange = () => {
    if (localStartDate && localEndDate) {
      setFilters({
        dateRange: {
          start: new Date(localStartDate),
          end: new Date(localEndDate),
        },
      });
      applyFilters();
    }
  };

  const handleClearFilters = () => {
    setFilters({
      size: [],
      color: [],
      dateRange: { start: null, end: null },
      priceRange: { min: 0, max: 1000000 },
    });
    setLocalStartDate('');
    setLocalEndDate('');
    applyFilters();
  };

  const hasActiveFilters =
    filters.size.length > 0 ||
    filters.color.length > 0 ||
    filters.dateRange.start !== null;

  const isSizeActive = (size: string) => {
    if (size === 'Semua') return filters.size.length === 0;
    return filters.size.includes(size);
  };

  const isColorActive = (color: string) => {
    if (color === 'Semua') return filters.color.length === 0;
    return filters.color.includes(color);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <SlidersHorizontal className="w-5 h-5 text-rose-gold" />
          <h3 className="text-lg font-semibold text-deep-navy">Filter Kebaya</h3>
        </div>
        {hasActiveFilters && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleClearFilters}
            className="flex items-center space-x-1 text-sm text-rose-gold hover:text-rose-gold/80 font-medium transition-colors"
          >
            <X className="w-4 h-4" />
            <span>Reset Filter</span>
          </motion.button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Size Filter (Dynamic from maxLD) */}
        <div>
          <label className="block text-sm font-medium text-deep-navy mb-3">
            Ukuran / LD
          </label>
          <div className="flex flex-wrap gap-2">
            {availableSizes.map((size) => (
              <button
                key={size}
                onClick={() => handleSizeToggle(size)}
                className={`px-3 py-2 rounded-lg border-2 text-sm font-medium transition-all duration-200 ${
                  isSizeActive(size)
                    ? 'bg-amber-500 border-amber-500 text-white shadow-md'
                    : 'bg-white border-gray-200 text-deep-navy hover:border-amber-500 hover:text-amber-700'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Color Filter (Dynamic from color column) */}
        <div>
          <label className="block text-sm font-medium text-deep-navy mb-3">
            Warna
          </label>
          <div className="flex flex-wrap gap-2">
            {availableColors.map((color) => (
              <button
                key={color}
                onClick={() => handleColorToggle(color)}
                className={`px-3 py-2 rounded-lg border-2 text-sm font-medium transition-all duration-200 ${
                  isColorActive(color)
                    ? 'bg-amber-500 border-amber-500 text-white shadow-md'
                    : 'bg-white border-gray-200 text-deep-navy hover:border-amber-500 hover:text-amber-700'
                }`}
              >
                {color}
              </button>
            ))}
          </div>
        </div>

        {/* Date Range Filter */}
        <div>
          <label className="block text-sm font-medium text-deep-navy mb-3 flex items-center space-x-2">
            <Calendar className="w-4 h-4" />
            <span>Tanggal Sewa</span>
          </label>
          <div className="space-y-3">
            <input
              type="date"
              value={localStartDate}
              onChange={(e) => setLocalStartDate(e.target.value)}
              onBlur={handleDateChange}
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-amber-500 focus:outline-none transition-colors text-sm"
            />
            <input
              type="date"
              value={localEndDate}
              onChange={(e) => setLocalEndDate(e.target.value)}
              onBlur={handleDateChange}
              min={localStartDate || new Date().toISOString().split('T')[0]}
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-amber-500 focus:outline-none transition-colors text-sm"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
