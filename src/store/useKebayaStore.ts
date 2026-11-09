import { create } from 'zustand';
import { Kebaya, FilterOptions, BookedDate } from '@/types';
import type { BookingSchedule } from '@/types/kebaya';

interface KebayaStore {
  kebayas: Kebaya[];
  filteredKebayas: Kebaya[];
  selectedKebaya: Kebaya | null;
  filters: FilterOptions;
  isDetailModalOpen: boolean;
  bookings: BookingSchedule[];
  
  setKebayas: (kebayas: Kebaya[]) => void;
  setBookings: (bookings: BookingSchedule[]) => void;
  setSelectedKebaya: (kebaya: Kebaya | null) => void;
  setFilters: (filters: Partial<FilterOptions>) => void;
  applyFilters: () => void;
  toggleDetailModal: () => void;
  addKebaya: (kebaya: Kebaya) => void;
  updateKebaya: (id: string, kebaya: Partial<Kebaya>) => void;
  deleteKebaya: (id: string) => void;
  addBookedDate: (kebayaId: string, bookedDate: BookedDate) => void;
}

export const useKebayaStore = create<KebayaStore>((set, get) => ({
  kebayas: [
    {
      id: '1',
      name: 'Kebaya Brokat Champagne',
      description: 'Kebaya brokat premium dengan detail payet halus, sempurna untuk acara pernikahan atau wisuda. Material berkualitas tinggi dengan finishing mewah.',
      price: 350000,
      size: 'M',
      color: 'Champagne Gold',
      status: 'available',
      featured: true,
      tags: ['brokat', 'premium', 'pernikahan'],
      images: [
        {
          id: 'img1-1',
          url: 'https://images.unsplash.com/photo-1617019114583-affb34d1b3cd?w=800&q=80',
          type: 'full',
          alt: 'Kebaya Brokat Champagne - Tampak Depan',
        },
        {
          id: 'img1-2',
          url: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=80',
          type: 'close-up',
          alt: 'Detail Brokat',
        },
        {
          id: 'img1-3',
          url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&q=80',
          type: 'sleeve',
          alt: 'Detail Lengan',
        },
        {
          id: 'img1-4',
          url: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800&q=80',
          type: 'back',
          alt: 'Tampak Belakang',
        },
      ],
      bookedDates: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: '2',
      name: 'Kebaya Modern Rose Gold',
      description: 'Desain modern dengan sentuhan tradisional. Warna rose gold yang elegan cocok untuk berbagai acara formal.',
      price: 400000,
      size: 'L',
      color: 'Rose Gold',
      status: 'booked',
      featured: true,
      tags: ['modern', 'elegant', 'formal'],
      images: [
        {
          id: 'img2-1',
          url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&q=80',
          type: 'full',
          alt: 'Kebaya Modern Rose Gold',
        },
        {
          id: 'img2-2',
          url: 'https://images.unsplash.com/photo-1617019114583-affb34d1b3cd?w=800&q=80',
          type: 'close-up',
          alt: 'Detail Kain',
        },
      ],
      bookedDates: [
        {
          startDate: '2026-11-15',
          endDate: '2026-11-17',
          customerName: 'Sarah',
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: '3',
      name: 'Kebaya Encim Hijau Emerald',
      description: 'Kebaya encim klasik dengan warna hijau emerald yang memukau. Detail sulaman tangan dengan benang emas.',
      price: 450000,
      size: 'S',
      color: 'Emerald Green',
      status: 'available',
      featured: false,
      tags: ['encim', 'klasik', 'sulaman'],
      images: [
        {
          id: 'img3-1',
          url: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800&q=80',
          type: 'full',
          alt: 'Kebaya Encim Hijau Emerald',
        },
      ],
      bookedDates: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: '4',
      name: 'Kebaya Tile Modern Navy',
      description: 'Kebaya tile dengan cutting modern. Warna navy yang timeless dan mudah dipadukan dengan berbagai aksesori.',
      price: 380000,
      size: 'M',
      color: 'Deep Navy',
      status: 'available',
      featured: false,
      tags: ['tile', 'modern', 'navy'],
      images: [
        {
          id: 'img4-1',
          url: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=80',
          type: 'full',
          alt: 'Kebaya Tile Modern Navy',
        },
      ],
      bookedDates: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ],
  filteredKebayas: [],
  selectedKebaya: null,
  filters: {
    size: [],
    color: [],
    dateRange: {
      start: null,
      end: null,
    },
    priceRange: {
      min: 0,
      max: 1000000,
    },
  },
  isDetailModalOpen: false,
  bookings: [],

  setKebayas: (kebayas) => set({ kebayas, filteredKebayas: kebayas }),

  setBookings: (bookings) => set({ bookings }),

  setSelectedKebaya: (kebaya) => set({ selectedKebaya: kebaya }),

  setFilters: (newFilters) => 
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
    })),

  applyFilters: () => {
    const { kebayas, filters } = get();
    let filtered = [...kebayas];

    // Filter by size (maxLD) - check both size and maxLD properties
    if (filters.size.length > 0) {
      filtered = filtered.filter((k) => {
        const kebayaSize = (k as any).maxLD || k.size || '';
        return filters.size.some(filterSize => {
          // Match exact size or maxLD value
          return kebayaSize.toString().trim() === filterSize.trim();
        });
      });
    }

    // Filter by color - check both color property variants
    if (filters.color.length > 0) {
      filtered = filtered.filter((k) => {
        const kebayaColor = (k as any).color || k.color || '';
        return filters.color.some(filterColor => {
          return kebayaColor.toString().trim().toLowerCase() === filterColor.trim().toLowerCase();
        });
      });
    }

    // Filter by date range
    if (filters.dateRange.start && filters.dateRange.end) {
      const start = new Date(filters.dateRange.start).getTime();
      const end = new Date(filters.dateRange.end).getTime();

      filtered = filtered.filter((k) => {
        const hasConflict = k.bookedDates.some((booked) => {
          const bookedStart = new Date(booked.startDate).getTime();
          const bookedEnd = new Date(booked.endDate).getTime();
          return !(end < bookedStart || start > bookedEnd);
        });
        return !hasConflict;
      });
    }

    // Filter by price range
    filtered = filtered.filter(
      (k) => k.price >= filters.priceRange.min && k.price <= filters.priceRange.max
    );

    set({ filteredKebayas: filtered });
  },

  toggleDetailModal: () => set((state) => ({ isDetailModalOpen: !state.isDetailModalOpen })),

  addKebaya: (kebaya) =>
    set((state) => {
      const newKebayas = [...state.kebayas, kebaya];
      return { kebayas: newKebayas, filteredKebayas: newKebayas };
    }),

  updateKebaya: (id, updates) =>
    set((state) => {
      const newKebayas = state.kebayas.map((k) =>
        k.id === id ? { ...k, ...updates, updatedAt: new Date().toISOString() } : k
      );
      return { kebayas: newKebayas, filteredKebayas: newKebayas };
    }),

  deleteKebaya: (id) =>
    set((state) => {
      const newKebayas = state.kebayas.filter((k) => k.id !== id);
      return { kebayas: newKebayas, filteredKebayas: newKebayas };
    }),

  addBookedDate: (kebayaId, bookedDate) =>
    set((state) => {
      const newKebayas = state.kebayas.map((k) =>
        k.id === kebayaId
          ? {
              ...k,
              bookedDates: [...k.bookedDates, bookedDate],
              status: 'booked' as const,
              updatedAt: new Date().toISOString(),
            }
          : k
      );
      return { kebayas: newKebayas, filteredKebayas: newKebayas };
    }),
}));
