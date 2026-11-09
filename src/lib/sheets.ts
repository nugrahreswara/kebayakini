import Papa from 'papaparse';

/**
 * Google Sheets CSV Parser with ISR & Resilience
 * Fetches real-time data from three sheets:
 *   - Katalog      (inventory)
 *   - Jadwal_Sewa  (booking schedule)
 *   - Testimoni    (customer reviews)
 *
 * Real header names (case-insensitive, normalized to lowercase):
 *   Katalog      : Kode_Kebaya, Nama_Kebaya, Harga_Sewa, Ukuran_LD, Warna,
 *                  Kelengkapan, Deskripsi, Status_Default, Foto_Utama,
 *                  Foto_Detail_1, Foto_Detail_2
 *   Jadwal_Sewa  : Kode_Kebaya, Tanggal_Mulai, Tanggal_Selesai, Status, Catatan
 *   Testimoni    : Nama, Acara, Ulasan, Rating, Foto_Pelanggan, Tanggal
 */

const SHEET_ID = '1P06guaQRHlOuaA39q0NVjrcPC9yJOziqWRQRpPQk1lQ';

const KATALOG_URL =
  process.env.SHEET_KATALOG_URL ||
  `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=Katalog`;

const JADWAL_URL =
  process.env.SHEET_JADWAL_URL ||
  `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=Jadwal_Sewa`;

const TESTIMONI_URL =
  process.env.SHEET_TESTIMONI_URL ||
  `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=Testimoni`;

const REVALIDATE_SECONDS = Number(process.env.SHEET_REVALIDATE_SECONDS || 60);

export interface KebayaRow {
  kode_kebaya: string;
  nama_kebaya: string;
  harga_sewa: string;
  ukuran_ld: string;
  warna: string;
  kelengkapan: string;
  deskripsi: string;
  status_default: string;
  foto_utama: string;
  foto_detail_1: string;
  foto_detail_2: string;
}

export interface BookingRow {
  kode_kebaya: string;
  tanggal_mulai: string;
  tanggal_selesai: string;
  status: string;
  catatan: string;
}

export interface TestimoniRow {
  /** Real header: `Nama`. Legacy alias: `Nama_Pelanggan`. */
  nama?: string;
  nama_pelanggan?: string;
  /** Event context, e.g. "Wisuda". */
  acara?: string;
  /** Real header: `Ulasan`. Legacy alias: `Komentar`. */
  ulasan?: string;
  komentar?: string;
  /** Numeric rating 1-5. */
  rating?: string;
  /** Real header: `Foto_Pelanggan` (Google Drive share or direct URL). */
  foto_pelanggan?: string;
  /** Free-form date, e.g. "15 Okt 2026". */
  tanggal?: string;
}

/* -------------------------------------------------------------------------- */
/*                        Google Drive URL normalization                      */
/* -------------------------------------------------------------------------- */

const DRIVE_HOST_RE =
  /(^|\.)(drive\.google\.com|docs\.google\.com|drive\.usercontent\.google\.com|googleusercontent\.com)$/i;

/**
 * All supported Google Drive share formats:
 *   /file/d/FILE_ID/view
 *   /file/d/FILE_ID/edit?usp=sharing
 *   ?id=FILE_ID
 *   /open?id=FILE_ID
 *   /uc?export=view&id=FILE_ID
 *   /uc?id=FILE_ID&export=download
 *   /thumbnail?id=FILE_ID&sz=w1600
 *   https://lh3.googleusercontent.com/d/FILE_ID
 */
