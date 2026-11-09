/**
 * Mock Kebaya Data - Fallback when Google Sheets is unavailable
 */

import { KebayaItem, BookingSchedule } from '@/types/kebaya';
import type { Testimonial } from '@/types';

export const mockKebayaItems: KebayaItem[] = [
  {
    id: 'kb-001',
    code: 'KB-001',
    name: 'Kebaya Brokat Champagne',
    price: 350000,
    maxLD: 'M',
    color: 'Champagne Gold',
    includes: 'Kain, Manset, Ikat Pinggang',
    description: 'Kebaya brokat premium dengan detail payet halus, sempurna untuk acara pernikahan atau wisuda. Material berkualitas tinggi dengan finishing mewah.',
    status: 'Tersedia',
    mainImage: 'https://images.unsplash.com/photo-1617019114583-affb34d1b3cd?w=800&q=80',
    detailImages: [
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=80',
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&q=80',
    ],
    featured: true,
  },
  {
    id: 'kb-002',
    code: 'KB-002',
    name: 'Kebaya Modern Rose Gold',
    price: 400000,
    maxLD: 'L',
    color: 'Rose Gold',
    includes: 'Kain, Manset, Ikat Pinggang',
    description: 'Desain modern dengan sentuhan tradisional. Warna rose gold yang elegan cocok untuk berbagai acara formal.',
    status: 'Disewa',
    mainImage: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&q=80',
    detailImages: [
      'https://images.unsplash.com/photo-1617019114583-affb34d1b3cd?w=800&q=80',
    ],
    featured: true,
  },
  {
    id: 'kb-003',
    code: 'KB-003',
    name: 'Kebaya Encim Hijau Emerald',
    price: 450000,
    maxLD: 'S',
    color: 'Emerald Green',
    includes: 'Kain, Manset, Ikat Pinggang, Aksesori',
    description: 'Kebaya encim klasik dengan warna hijau emerald yang memukau. Detail sulaman tangan dengan benang emas.',
    status: 'Tersedia',
    mainImage: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800&q=80',
    detailImages: [],
  },
  {
    id: 'kb-004',
    code: 'KB-004',
    name: 'Kebaya Tile Modern Navy',
    price: 380000,
    maxLD: 'M',
    color: 'Deep Navy',
    includes: 'Kain, Manset, Ikat Pinggang',
    description: 'Kebaya tile dengan cutting modern. Warna navy yang timeless dan mudah dipadukan dengan berbagai aksesori.',
    status: 'Tersedia',
    mainImage: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=80',
    detailImages: [],
  },
  {
    id: 'kb-005',
    code: 'KB-005',
    name: 'Kebaya Songket Premium Purple',
    price: 500000,
    maxLD: 'L',
    color: 'Purple',
    includes: 'Kain Songket, Manset Sutra, Ikat Pinggang Emas',
    description: 'Kebaya songket eksklusif dengan detail emas. Untuk acara-acara istimewa yang membutuhkan kesan mewah dan elegan.',
    status: 'Maintenance',
    mainImage: 'https://images.unsplash.com/photo-1617019114583-affb34d1b3cd?w=800&q=80',
    detailImages: [],
  },
];

/**
 * Official Testimoni fallback — exactly the two rows curated in the
 * `Testimoni` Google Sheet tab. Used only when the live sheet is
 * unreachable so the section never falls back to legacy fake reviews.
 */
export const mockTestimonials: Testimonial[] = [
  {
    id: 'testimoni-1',
    customerName: 'Sarah Melinda',
    event: 'Wisuda',
    rating: 5,
    comment: 'Kebayanya sangat indah dan fit di badan. Pelayanan ramah!',
    image:
      'https://lh3.googleusercontent.com/d/1e_ePogx7jl4a3aohfLPVDDR7SaZU-md1',
    // Sheet value: "15 Okt 2026"
    date: '2026-10-15',
  },
  {
    id: 'testimoni-2',
    customerName: 'Anisa Putri',
    event: 'Pernikahan',
    rating: 5,
    comment: 'Bahan brokatnya mewah, nyaman dipakai seharian.',
    image:
      'https://lh3.googleusercontent.com/d/1e_ePogx7jl4a3aohfLPVDDR7SaZU-md1',
    // Sheet value: "20 Okt 2026"
    date: '2026-10-20',
  },
];

export const mockBookings: BookingSchedule[] = [
  {
    kebayaCode: 'KB-002',
    startDate: '2026-11-15',
    endDate: '2026-11-17',
    status: 'Booked',
    renterName: 'Sarah',
  },
  {
    kebayaCode: 'KB-002',
    startDate: '2026-11-20',
    endDate: '2026-11-22',
    status: 'Booked',
    renterName: 'Budi',
  },
  {
    kebayaCode: 'KB-005',
    startDate: '2026-11-01',
    endDate: '2026-12-31',
    status: 'Booked',
    renterName: 'Maintenance',
  },
];
