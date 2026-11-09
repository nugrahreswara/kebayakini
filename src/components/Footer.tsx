'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import {
  MapPin,
  Phone,
  Clock,
  Instagram,
  MessageCircle,
} from 'lucide-react';
import { Music2 } from 'lucide-react';

export default function Footer() {
  const contactInfo = [
    {
      icon: MapPin,
      title: 'Alamat',
      content: 'Jl. Kebaya Indah No. 123, Jakarta Selatan 12345',
      link: 'https://maps.google.com',
    },
    {
      icon: Phone,
      title: 'WhatsApp',
      content: '+62 821-5640-5364',
      link: 'https://wa.me/6282156405364',
    },
    {
      icon: Clock,
      title: 'Jam Operasional',
      content: 'Senin - Sabtu: 09:00 - 18:00',
      link: null,
    },
  ];

  const socialMedia = [
    {
      icon: Instagram,
      name: 'Instagram',
      link: 'https://instagram.com/by_kebayakini',
      color: 'hover:text-pink-500',
    },
    {
      icon: Music2,
      name: 'TikTok',
      link: 'https://tiktok.com/@by_kebayakini',
      color: 'hover:text-white',
    },
    {
      icon: MessageCircle,
      name: 'WhatsApp',
      link: 'https://wa.me/6282156405364',
      color: 'hover:text-green-500',
    },
  ];

  const quickLinks = [
    { name: 'Tentang Kami', href: '#' },
    { name: 'Katalog', href: '#katalog' },
    { name: 'Cara Sewa', href: '#cara-sewa' },
    { name: 'Syarat & Ketentuan', href: '#' },
    { name: 'Kebijakan Privasi', href: '#' },
    { name: 'FAQ', href: '#' },
  ];

  const rentalTerms = [
    'Minimum sewa 1 hari',
    'DP 50% dari total biaya',
    'Deposit keamanan Rp 500.000',
    'Wajib menunjukkan KTP asli',
    'Denda keterlambatan Rp 100.000/hari',
    'Kerusakan ditanggung penyewa',
  ];

  return (
    <footer id="kontak" className="relative bg-gradient-to-br from-deep-navy to-deep-navy/95 text-white pt-20 pb-8">
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Section with Logo */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-flex items-center space-x-3 mb-6 group">
              <div className="bg-white rounded-lg p-2">
                <Image
                  src="/logo.png"
                  alt="Kebaya Kini"
                  width={120}
                  height={42}
                  className="h-10 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <h2 className="font-serif text-2xl font-bold text-gradient">Kebaya Kini</h2>
            </Link>
            <p className="text-white/70 mb-6 leading-relaxed">
              Persewaan kebaya premium dengan koleksi eksklusif dan pelayanan terbaik untuk momen
              spesial Anda.
            </p>
            
            {/* Social Media - Centered on mobile, left-aligned on desktop */}
            <div className="flex justify-center md:justify-start items-center gap-4">
              {socialMedia.map((social) => {
                const Icon = social.icon;
                return (
                  <motion.a
                    key={social.name}
                    href={social.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className={`p-3 bg-white/10 rounded-full backdrop-blur-sm transition-all ${social.color}`}
                    aria-label={social.name}
                  >
                    <Icon className="w-5 h-5" />
                  </motion.a>
                );
              })}
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-serif text-xl font-bold mb-6">Kontak Kami</h3>
            <div className="space-y-4">
              {contactInfo.map((info) => {
                const Icon = info.icon;
                const content = info.link ? (
                  <a
                    href={info.link}
                    target={info.link.startsWith('http') ? '_blank' : undefined}
                    rel={info.link.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className="text-white/70 hover:text-rose-gold transition-colors"
                  >
                    {info.content}
                  </a>
                ) : (
                  <span className="text-white/70">{info.content}</span>
                );

                return (
                  <div key={info.title} className="flex items-start space-x-3">
                    <div className="p-2 bg-rose-gold/20 rounded-lg flex-shrink-0 mt-1">
                      <Icon className="w-4 h-4 text-rose-gold" />
                    </div>
                    <div>
                      <div className="text-sm font-medium mb-1">{info.title}</div>
                      {content}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-serif text-xl font-bold mb-6">Link Cepat</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-white/70 hover:text-rose-gold transition-colors inline-flex items-center group"
                  >
                    <span className="w-1.5 h-1.5 bg-rose-gold rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Rental Terms */}
          <div>
            <h3 className="font-serif text-xl font-bold mb-6">Ketentuan Sewa</h3>
            <ul className="space-y-3 text-sm">
              {rentalTerms.map((term, index) => (
                <li key={index} className="flex items-start space-x-2 text-white/70">
                  <span className="w-1.5 h-1.5 bg-rose-gold rounded-full flex-shrink-0 mt-1.5" />
                  <span>{term}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Google Maps Embed */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-12 rounded-2xl overflow-hidden shadow-2xl"
        >
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.0!2d106.8!3d-6.2!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNsKwMTInMDAuMCJTIDEwNsKwNDgnMDAuMCJF!5e0!3m2!1sen!2sid!4v1234567890"
            width="100%"
            height="300"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Lokasi Kebaya Kini"
          />
        </motion.div>
      </div>
    </footer>
  );
}
