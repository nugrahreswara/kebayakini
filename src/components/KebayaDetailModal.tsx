'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Calendar,
  Ruler,
  Tag,
  Clock,
  MessageCircle,
  ChevronLeft,
  ChevronRight,
  Images,
} from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { buildWhatsAppBookingUrl, formatDateForWhatsApp } from '@/lib/whatsapp';
import { isKebayaAvailableOnDate, getBookedDatesForKebayaFromSchedule } from '@/lib/sheets';
import { useKebayaStore } from '@/store/useKebayaStore';
import type { BookingSchedule } from '@/types/kebaya';
import SafeImage, { PLACEHOLDER_IMAGE } from '@/components/SafeImage';

interface AvailabilityCalendarProps {
  kebayaCode: string;
  bookings: BookingSchedule[];
}

/**
 * Availability Calendar Component
 * Shows booked dates in red/amber and available dates in green
 */
function AvailabilityCalendar({ kebayaCode, bookings }: AvailabilityCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const bookedDates = getBookedDatesForKebayaFromSchedule(kebayaCode, bookings);
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Get first day of month and number of days
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  // Create calendar grid
  const calendarDays = [];

  // Previous month's days
  for (let i = firstDay - 1; i >= 0; i--) {
    calendarDays.push({
      date: new Date(year, month - 1, daysInPrevMonth - i),
      isCurrentMonth: false,
    });
  }

  // Current month's days
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push({
      date: new Date(year, month, day),
      isCurrentMonth: true,
    });
  }

  // Next month's days
  const remainingDays = 42 - calendarDays.length;
  for (let day = 1; day <= remainingDays; day++) {
    calendarDays.push({
      date: new Date(year, month + 1, day),
      isCurrentMonth: false,
    });
  }

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(year, month - 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(year, month + 1));
  };

  const monthName = currentDate.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });

  return (
    <div className="space-y-4">
      {/* Month/Year Header */}
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-semibold text-deep-navy">{monthName}</h4>
        <div className="flex space-x-2">
          <button
            onClick={goToPreviousMonth}
            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Previous month"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={goToNextMonth}
            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Next month"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Day Headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].map((day) => (
          <div
            key={day}
            className="text-center text-xs font-semibold text-deep-navy/60 py-2"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((dayObj, index) => {
          const isAvailable = isKebayaAvailableOnDate(dayObj.date, bookedDates);
          const isToday =
            dayObj.date.toDateString() === new Date().toDateString();
          const dateStr = dayObj.date.getDate();

          let bgColor = 'bg-gray-50 text-gray-300';

          if (dayObj.isCurrentMonth) {
            if (isToday) {
              bgColor = 'bg-blue-100 text-deep-navy border border-blue-300';
            } else if (isAvailable) {
              bgColor = 'bg-emerald-green/10 text-emerald-green font-semibold hover:bg-emerald-green/20';
            } else {
              bgColor = 'bg-amber-orange/10 text-amber-orange font-semibold hover:bg-amber-orange/20';
            }
          }

          return (
            <button
              key={index}
              className={`aspect-square rounded text-xs font-medium transition-colors ${bgColor} ${
                dayObj.isCurrentMonth ? 'cursor-pointer' : ''
              }`}
              disabled={!dayObj.isCurrentMonth}
            >
              {dateStr}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="pt-4 space-y-2 text-xs border-t border-gray-200">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-emerald-green/30 rounded border border-emerald-green" />
          <span className="text-emerald-green font-medium">Tersedia</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-amber-orange/30 rounded border border-amber-orange" />
          <span className="text-amber-orange font-medium">Dipinjam</span>
        </div>
      </div>
    </div>
  );
}

/**
 * Kebaya Detail Modal with Real Availability
 * Uses Zustand store for state management.
 *
 * Image pipeline:
 *   foto_utama (main) + foto_detail_1/2 (all angles)
 *   -> deduplicated gallery -> SafeImage with broken-link fallback.
 */
export default function KebayaDetailModal() {
  const isOpen = useKebayaStore((state) => state.isDetailModalOpen);
  const toggleModal = useKebayaStore((state) => state.toggleDetailModal);
  const selectedKebaya = useKebayaStore((state) => state.selectedKebaya);
  const bookings = useKebayaStore((state) => state.bookings);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedDates, setSelectedDates] = useState<{ start: Date | null; end: Date | null }>({
    start: null,
    end: null,
  });

  // Handle both the legacy Kebaya store shape and the new KebayaItem shape.
  const kebaya = selectedKebaya as any;

  /**
   * Build a clean, deduplicated gallery from every possible source:
   * mainImage (sheets), detailImages (sheets), or the legacy images[] array.
   */
  const images = useMemo<string[]>(() => {
    if (!kebaya) return [PLACEHOLDER_IMAGE];

    const toUrl = (image: unknown): string => {
      if (typeof image === 'string') return image.trim();
      if (image && typeof image === 'object' && 'url' in image) {
        return String((image as { url?: string }).url || '').trim();
      }
      return '';
    };

    const candidates: string[] = [
      toUrl(kebaya.mainImage),
      ...(Array.isArray(kebaya.detailImages) ? kebaya.detailImages.map(toUrl) : []),
      ...(Array.isArray(kebaya.images) ? kebaya.images.map(toUrl) : []),
    ];

    const unique = Array.from(new Set(candidates.filter(Boolean)));
    return unique.length > 0 ? unique : [PLACEHOLDER_IMAGE];
  }, [kebaya]);

  // Body scroll lock
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Reset the gallery + date selection whenever a different kebaya opens.
  useEffect(() => {
    setCurrentImageIndex(0);
    setSelectedDates({ start: null, end: null });
  }, [kebaya?.id]);

  // Keep the index valid if the gallery shrinks.
  useEffect(() => {
    setCurrentImageIndex((prev) => Math.min(prev, Math.max(images.length - 1, 0)));
  }, [images.length]);

  // Keyboard navigation while the modal is open.
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        toggleModal();
      } else if (event.key === 'ArrowRight' && images.length > 1) {
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
      } else if (event.key === 'ArrowLeft' && images.length > 1) {
        setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, images.length, toggleModal]);

  if (!selectedKebaya) return null;

  const currentImage = images[currentImageIndex] || images[0] || PLACEHOLDER_IMAGE;
  const displayStatus = kebaya.sheetStatus || kebaya.status || 'N/A';
  const isAvailable =
    displayStatus === 'Tersedia' || displayStatus === 'available';
  const isBooked = displayStatus === 'Disewa' || displayStatus === 'booked';

  const handleClose = () => {
    toggleModal();
    setCurrentImageIndex(0);
    setSelectedDates({ start: null, end: null });
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleBooking = () => {
    const bookingUrl = buildWhatsAppBookingUrl({
      kebayaName: kebaya.name,
      kebayaCode: kebaya.code || kebaya.id,
      price: kebaya.price,
      startDate: selectedDates.start ? formatDateForWhatsApp(selectedDates.start) : undefined,
      endDate: selectedDates.end ? formatDateForWhatsApp(selectedDates.end) : undefined,
    });
    window.open(bookingUrl, '_blank');
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
            data-lenis-prevent
          />

          {/* Modal Container */}
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
            data-lenis-prevent
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative w-full max-w-6xl h-[90vh] bg-white rounded-3xl shadow-2xl overflow-hidden pointer-events-auto"
              data-lenis-prevent
            >
              {/* Close Button */}
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 z-30 p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors shadow-lg"
                aria-label="Close modal"
              >
                <X className="w-6 h-6 text-deep-navy" />
              </button>

              {/* Content - Flexbox Layout */}
              <div className="flex flex-col md:flex-row h-full">
                {/* Left Side - Image Gallery */}
                <div className="relative bg-gradient-to-br from-rose-50 to-amber-50 w-full md:w-1/2 h-64 sm:h-72 md:h-full flex-shrink-0">
                  {/* Main Image */}
                  <div className="relative w-full h-full">
                    <AnimatePresence initial={false} mode="wait">
                      <motion.div
                        key={`${currentImage}-${currentImageIndex}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="absolute inset-0"
                      >
                        <SafeImage
                          src={currentImage}
                          alt={`${kebaya.name || 'Kebaya'} - foto ${currentImageIndex + 1}`}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, 50vw"
                          priority
                        />
                      </motion.div>
                    </AnimatePresence>

                    {/* Soft gradient for legibility */}
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/45 to-transparent" />

                    {/* Navigation Arrows */}
                    {images.length > 1 && (
                      <>
                        <button
                          onClick={handlePrevImage}
                          className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 z-10 p-2.5 sm:p-3 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-all shadow-lg"
                          aria-label="Previous image"
                        >
                          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-deep-navy" />
                        </button>
                        <button
                          onClick={handleNextImage}
                          className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 z-10 p-2.5 sm:p-3 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-all shadow-lg"
                          aria-label="Next image"
                        >
                          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-deep-navy" />
                        </button>
                      </>
                    )}

                    {/* Angle label */}
                    <div className="absolute top-4 left-4 z-10 flex items-center gap-2 px-3 py-1.5 bg-black/50 backdrop-blur-sm text-white text-xs sm:text-sm rounded-full">
                      <Images className="w-3.5 h-3.5" />
                      <span>
                        {currentImageIndex === 0 ? 'Tampak Depan' : `Detail ${currentImageIndex}`}
                      </span>
                    </div>

                    {/* Counter */}
                    {images.length > 1 && (
                      <div className="absolute top-4 right-16 z-10 px-2.5 py-1 bg-black/50 backdrop-blur-sm text-white text-xs rounded-full">
                        {currentImageIndex + 1} / {images.length}
                      </div>
                    )}
                  </div>

                  {/* Thumbnail Strip - real multi-angle previews */}
                  {images.length > 1 && (
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 flex max-w-[92%] gap-2 overflow-x-auto rounded-2xl bg-white/80 p-2 backdrop-blur-sm scrollbar-thin scrollbar-thumb-amber-300 scrollbar-track-transparent">
                      {images.map((image, index) => (
                        <button
                          key={`${image}-${index}`}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg ring-2 transition-all ${
                            index === currentImageIndex
                              ? 'ring-rose-gold'
                              : 'ring-transparent opacity-70 hover:opacity-100'
                          }`}
                          aria-label={`Lihat foto ${index + 1}`}
                          aria-current={index === currentImageIndex}
                        >
                          <SafeImage
                            src={image}
                            alt={`${kebaya.name || 'Kebaya'} thumbnail ${index + 1}`}
                            fill
                            sizes="48px"
                            className="object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Right Side - Details & Scrollable Content */}
                <div
                  className="w-full md:w-1/2 h-full overflow-y-auto p-6 lg:p-8 space-y-6 scrollbar-thin scrollbar-thumb-amber-300 scrollbar-track-transparent"
                  data-lenis-prevent
                >
                  {/* Status Badge */}
                  <div>
                    <span
                      className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold ${
                        isAvailable
                          ? 'bg-emerald-green text-white'
                          : isBooked
                          ? 'bg-amber-orange text-white'
                          : 'bg-gray-500 text-white'
                      }`}
                    >
                      ✓ {displayStatus}
                    </span>
                  </div>

                  {/* Title & Price */}
                  <div>
                    <h2 className="font-serif text-3xl lg:text-4xl font-bold text-deep-navy mb-3">
                      {kebaya.name}
                    </h2>
                    <div className="flex items-baseline space-x-2">
                      <span className="text-3xl lg:text-4xl font-bold text-gradient">
                        {formatPrice(kebaya.price)}
                      </span>
                      <span className="text-deep-navy/60">/hari</span>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <p className="text-deep-navy/80 leading-relaxed">{kebaya.description}</p>
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-2 gap-4 py-4 border-y border-gray-200">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-rose-gold/10 rounded-lg">
                        <Ruler className="w-5 h-5 text-rose-gold" />
                      </div>
                      <div>
                        <div className="text-xs text-deep-navy/60">Ukuran</div>
                        <div className="font-semibold text-deep-navy">{kebaya.size || kebaya.maxLD || 'M'}</div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-rose-gold/10 rounded-lg">
                        <Tag className="w-5 h-5 text-rose-gold" />
                      </div>
                      <div>
                        <div className="text-xs text-deep-navy/60">Warna</div>
                        <div className="font-semibold text-deep-navy">{kebaya.color || 'N/A'}</div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-rose-gold/10 rounded-lg">
                        <Calendar className="w-5 h-5 text-rose-gold" />
                      </div>
                      <div>
                        <div className="text-xs text-deep-navy/60">Dibooking</div>
                        <div className="font-semibold text-deep-navy">
                          {kebaya.bookedDates?.length || 0} kali
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-rose-gold/10 rounded-lg">
                        <Clock className="w-5 h-5 text-rose-gold" />
                      </div>
                      <div>
                        <div className="text-xs text-deep-navy/60">Durasi Min</div>
                        <div className="font-semibold text-deep-navy">3 hari</div>
                      </div>
                    </div>
                  </div>

                  {/* Tags */}
                  {kebaya.tags && kebaya.tags.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold text-deep-navy mb-2">Kategori</h4>
                      <div className="flex flex-wrap gap-2">
                        {kebaya.tags.map((tag: string) => (
                          <span
                            key={tag}
                            className="px-3 py-1.5 bg-rose-gold/10 text-rose-gold text-sm rounded-lg font-medium"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Availability Calendar */}
                  <div className="pb-8">
                    <h4 className="text-lg font-semibold text-deep-navy mb-4">
                      Ketersediaan Tanggal
                    </h4>
                    <AvailabilityCalendar kebayaCode={kebaya.code || kebaya.id} bookings={bookings} />
                  </div>

                  {/* Booking Button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleBooking}
                    className="w-full flex items-center justify-center space-x-2 px-6 py-4 gradient-rose-gold text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all"
                  >
                    <MessageCircle className="w-5 h-5" />
                    <span>Pesan via WhatsApp</span>
                  </motion.button>

                  {/* Info Note */}
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg mb-8">
                    <p className="text-sm text-blue-900">
                      <strong>Catatan:</strong> Konfirmasi ketersediaan dan detail pemesanan akan
                      dilakukan melalui WhatsApp. Tim kami akan merespons dalam 1-2 jam kerja.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
