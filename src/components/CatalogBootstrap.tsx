'use client';

import { useEffect } from 'react';
import { useKebayaStore } from '@/store/useKebayaStore';
import type { KebayaItem, BookingSchedule } from '@/types/kebaya';
import type { Kebaya } from '@/types';

interface CatalogBootstrapProps {
  items: KebayaItem[];
  bookings: BookingSchedule[];
}

/**
 * Bridges server-fetched Google Sheets data into the client Zustand store.
 * Renders nothing.
 */
export function CatalogBootstrap({ items, bookings }: CatalogBootstrapProps) {
  const setKebayas = useKebayaStore((state) => state.setKebayas);
  const setBookings = useKebayaStore((state) => state.setBookings);

  useEffect(() => {
    const mapped: Kebaya[] = items.map((item) => {
      const itemBookings = bookings.filter(
        (b) => b.kebayaCode.trim().toUpperCase() === item.code.trim().toUpperCase()
      );

      const images = [
        { id: `${item.code}-main`, url: item.mainImage, type: 'full' as const, alt: item.name },
        ...item.detailImages.map((url, index) => ({
          id: `${item.code}-detail-${index + 1}`,
          url,
          type: 'close-up' as const,
          alt: `${item.name} detail ${index + 1}`,
        })),
      ];

      return {
        id: item.id,
        name: item.name,
        description: item.description,
        price: item.price,
        size: item.maxLD,
        color: item.color,
        status: item.status === 'Tersedia' ? 'available' : 'booked',
        featured: Boolean(item.featured),
        tags: item.includes
          ? item.includes.split(',').map((t) => t.trim()).filter(Boolean)
          : [],
        images,
        bookedDates: itemBookings.map((b) => ({
          startDate: b.startDate,
          endDate: b.endDate,
          customerName: b.renterName || '',
        })),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        // Extra sheet metadata consumed by the detail modal
        ...({
          code: item.code,
          maxLD: item.maxLD,
          includes: item.includes,
          mainImage: item.mainImage,
          detailImages: item.detailImages,
          sheetStatus: item.status,
        } as Record<string, unknown>),
      } as Kebaya;
    });

    setKebayas(mapped);
    setBookings(bookings);
  }, [items, bookings, setKebayas, setBookings]);

  return null;
}
