import { Suspense } from 'react';
import Navigation from '@/components/Navigation';
import HeroSection from '@/components/HeroSection';
import CatalogSection from '@/components/CatalogSection';
import HowItWorksSection from '@/components/HowItWorksSection';
import Testimonials from '@/components/Testimonials';
import Footer from '@/components/Footer';
import { CatalogBootstrap } from '@/components/CatalogBootstrap';
import {
  fetchAllSheets,
  cleanKebayaRow,
  cleanTestimoniRow,
  getDetailImageUrls,
  getBookedDatesForKebaya,
} from '@/lib/sheets';
import { mockKebayaItems, mockBookings, mockTestimonials } from '@/data/mockKebaya';
import type { KebayaItem, BookingSchedule, CatalogData } from '@/types/kebaya';
import type { Testimonial } from '@/types';

/**
 * Kebaya Kini Homepage
 * Server-side fetching from Google Sheets (headless CMS) with ISR.
 * Revalidates every 60 seconds; falls back to local mock data on failure.
 */
export const revalidate = 60;

function transformKebayaRow(row: any): KebayaItem | null {
  try {
    const cleaned = cleanKebayaRow(row);

    if (!cleaned.kode_kebaya || !cleaned.nama_kebaya) return null;

    const price = parseInt(cleaned.harga_sewa.replace(/[^0-9]/g, ''), 10);
    if (isNaN(price)) {
      console.warn(`Invalid price for ${cleaned.kode_kebaya}: ${cleaned.harga_sewa}`);
      return null;
    }

    const statusMap: Record<string, 'Tersedia' | 'Disewa' | 'Maintenance'> = {
      TERSEDIA: 'Tersedia',
      DISEWA: 'Disewa',
      MAINTENANCE: 'Maintenance',
    };

    return {
      id: cleaned.kode_kebaya.toLowerCase().replace(/\s+/g, '-'),
      code: cleaned.kode_kebaya,
      name: cleaned.nama_kebaya,
      price,
      maxLD: cleaned.ukuran_ld,
      color: cleaned.warna,
      includes: cleaned.kelengkapan,
      description: cleaned.deskripsi,
      status: statusMap[cleaned.status_default.toUpperCase()] || 'Tersedia',
      mainImage: cleaned.foto_utama,
      detailImages: getDetailImageUrls(cleaned),
    };
  } catch (error) {
    console.error('Error transforming kebaya row:', error);
    return null;
  }
}

function transformBookingRow(row: any): BookingSchedule | null {
  try {
    const code = String(row.kode_kebaya || '').trim();
    const start = String(row.tanggal_mulai || row.tgl_mulai || '').trim();
    const end = String(row.tanggal_selesai || row.tgl_selesai || '').trim();

    if (!code || !start || !end) return null;

    return {
      kebayaCode: code.toUpperCase(),
      startDate: start,
      endDate: end,
      status: String(row.status || '').toLowerCase() === 'completed' ? 'Completed' : 'Booked',
      renterName: String(row.catatan || row.nama_penyewa || '').trim() || undefined,
    };
  } catch (error) {
    console.error('Error transforming booking row:', error);
    return null;
  }
}

function transformTestimoniRow(row: any, index: number): Testimonial | null {
  try {
    // Real headers: Nama, Acara, Ulasan, Rating, Foto_Pelanggan, Tanggal
    const clean = cleanTestimoniRow(row);
    const name = clean.nama_pelanggan;
    const comment = clean.komentar;

    if (!name || !comment) return null;

    const rating = parseInt(clean.rating, 10);
    const validRating = isNaN(rating) ? 5 : Math.min(Math.max(rating, 1), 5);

    return {
      id: `testimoni-${index + 1}`,
      customerName: name,
      event: clean.acara || 'Acara Spesial',
      rating: validRating,
      comment,
      image: clean.foto_pelanggan,
      date: clean.tanggal || new Date().toISOString().split('T')[0],
    };
  } catch (error) {
    console.error('Error transforming testimoni row:', error);
    return null;
  }
}