const DRIVE_ID_PATTERNS: RegExp[] = [
  /\/file\/d\/([a-zA-Z0-9_-]+)/i,
  /\/thumbnail\?[^#]*\bid=([a-zA-Z0-9_-]+)/i,
  /\/open\?[^#]*\bid=([a-zA-Z0-9_-]+)/i,
  /[?&]id=([a-zA-Z0-9_-]+)/i,
  /\/d\/([a-zA-Z0-9_-]+)/i,
];

/** Returns true when a string points at Google Drive or a Google image CDN. */
export function isGoogleDriveImageUrl(url: string): boolean {
  if (!url || typeof url !== 'string') return false;

  try {
    const parsed = new URL(url.trim());
    return DRIVE_HOST_RE.test(parsed.hostname);
  } catch {
    return false;
  }
}

/** Extracts a Drive file id from any supported URL shape. */
export function extractGoogleDriveFileId(url: string): string | null {
  if (!url || typeof url !== 'string') return null;

  const trimmed = url.trim();
  if (!isGoogleDriveImageUrl(trimmed)) return null;

  for (const pattern of DRIVE_ID_PATTERNS) {
    const match = trimmed.match(pattern);
    if (match?.[1]) return match[1];
  }

  return null;
}

/**
 * Convert any Google Drive share link to a high-resolution direct image URL.
 * Input : https://drive.google.com/file/d/1ABC...XYZ/view?usp=sharing
 * Output: https://lh3.googleusercontent.com/d/1ABC...XYZ
 *
 * Non-Drive URLs (Unsplash, already-direct CDN links, etc.) pass through
 * untouched so we never rewrite a working image.
 */
export function convertGoogleDriveImageUrl(url: string): string {
  if (!url || typeof url !== 'string') return '';

  const trimmed = url.trim().replace(/^["']|["']$/g, '');
  if (!trimmed) return '';

  const fileId = extractGoogleDriveFileId(trimmed);
  if (!fileId) return trimmed;

  return `https://lh3.googleusercontent.com/d/${fileId}`;
}

/* -------------------------------------------------------------------------- */
/*                            Multi-image array splitter                      */
/* -------------------------------------------------------------------------- */

const VALID_IMAGE_SRC_RE = /^(https?:\/\/|data:image\/)/i;

/**
 * Splits a spreadsheet cell that may contain one or many image URLs.
 *
 * Supports comma, newline, semicolon, and pipe separators, as well as
 * whitespace-separated concatenated URLs. Empty cells, labels such as
 * "N/A", and other non-URL values are filtered out.
 */
export function splitImageUrls(value?: string | null): string[] {
  if (!value || typeof value !== 'string') return [];

  const normalized = value
    .replace(/\r\n?/g, '\n')
    // Separate URLs that were pasted back-to-back with whitespace.
    .replace(/\s+(?=https?:\/\/)/gi, '\n');

  const parts = normalized
    .split(/[\n,;|]+/)
    .map((part) => part.trim().replace(/^["']|["']$/g, ''))
    .filter(Boolean)
    .filter((part) => VALID_IMAGE_SRC_RE.test(part));

  return parts
    .map((part) => convertGoogleDriveImageUrl(part))
    .filter((part) => Boolean(part) && VALID_IMAGE_SRC_RE.test(part));
}

/** Collects + deduplicates every detail photo from the detail columns. */
export function getDetailImageUrls(row: KebayaRow): string[] {
  const candidates = [
    ...splitImageUrls(row.foto_detail_1 || ''),
    ...splitImageUrls(row.foto_detail_2 || ''),
    ...splitImageUrls((row as unknown as Record<string, string>).foto_detail || ''),
  ];

  return Array.from(new Set(candidates));
}

/**
 * Main image first, then all angle/detail photos, deduplicated.
 * Used by the detail-modal gallery.
 */
export function getAllImageUrls(row: Partial<KebayaRow>): string[] {
  const main = splitImageUrls(row.foto_utama || '');
  const detail = [
    ...splitImageUrls(row.foto_detail_1 || ''),
    ...splitImageUrls(row.foto_detail_2 || ''),
    ...splitImageUrls((row as unknown as Record<string, string>).foto_detail || ''),
  ];

  return Array.from(new Set([...main, ...detail]));
}

/* -------------------------------------------------------------------------- */
/*                                  CSV parsing                               */
/* -------------------------------------------------------------------------- */

/**
 * Parse CSV text into typed rows.
 * Headers are trimmed + lowercased so "Kode_Kebaya" becomes "kode_kebaya".
 */
function parseCSV<T>(csvText: string): Promise<T[]> {
  return new Promise((resolve, reject) => {
    Papa.parse<T>(csvText, {
      header: true,
      dynamicTyping: false,
      skipEmptyLines: true,
      transformHeader: (header) => header.trim().toLowerCase(),
      complete: (results) => {
        resolve(results.data);
      },
      error: (error: any) => {
        reject(new Error(`CSV Parse Error: ${error.message}`));
      },
    });
  });
}

async function fetchSheet<T>(url: string, label: string): Promise<T[]> {
  try {
    console.log(`[Sheets] Fetching ${label}...`);

    const response = await fetch(url, {
      next: { revalidate: REVALIDATE_SECONDS },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const csvText = await response.text();
    if (!csvText || csvText.length < 10) {
      throw new Error('Empty or invalid CSV response');
    }

    const rows = await parseCSV<T>(csvText);
    console.log(`✓ ${label}: Loaded ${rows.length} rows`);
    return rows;
  } catch (error) {
    console.error(`✗ ${label} fetch failed:`, error);
    return [];
  }
}

export async function fetchKatalogSheet(): Promise<KebayaRow[]> {
  return fetchSheet<KebayaRow>(KATALOG_URL, 'Katalog');
}

export async function fetchJadwalSewaSheet(): Promise<BookingRow[]> {
  return fetchSheet<BookingRow>(JADWAL_URL, 'Jadwal_Sewa');
}

export async function fetchTestimoniSheet(): Promise<TestimoniRow[]> {
  return fetchSheet<TestimoniRow>(TESTIMONI_URL, 'Testimoni');
}

/**
 * Canonical alias used by the server page:
 *   fetchTestimonials() -> rows from the `Testimoni` tab.
 */
export async function fetchTestimonials(): Promise<TestimoniRow[]> {
  return fetchTestimoniSheet();
}

export async function fetchAllSheets(): Promise<{
  katalog: KebayaRow[];
  jadwal: BookingRow[];
  testimoni: TestimoniRow[];
}> {
  const [katalog, jadwal, testimoni] = await Promise.all([
    fetchKatalogSheet(),
    fetchJadwalSewaSheet(),
    fetchTestimoniSheet(),
  ]);

  return { katalog, jadwal, testimoni };
}

/* -------------------------------------------------------------------------- */
/*                              Row normalization                             */
/* -------------------------------------------------------------------------- */

/**
 * Clean + normalize a raw Katalog row.
 * Supports real headers (`Ukuran_LD`, `Foto_Detail_1/2`) and legacy
 * lowercase variants (`max_ld`, `foto_detail`).
 */
export function cleanKebayaRow(row: Partial<KebayaRow> & Record<string, any>): KebayaRow {
  const detailLegacy = row.foto_detail ? String(row.foto_detail) : '';

  return {
    kode_kebaya: String(row.kode_kebaya || '').trim(),
    nama_kebaya: String(row.nama_kebaya || 'Untitled').trim(),
    harga_sewa: String(row.harga_sewa || '0').trim(),
    ukuran_ld: String(row.ukuran_ld || row.max_ld || 'M').trim(),
    warna: String(row.warna || '').trim(),
    kelengkapan: String(row.kelengkapan || '').trim(),
    deskripsi: String(row.deskripsi || '').trim(),
    status_default: String(row.status_default || 'Tersedia').trim(),
    foto_utama: convertGoogleDriveImageUrl(String(row.foto_utama || '')),
    foto_detail_1: String(row.foto_detail_1 || detailLegacy).trim(),
    foto_detail_2: String(row.foto_detail_2 || '').trim(),
  };
}

/* -------------------------------------------------------------------------- */
/*                          Testimoni row normalization                       */
/* -------------------------------------------------------------------------- */

const INDONESIAN_MONTHS: Record<string, number> = {
  jan: 1,
  januari: 1,
  feb: 2,
  februari: 2,
  mar: 3,
  maret: 3,
  apr: 4,
  april: 4,
  mei: 5,
  may: 5,
  jun: 6,
  juni: 6,
  jul: 7,
  juli: 7,
  agu: 8,
  agt: 8,
  agustus: 8,
  aug: 8,
  sep: 9,
  sept: 9,
  september: 9,
  okt: 10,
  oktober: 10,
  oct: 10,
  nov: 11,
  november: 11,
  des: 12,
  desember: 12,
  dec: 12,
};

function toIsoDate(year: number, month: number, day: number): string | null {
  if (
    !Number.isInteger(year) ||
    !Number.isInteger(month) ||
    !Number.isInteger(day) ||
    month < 1 ||
    month > 12 ||
    day < 1 ||
    day > 31
  ) {
    return null;
  }

  const date = new Date(Date.UTC(year, month - 1, day));
  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    return null;
  }

  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

/**
 * Normalize the free-form dates used in the Testimoni sheet into ISO
 * (`YYYY-MM-DD`) so `new Date(...)` never produces "Invalid Date".
 *
 * Supported inputs:
 *   "2026-10-15", "15 Okt 2026", "15 Oktober 2026",
 *   "15/10/2026", "15-10-2026", "Oct 15, 2026"
 */
export function normalizeTestimonialDate(value?: string): string {
  const raw = String(value || '').trim();
  if (!raw) return '';

  // Already ISO (possibly with a time component).
  const iso = raw.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (iso) {
    return toIsoDate(Number(iso[1]), Number(iso[2]), Number(iso[3])) || raw;
  }

  // "15 Okt 2026" / "15 Oktober 2026"
  const dayMonthYear = raw.match(/^(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})$/);
  if (dayMonthYear) {
    const month = INDONESIAN_MONTHS[dayMonthYear[2].toLowerCase()];
    const normalized = toIsoDate(
      Number(dayMonthYear[3]),
      month || 0,
      Number(dayMonthYear[1])
    );
    if (normalized) return normalized;
  }

  // "Oct 15, 2026"
  const monthDayYear = raw.match(/^([A-Za-z]+)\s+(\d{1,2}),?\s+(\d{4})$/);
  if (monthDayYear) {
    const month = INDONESIAN_MONTHS[monthDayYear[1].toLowerCase()];
    const normalized = toIsoDate(
      Number(monthDayYear[3]),
      month || 0,
      Number(monthDayYear[2])
    );
    if (normalized) return normalized;
  }

  // "15/10/2026" / "15-10-2026"
  const numeric = raw.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/);
  if (numeric) {
    return toIsoDate(Number(numeric[3]), Number(numeric[2]), Number(numeric[1])) || raw;
  }

  // Last resort: let the runtime try, otherwise keep the original text.
  const parsed = new Date(raw);
  return Number.isNaN(parsed.getTime()) ? raw : parsed.toISOString().split('T')[0];
}

/**
 * Clean a raw Testimoni row, mapping both the real headers
 * (`Nama` / `Ulasan`) and legacy aliases (`Nama_Pelanggan` / `Komentar`)
 * onto one canonical shape.
 */
export function cleanTestimoniRow(
  row: Partial<TestimoniRow> & Record<string, any>
): Required<
  Pick<
    TestimoniRow,
    'nama_pelanggan' | 'acara' | 'komentar' | 'rating' | 'foto_pelanggan' | 'tanggal'
  >
> {
  const rawRating = parseInt(String(row.rating ?? '5'), 10);
  const rating = Number.isNaN(rawRating) ? 5 : Math.min(Math.max(rawRating, 1), 5);

  return {
    nama_pelanggan: String(row.nama ?? row.nama_pelanggan ?? '').trim(),
    acara: String(row.acara ?? '').trim(),
    komentar: String(row.ulasan ?? row.komentar ?? '').trim(),
    rating: String(rating),
    foto_pelanggan: convertGoogleDriveImageUrl(
      String(row.foto_pelanggan ?? '').trim()
    ),
    tanggal: normalizeTestimonialDate(String(row.tanggal ?? '')),
  };
}

/* -------------------------------------------------------------------------- */
/*                               Availability                                 */
/* -------------------------------------------------------------------------- */

/**
 * Booked date ranges for a kebaya code (raw BookingRow sheet data).
 */
export function getBookedDatesForKebaya(
  kebayaCode: string,
  jadwalRows: BookingRow[]
): { start: string; end: string }[] {
  const code = kebayaCode.trim().toUpperCase();

  return jadwalRows
    .filter((row) => String(row.kode_kebaya || '').trim().toUpperCase() === code)
    .map((row) => ({
      start: String(row.tanggal_mulai || (row as any).tgl_mulai || '').trim(),
      end: String(row.tanggal_selesai || (row as any).tgl_selesai || '').trim(),
    }))
    .filter((range) => range.start && range.end);
}

/**
 * Booked date ranges for a kebaya code (normalized BookingSchedule data).
 */
export function getBookedDatesForKebayaFromSchedule(
  kebayaCode: string,
  schedules: { kebayaCode: string; startDate: string; endDate: string }[]
): { start: string; end: string }[] {
  const code = kebayaCode.trim().toUpperCase();

  return schedules
    .filter((s) => String(s.kebayaCode || '').trim().toUpperCase() === code)
    .map((s) => ({
      start: s.startDate || '',
      end: s.endDate || '',
    }))
    .filter((range) => range.start && range.end);
}

/**
 * Availability check. Booked ranges are inclusive on both ends.
 */
export function isKebayaAvailableOnDate(
  date: Date,
  bookedDates: { start: string; end: string }[]
): boolean {
  const check = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();

  return !bookedDates.some((booking) => {
    if (!booking.start || !booking.end) return false;

    const start = new Date(`${booking.start}T00:00:00`).getTime();
    const end = new Date(`${booking.end}T23:59:59`).getTime();

    return check >= start && check <= end;
  });
}
