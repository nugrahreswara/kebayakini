'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { Canvas } from '@react-three/fiber';
import FabricParticles from './3d/FabricParticles';
import HeroCarousel from './HeroCarousel';
import { gsap } from 'gsap';

export default function HeroSection() {
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollIndicatorRef.current) {
      gsap.to(scrollIndicatorRef.current, {
        y: 10,
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut',
      });
    }
  }, []);

  const handleScrollDown = () => {
    const catalogSection = document.querySelector('#katalog');
    if (catalogSection) {
      catalogSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative w-full min-h-screen overflow-hidden bg-gradient-to-br from-warm-white via-rose-gold/5 to-champagne-gold/10">
      {/* 3D Background Canvas */}
      <div className="absolute inset-0 z-0">
        <Canvas
          camera={{ position: [0, 0, 5], fov: 75 }}
          className="w-full h-full"
        >
          <FabricParticles />
        </Canvas>
      </div>

      {/* Hero Content Overlay - Added padding top for mobile navbar clearance */}
      <div className="relative z-10 w-full min-h-screen flex items-center justify-center pt-20 sm:pt-24 md:pt-28 lg:pt-32 pb-20 sm:pb-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Mobile: Flex Column Stack | Desktop: Grid 2 columns */}
          <div className="flex flex-col lg:grid lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-center">
            
            {/* MOBILE ORDER 1: Text Content - Always first on mobile */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="w-full text-center lg:text-left space-y-4 sm:space-y-6 order-1 lg:order-1"
            >
              {/* Headline */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-deep-navy leading-tight"
              >
                Elegansi dalam
                <span className="block text-gradient mt-2">
                  Setiap Jahitan
                </span>
              </motion.h1>

              {/* Subheading */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="text-base sm:text-lg md:text-xl text-deep-navy/70 max-w-xl mx-auto lg:mx-0"
              >
                Koleksi kebaya premium untuk momen istimewa Anda. 
                Sewa kebaya berkualitas tinggi dengan desain eksklusif dan pelayanan terpercaya.
              </motion.p>

              {/* MOBILE ORDER 2: Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start pt-2"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    const katalogSection = document.querySelector('#katalog');
                    katalogSection?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 gradient-rose-gold text-white rounded-full font-semibold text-base sm:text-lg shadow-xl hover:shadow-2xl transition-all duration-300"
                >
                  Lihat Koleksi
                </motion.button>
                
                <motion.a
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  href="https://wa.me/6281234567890"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-white text-rose-gold border-2 border-rose-gold rounded-full font-semibold text-base sm:text-lg shadow-lg hover:bg-rose-gold hover:text-white transition-all duration-300"
                >
                  Hubungi Kami
                </motion.a>
              </motion.div>

              {/* MOBILE ORDER 3: Stats Grid */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1 }}
                className="grid grid-cols-3 gap-3 sm:gap-4 pt-4 sm:pt-6 lg:pt-8"
              >
                <div className="text-center lg:text-left">
                  <div className="text-2xl sm:text-3xl font-bold text-gradient">100+</div>
                  <div className="text-xs sm:text-sm text-deep-navy/60 mt-1">Koleksi</div>
                </div>
                <div className="text-center lg:text-left">
                  <div className="text-2xl sm:text-3xl font-bold text-gradient">500+</div>
                  <div className="text-xs sm:text-sm text-deep-navy/60 mt-1">Pelanggan</div>
                </div>
                <div className="text-center lg:text-left">
                  <div className="text-2xl sm:text-3xl font-bold text-gradient">4.9</div>
                  <div className="text-xs sm:text-sm text-deep-navy/60 mt-1">Rating</div>
                </div>
              </motion.div>
            </motion.div>

            {/* MOBILE ORDER 4: Carousel - Appears after stats on mobile */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="w-full h-[400px] sm:h-[450px] md:h-[500px] lg:h-[600px] order-2 lg:order-2 mt-4 lg:mt-0"
            >
              <HeroCarousel />
            </motion.div>
          </div>
        </div>
      </div>

      {/* MOBILE ORDER 5: Scroll Down Indicator - Bottom with safe spacing, separated from carousel */}
      <motion.div
        ref={scrollIndicatorRef}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.2 }}
        onClick={handleScrollDown}
        className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 z-20 cursor-pointer mt-8"
      >
        <div className="flex flex-col items-center space-y-3 group">
          <span className="text-xs sm:text-sm font-medium text-deep-navy/70 group-hover:text-amber-500 transition-colors text-center px-4">
            Gulir untuk eksplorasi koleksi
          </span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ 
              duration: 1.5, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
            className="flex items-center justify-center"
          >
            <ChevronDown className="w-6 h-6 sm:w-7 sm:h-7 text-amber-500 group-hover:text-rose-gold transition-colors" strokeWidth={2.5} />
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