function calculateTestimonialStats(testimonials: Testimonial[]) {
  const totalReviews = testimonials.length;
  const averageRating =
    totalReviews > 0
      ? testimonials.reduce((sum, item) => sum + item.rating, 0) / totalReviews
      : 5.0;

  return { totalReviews, averageRating };
}

async function getCatalogData(): Promise<
  CatalogData & { 
    testimonials: Testimonial[]; 
    averageRating: number; 
    totalReviews: number; 
  }
> {
  const startTime = Date.now();

  try {
    const { katalog, jadwal, testimoni } = await fetchAllSheets();

    const kebayaItems = katalog
      .map(transformKebayaRow)
      .filter((item): item is KebayaItem => item !== null);

    const bookings = jadwal
      .map(transformBookingRow)
      .filter((booking): booking is BookingSchedule => booking !== null);

    const parsedTestimonials = testimoni
      .map(transformTestimoniRow)
      .filter((testimonial): testimonial is Testimonial => testimonial !== null);

    // The section must never render legacy hardcoded reviews. If the live
    // sheet returns no valid rows, use the two official fallback entries.
    const testimonials =
      parsedTestimonials.length > 0 ? parsedTestimonials : mockTestimonials;

    const { totalReviews, averageRating } = calculateTestimonialStats(testimonials);

    console.log(
      `✓ Catalog loaded in ${Date.now() - startTime}ms: ${kebayaItems.length} items, ${bookings.length} bookings, ${testimonials.length} testimonials (avg rating: ${averageRating.toFixed(1)})`
    );

    if (kebayaItems.length === 0) {
      throw new Error('No valid kebaya items loaded from sheets');
    }

    // Derive live availability from Jadwal_Sewa (Sheet 2)
    const withAvailability = kebayaItems.map((item) => {
      const ranges = getBookedDatesForKebaya(item.code, jadwal);
      const isCurrentlyBooked = ranges.some((range) => {
        const today = new Date().toISOString().split('T')[0];
        return today >= range.start && today <= range.end;
      });

      return {
        ...item,
        status: item.status === 'Maintenance'
          ? 'Maintenance'
          : isCurrentlyBooked
          ? 'Disewa'
          : item.status,
      } as KebayaItem;
    });

    return {
      kebaya: withAvailability,
      bookings,
      testimonials,
      averageRating,
      totalReviews,
      lastUpdated: new Date().toISOString(),
      source: 'live',
    };
  } catch (error) {
    console.error('Failed to load from Google Sheets, using mock data:', error);

    const { totalReviews, averageRating } = calculateTestimonialStats(mockTestimonials);

    return {
      kebaya: mockKebayaItems,
      bookings: mockBookings,
      testimonials: mockTestimonials,
      averageRating,
      totalReviews,
      lastUpdated: new Date().toISOString(),
      source: 'mock',
    };
  }
}

function CatalogLoading() {
  return (
    <section id="katalog" className="relative py-20 sm:py-28 bg-warm-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="h-8 bg-gray-200 rounded animate-pulse max-w-2xl mx-auto mb-4" />
          <div className="h-4 bg-gray-200 rounded animate-pulse max-w-md mx-auto" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white rounded-lg shadow animate-pulse h-96" />
          ))}
        </div>
      </div>
    </section>
  );
}

export default async function Home() {
  const catalogData = await getCatalogData();

  return (
    <main className="relative min-h-screen bg-warm-white overflow-x-hidden">
      <CatalogBootstrap items={catalogData.kebaya} bookings={catalogData.bookings} />
      <Navigation />
      <HeroSection />

      <Suspense fallback={<CatalogLoading />}>
        <CatalogSection />
      </Suspense>

      <HowItWorksSection />
      <Testimonials
        testimonials={catalogData.testimonials}
        averageRating={catalogData.averageRating}
        totalReviews={catalogData.totalReviews}
      />
      <Footer />
    </main>
  );
}
