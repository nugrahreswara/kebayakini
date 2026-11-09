'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useKebayaStore } from '@/store/useKebayaStore';
import { buildWhatsAppBookingUrl } from '@/lib/whatsapp';
import SafeImage from '@/components/SafeImage';

export default function HeroCarousel() {
  const kebayas = useKebayaStore((state) => state.kebayas);
  const featuredKebayas = kebayas.filter((k) => k.featured);
  // Never leave the hero empty when no item is flagged as featured.
  const carouselKebayas = featuredKebayas.length > 0 ? featuredKebayas : kebayas;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };

  const paginate = useCallback((newDirection: number) => {
    setDirection(newDirection);
    setCurrentIndex((prevIndex) => {
      const nextIndex = prevIndex + newDirection;
      if (nextIndex < 0) return carouselKebayas.length - 1;
      if (nextIndex >= carouselKebayas.length) return 0;
      return nextIndex;
    });
  }, [carouselKebayas.length]);

  useEffect(() => {
    const timer = setInterval(() => {
      paginate(1);
    }, 5000);

    return () => clearInterval(timer);
  }, [paginate]);

  // Keep the active slide valid when the catalog changes.
  useEffect(() => {
    setCurrentIndex((prev) => (prev >= carouselKebayas.length ? 0 : prev));
  }, [carouselKebayas.length]);

  if (carouselKebayas.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-warm-white/50 backdrop-blur-sm rounded-3xl">
        <p className="text-deep-navy/50">No featured items</p>
      </div>
    );
  }

  const currentKebaya = carouselKebayas[currentIndex];

  return (
    <div className="relative w-full h-full rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl">
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={currentIndex}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: 'spring', stiffness: 300, damping: 30 },
            opacity: { duration: 0.2 },
          }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={1}
          onDragEnd={(e, { offset, velocity }) => {
            const swipe = swipePower(offset.x, velocity.x);

            if (swipe < -swipeConfidenceThreshold) {
              paginate(1);
            } else if (swipe > swipeConfidenceThreshold) {
              paginate(-1);
            }
          }}
          className="absolute inset-0"
        >
          {/* Image */}
          <div className="relative w-full h-full">
            <SafeImage
              src={currentKebaya.images?.[0]?.url || (currentKebaya as any).mainImage}
              alt={currentKebaya.name}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

            {/* Content - Adjusted padding and spacing for mobile */}
            <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 md:p-8 lg:p-10 text-white">
              {/* Status Badge - Better mobile typography and spacing */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mb-3 sm:mb-4"
              >
                <span
                  className={`inline-flex items-center px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-semibold leading-tight ${
                    currentKebaya.status === 'available'
                      ? 'bg-emerald-green text-white'
                      : 'bg-amber-orange text-white'
                  }`}
                >
                  {currentKebaya.status === 'available'
                    ? 'Tersedia - Siap Sewa'
                    : 'Dipinjam - Tersedia Tanggal Lain'}
                </span>
              </motion.div>

              {/* Title */}
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="font-serif text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-2 leading-tight"
              >
                {currentKebaya.name}
              </motion.h2>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-xs sm:text-sm md:text-base text-white/90 mb-3 sm:mb-4 line-clamp-2"
              >
                {currentKebaya.description}
              </motion.p>

              {/* Price & CTA - Stack on mobile for better spacing */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4"
              >
                <div>
                  <div className="text-xs sm:text-sm text-white/70">Mulai dari</div>
                  <div className="text-xl sm:text-2xl md:text-3xl font-bold">
                    {new Intl.NumberFormat('id-ID', {
                      style: 'currency',
                      currency: 'IDR',
                      minimumFractionDigits: 0,
                    }).format(currentKebaya.price)}
                  </div>
                </div>

                <motion.a
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  href={buildWhatsAppBookingUrl({
                    kebayaName: currentKebaya.name,
                    kebayaCode: (currentKebaya as any).code,
                    price: currentKebaya.price,
                  })}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto text-center px-4 sm:px-6 py-2.5 sm:py-3 bg-white text-rose-gold rounded-full font-semibold text-sm sm:text-base shadow-lg hover:bg-rose-gold hover:text-white transition-all duration-300"
                >
                  Pesan Sekarang
                </motion.a>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Buttons - Better mobile positioning to avoid badge overlap */}
      <button
        onClick={() => paginate(-1)}
        className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-10 p-1.5 sm:p-2 rounded-full bg-white/30 backdrop-blur-sm hover:bg-white/50 transition-all duration-200 group"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-white group-hover:scale-110 transition-transform" />
      </button>

      <button
        onClick={() => paginate(1)}
        className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-10 p-1.5 sm:p-2 rounded-full bg-white/30 backdrop-blur-sm hover:bg-white/50 transition-all duration-200 group"
        aria-label="Next slide"
      >
        <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-white group-hover:scale-110 transition-transform" />
      </button>

      {/* Dots Indicator - Adjusted bottom spacing to avoid content overlap */}
      <div className="absolute bottom-2 sm:bottom-4 left-1/2 -translate-x-1/2 z-10 flex space-x-1.5 sm:space-x-2">
        {carouselKebayas.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setDirection(index > currentIndex ? 1 : -1);
              setCurrentIndex(index);
            }}
            className={`h-1.5 sm:h-2 rounded-full transition-all duration-300 ${
              index === currentIndex
                ? 'bg-white w-6 sm:w-8'
                : 'bg-white/50 hover:bg-white/75 w-1.5 sm:w-2'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
