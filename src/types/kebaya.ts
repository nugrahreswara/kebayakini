/**
 * Kebaya Kini Data Types
 * Aligned with Google Sheets schema (Katalog & Jadwal_Sewa sheets)
 */

export type KebayaStatus = 'Tersedia' | 'Disewa' | 'Maintenance';

/**
 * Main Kebaya Item (from Katalog sheet)
 */
export interface KebayaItem {
  id: string; // Unique identifier (code-based)
  code: string; // e.g., KB-001 (from kode_kebaya column)
  name: string; // from nama_kebaya
  price: number; // from harga_sewa (in IDR)
  maxLD: string; // Max lingkar dada / chest size (from max_ld)
  color: string; // from warna
  includes: string; // from kelengkapan (what's included)
  description: string; // from deskripsi
  status: KebayaStatus; // from status_default (mapped to enum)
  mainImage: string; // from foto_utama (converted Google Drive URL)
  detailImages: string[]; // from foto_detail (converted URLs)
  featured?: boolean; // For homepage showcase
}

/**
 * Booking Schedule Entry (from Jadwal_Sewa sheet)
 */
export interface BookingSchedule {
  kebayaCode: string; // from kode_kebaya
  startDate: string; // YYYY-MM-DD format (from tgl_mulai)
  endDate: string; // YYYY-MM-DD format (from tgl_selesai)
  status: 'Booked' | 'Pending' | 'Completed'; // from status
  renterName?: string; // from nama_penyewa (optional)
}

/**
 * Date range for availability checking
 */
export interface DateRange {
  start: Date;
  end: Date;
}

/**
 * Availability info for calendar display
 */
export interface AvailabilityInfo {
  date: Date;
  isAvailable: boolean;
  status: 'Tersedia' | 'Disewa' | 'Maintenance';
}

/**
 * Catalog data structure (combined from both sheets)
 */
export interface CatalogData {
  kebaya: KebayaItem[];
  bookings: BookingSchedule[];
  lastUpdated: string; // ISO timestamp
  source: 'live' | 'cached' | 'mock';
}

/**
 * Filter options for catalog search
 */
export interface FilterOptions {
  colors?: string[];
  sizes?: string[];
  priceRange?: {
    min: number;
    max: number;
  };
  status?: KebayaStatus[];
  dateRange?: {
    start: Date;
    end: Date;
  };
}

/**
 * Kebaya card display props
 */
export interface KebayaCardProps {
  kebaya: KebayaItem;
  availableDates?: BookingSchedule[];
  onSelect?: (kebaya: KebayaItem) => void;
}

/**
 * Detail modal props
 */
export interface DetailModalProps {
  kebaya: KebayaItem | null;
  bookings: BookingSchedule[];
  isOpen: boolean;
  onClose: () => void;
}
