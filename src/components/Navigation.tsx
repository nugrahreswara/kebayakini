'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import RulesModal from './RulesModal';

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isRulesModalOpen, setIsRulesModalOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Katalog', href: '#katalog' },
    { name: 'Cara Sewa', href: '#cara-sewa' },
    { name: 'Testimoni', href: '#testimoni' },
    { name: 'Kontak', href: '#kontak' },
  ];

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          isScrolled ? 'glassmorphism shadow-lg' : 'bg-transparent'
        )}
      >
        {/* 3-Column Desktop Layout Container */}
        <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 md:h-20 flex items-center justify-between">
          
          {/* COLUMN 1: LEFT - BRAND LOGO */}
          <Link href="/" className="flex items-center gap-3 z-10 group">
            <Image
              src="/logo.png"
              alt="Kebaya Kini"
              width={140}
              height={50}
              priority
              className="h-10 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
            />
            <span className="font-serif text-xl md:text-2xl font-bold text-gradient hidden sm:inline">
              Kebaya Kini
            </span>
          </Link>

          {/* COLUMN 2: CENTER - NAVIGATION LINKS (ABSOLUTELY CENTERED) */}
          <div className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2 transform">
            {navLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => scrollToSection(link.href)}
                className="text-sm font-medium text-deep-navy hover:text-amber-600 transition-colors duration-200 relative group"
              >
                {link.name}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-amber-500 group-hover:w-full transition-all duration-300" />
              </button>
            ))}
          </div>

          {/* COLUMN 3: RIGHT - CTA BUTTON & MOBILE TOGGLE */}
          <div className="flex items-center gap-4 z-10">
            {/* Desktop Rules Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsRulesModalOpen(true)}
              className="hidden md:flex items-center gap-2 px-4 py-2.5 bg-white/90 text-deep-navy rounded-full font-medium hover:bg-white shadow-lg hover:shadow-xl transition-all duration-200 border border-gray-200"
            >
              <FileText className="w-4 h-4" />
              <span>Aturan</span>
            </motion.button>

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-amber-500/10 transition-colors"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6 text-deep-navy" />
              ) : (
                <Menu className="w-6 h-6 text-deep-navy" />
              )}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="fixed inset-y-0 right-0 z-40 w-full sm:w-80 glassmorphism shadow-2xl md:hidden"
          >
            <div className="flex flex-col h-full pt-24 px-6 pb-6">
              <div className="flex flex-col space-y-6">
                {navLinks.map((link, index) => (
                  <motion.button
                    key={link.name}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => scrollToSection(link.href)}
                    className="text-left text-lg font-medium text-deep-navy hover:text-amber-600 transition-colors py-2"
                  >
                    {link.name}
                  </motion.button>
                ))}
              </div>

              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                onClick={() => {
                  setIsRulesModalOpen(true);
                  setIsMobileMenuOpen(false);
                }}
                className="mt-8 w-full flex items-center justify-center space-x-2 px-6 py-3 bg-white/90 text-deep-navy rounded-full font-medium shadow-lg border border-gray-200"
              >
                <FileText className="w-4 h-4" />
                <span>Aturan & Ketentuan</span>
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Menu Backdrop Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 md:hidden"
          />
        )}
      </AnimatePresence>

      {/* Rules Modal */}
      <RulesModal
        isOpen={isRulesModalOpen}
        onClose={() => setIsRulesModalOpen(false)}
      />
    </>
  );
}
