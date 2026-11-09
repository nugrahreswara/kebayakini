'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Search, FileText, CreditCard, Package, CheckCircle } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const steps = [
  {
    number: 1,
    icon: Search,
    title: 'Pilih & Cek Tanggal',
    description:
      'Jelajahi koleksi kami, pilih kebaya favorit Anda, dan periksa ketersediaan tanggal di kalender interaktif.',
    color: 'bg-rose-gold',
  },
  {
    number: 2,
    icon: FileText,
    title: 'Isi Form & Verifikasi ID',
    description:
      'Lengkapi formulir pemesanan dan upload foto KTP untuk verifikasi identitas. Data Anda aman dan terjaga.',
    color: 'bg-champagne-gold',
  },
  {
    number: 3,
    icon: CreditCard,
    title: 'Bayar DP',
    description:
      'Bayar uang muka sebesar 50% dari total biaya sewa untuk konfirmasi pemesanan Anda.',
    color: 'bg-emerald-green',
  },
  {
    number: 4,
    icon: Package,
    title: 'Ambil atau Kirim',
    description:
      'Pilih ambil sendiri di toko kami atau gunakan layanan pengiriman. Kebaya siap untuk acara Anda!',
    color: 'bg-deep-navy',
  },
];

export default function HowItWorksSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    if (!sectionRef.current) return;

    const cards = cardsRef.current;

    cards.forEach((card, index) => {
      if (card) {
        gsap.fromTo(
          card,
          {
            opacity: 0,
            y: 60,
            scale: 0.9,
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.6,
            delay: index * 0.15,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: card,
              start: 'top bottom-=100',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <section id="cara-sewa" ref={sectionRef} className="relative py-20 sm:py-28 bg-gradient-to-br from-warm-white via-rose-gold/5 to-champagne-gold/10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-deep-navy mb-4">
            Cara <span className="text-gradient">Mudah Menyewa</span>
          </h2>
          <p className="text-lg text-deep-navy/70 max-w-2xl mx-auto">
            Proses pemesanan yang sederhana dan aman dalam 4 langkah mudah
          </p>
        </motion.div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div
                key={step.number}
                ref={(el) => {
                  if (el) cardsRef.current[index] = el;
                }}
                className="relative"
              >
                {/* Connector Line (Desktop) */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-16 left-full w-full h-0.5 bg-gradient-to-r from-rose-gold to-transparent -ml-3" />
                )}

                {/* Card */}
                <div className="relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 group h-full overflow-visible">
                  {/* Step Number Badge - Repositioned to stay within mobile bounds */}
                  <div className="absolute top-2 right-2 w-12 h-12 bg-gradient-to-br from-rose-gold to-champagne-gold rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-xl font-bold text-white">{step.number}</span>
                  </div>

                  {/* Icon */}
                  <div className={`inline-flex p-4 ${step.color} rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>

                  {/* Content */}
                  <h3 className="font-serif text-xl font-bold text-deep-navy mb-3 group-hover:text-rose-gold transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-deep-navy/70 leading-relaxed">{step.description}</p>

                  {/* Check Icon */}
                  <div className="mt-6 pt-6 border-t border-gray-100">
                    <div className="flex items-center space-x-2 text-emerald-green">
                      <CheckCircle className="w-5 h-5" />
                      <span className="text-sm font-medium">Proses Mudah</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <div className="bg-white rounded-xl p-6 shadow-md">
            <div className="text-3xl font-bold text-gradient mb-2">1-2 Jam</div>
            <div className="text-deep-navy/70">Respon Cepat</div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-md">
            <div className="text-3xl font-bold text-gradient mb-2">100%</div>
            <div className="text-deep-navy/70">Aman & Terpercaya</div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-md">
            <div className="text-3xl font-bold text-gradient mb-2">Gratis</div>
            <div className="text-deep-navy/70">Konsultasi & Fitting</div>
          </div>
        </motion.div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-12"
        >
          <motion.a
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            href="https://wa.me/6281234567890"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 px-8 py-4 gradient-rose-gold text-white rounded-full font-semibold text-lg shadow-xl hover:shadow-2xl transition-all"
          >
            <span>Mulai Pemesanan Sekarang</span>
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
