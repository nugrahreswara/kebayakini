'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { Testimonial } from '@/types';
import { mockTestimonials } from '@/data/mockKebaya';
import SafeImage from '@/components/SafeImage';

interface TestimonialsProps {
  /**
   * Live testimonials fetched server-side from the `Testimoni` Google Sheet.
   * When empty/unavailable, the two official fallback entries are used.
   */
  testimonials?: Testimonial[];
  /** Pre-calculated average rating from the fetched rows (1-5 scale). */
  averageRating?: number;
  /** Total count of fetched rows. */
  totalReviews?: number;
}

/** Format ISO or free-form sheet dates without ever rendering "Invalid Date". */
function formatTestimonialDate(value: string): string {
  if (!value) return '';

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;

  return parsed.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export default function Testimonials({
  testimonials,
  averageRating,
  totalReviews,
}: TestimonialsProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  // Only the fetched rows are rendered. The two official sheet entries are
  // used as a resilience fallback when the prop is empty/unavailable.
  const activeTestimonials =
    testimonials && testimonials.length > 0 ? testimonials : mockTestimonials;

  // Stats are derived strictly from the rendered rows unless explicitly
  // supplied by the server page.
  const calculatedTotal = totalReviews ?? activeTestimonials.length;
  const calculatedAverage =
    averageRating ??
    (activeTestimonials.length > 0
      ? activeTestimonials.reduce((sum, item) => sum + item.rating, 0) /
        activeTestimonials.length
      : 0);

  const recommendedCount = activeTestimonials.filter(
    (item) => item.rating >= 4
  ).length;
  const recommendedRate =
    activeTestimonials.length > 0
      ? Math.round((recommendedCount / activeTestimonials.length) * 100)
      : 0;

  // Guard against a stale index when the dataset changes.
  const safeIndex = Math.min(currentIndex, activeTestimonials.length - 1);
  const currentTestimonial = activeTestimonials[safeIndex];

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      zIndex: 0,
      x: dir < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  };

  const paginate = (newDirection: number) => {
    setDirection(newDirection);
    setCurrentIndex((prevIndex) => {
      const nextIndex = prevIndex + newDirection;
      if (nextIndex < 0) return activeTestimonials.length - 1;
      if (nextIndex >= activeTestimonials.length) return 0;
      return nextIndex;
    });
  };

  useEffect(() => {
    if (activeTestimonials.length <= 1) return;

    const timer = setInterval(() => {
      paginate(1);
    }, 7000);

    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex, activeTestimonials.length]);

  return (
    <section
      id="testimoni"
      className="relative py-20 sm:py-28 bg-gradient-to-br from-deep-navy to-deep-navy/90 overflow-hidden"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Testimoni <span className="text-gradient">Pelanggan Kami</span>
          </h2>
          <p className="text-lg text-white/70 max-w-2xl mx-auto">
            Kepuasan pelanggan adalah prioritas kami. Lihat apa yang mereka
            katakan tentang pengalaman menyewa di Kebaya Kini
          </p>
        </motion.div>

        {/* Testimonial Carousel */}
        <div className="relative max-w-5xl mx-auto">
          {activeTestimonials.length === 0 ? (
            <div className="bg-white/10 border border-white/15 rounded-3xl p-12 text-center text-white/70">
              Memuat testimoni pelanggan...
            </div>
          ) : (
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={currentTestimonial.id}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: 'spring', stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 },
                }}
                className="bg-white rounded-3xl shadow-2xl overflow-hidden"
              >
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-0">
                  {/* Image Side */}
                  <div className="relative lg:col-span-2 h-64 lg:h-auto">
                    <SafeImage
                      src={currentTestimonial.image}
                      alt={currentTestimonial.customerName}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 40vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent lg:bg-gradient-to-r" />

                    {/* Event Badge */}
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="inline-flex px-4 py-2 bg-white/90 backdrop-blur-sm rounded-full">
                        <span className="text-sm font-semibold text-deep-navy">
                          {currentTestimonial.event}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Content Side */}
                  <div className="lg:col-span-3 p-8 lg:p-12 flex flex-col justify-center">
                    <Quote className="w-12 h-12 text-rose-gold/20 mb-6" />

                    {/* Rating - dynamic per fetched item */}
                    <div className="flex items-center space-x-1 mb-6">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-5 h-5 ${
                            i < currentTestimonial.rating
                              ? 'fill-rose-gold text-rose-gold'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                      <span className="ml-2 text-sm font-semibold text-deep-navy/60">
                        {currentTestimonial.rating.toFixed(1)}
                      </span>
                    </div>

                    <p className="text-lg lg:text-xl text-deep-navy/80 leading-relaxed mb-8 italic">
                      &quot;{currentTestimonial.comment}&quot;
                    </p>

                    <div>
                      <h4 className="font-serif text-xl font-bold text-deep-navy">
                        {currentTestimonial.customerName}
                      </h4>
                      <p className="text-deep-navy/60">
                        {formatTestimonialDate(currentTestimonial.date)}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          )}

          {/* Navigation Buttons */}
          {activeTestimonials.length > 1 && (
            <>
              <button
                onClick={() => paginate(-1)}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-3 bg-white rounded-full shadow-xl hover:bg-rose-gold hover:text-white transition-all duration-200 group"
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="w-6 h-6 text-deep-navy group-hover:text-white" />
              </button>

              <button
                onClick={() => paginate(1)}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-3 bg-white rounded-full shadow-xl hover:bg-rose-gold hover:text-white transition-all duration-200 group"
                aria-label="Next testimonial"
              >
                <ChevronRight className="w-6 h-6 text-deep-navy group-hover:text-white" />
              </button>
            </>
          )}

          {/* Dots Indicator */}
          <div className="flex justify-center space-x-2 mt-8">
            {activeTestimonials.map((item, index) => (
              <button
                key={item.id}
                onClick={() => {
                  setDirection(index > safeIndex ? 1 : -1);
                  setCurrentIndex(index);
                }}
                className={`transition-all duration-300 rounded-full ${
                  index === safeIndex
                    ? 'bg-rose-gold w-8 h-2'
                    : 'bg-white/30 w-2 h-2 hover:bg-white/50'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Stats - derived strictly from fetched Testimoni rows */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-16 max-w-4xl mx-auto"
        >
          <div className="text-center">
            <div className="text-4xl font-bold text-gradient mb-2">
              {calculatedTotal}+
            </div>
            <div className="text-white/70">Pelanggan Puas</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-gradient mb-2">
              {calculatedAverage.toFixed(1)}/5
            </div>
            <div className="text-white/70">Rating Rata-rata</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-gradient mb-2">
              {calculatedTotal}
            </div>
            <div className="text-white/70">Total Ulasan</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-gradient mb-2">
              {recommendedRate}%
            </div>
            <div className="text-white/70">Recommended</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
