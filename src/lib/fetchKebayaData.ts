import Papa from 'papaparse';

export interface KebayaItem {
  id: string;
  kode_kebaya: string;
  nama_kebaya: string;
  harga_sewa: number;
  lingkar_dada: string;
  kelengkapan: string;
  status_utama: 'available' | 'booked';
  tanggal_tersewa: string[];
  foto_utama: string;
  foto_detail: string[];
  kategori_tags: string[];
}

/**
 * Convert Google Drive link to direct image URL
 * Input:  https://drive.google.com/file/d/FILE_ID/view
 * Output: https://lh3.googleusercontent.com/d/FILE_ID
 */
export function convertGoogleDriveLink(url: string): string {
  if (!url || typeof url !== 'string') return '';
  
  const fileIdMatch = url.match(/\/d\/([a-zA-Z0-9-_]+)/);
  if (!fileIdMatch) return url;
  
  return `https://lh3.googleusercontent.com/d/${fileIdMatch[1]}`;
}

/**
 * Fetch Kebaya data from Google Sheets via CSV export
 * Revalidates every 60 seconds (ISR)
 */
export async function fetchKebayaDataFromSheets(): Promise<KebayaItem[]> {
  const SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/1P06guaQRHlOuaA39q0NVjrcPC9yJOziqWRQRpPQk1lQ/gviz/tq?tqx=out:csv&sheet=Sheet1';
  
  try {
    const response = await fetch(SHEET_CSV_URL, {
      next: { revalidate: 60 }, // ISR: revalidate every 60 seconds
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch from Google Sheets: ${response.statusText}`);
    }

    const csvText = await response.text();
    
    return new Promise((resolve, reject) => {
      Papa.parse(csvText, {
        header: true,
        dynamicTyping: false,
        skipEmptyLines: true,
        complete: (results: any) => {
          try {
            const kebayaItems: KebayaItem[] = results.data
              .filter((row: any) => row.kode_kebaya && row.kode_kebaya.trim())
              .map((row: any, index: number) => ({
                id: row.kode_kebaya || `kebaya-${index}`,
                kode_kebaya: row.kode_kebaya?.trim() || '',
                nama_kebaya: row.nama_kebaya?.trim() || 'Untitled',
                harga_sewa: parseInt(row.harga_sewa) || 0,
                lingkar_dada: row.lingkar_dada?.trim() || 'M',
                kelengkapan: row.kelengkapan?.trim() || '',
                status_utama: row.status_utama?.toLowerCase() === 'booked' ? 'booked' : 'available',
                tanggal_tersewa: row.tanggal_tersewa
                  ? row.tanggal_tersewa
                      .split(',')
                      .map((d: string) => d.trim())
                      .filter((d: string) => d)
                  : [],
                foto_utama: convertGoogleDriveLink(row.foto_utama?.trim() || ''),
                foto_detail: row.foto_detail
                  ? row.foto_detail
                      .split(',')
                      .map((url: string) => convertGoogleDriveLink(url.trim()))
                      .filter((url: string) => url)
                  : [],
                kategori_tags: row.kategori_tags
                  ? row.kategori_tags
                      .split(',')
                      .map((tag: string) => tag.trim())
                      .filter((tag: string) => tag)
                  : [],
              }));

            resolve(kebayaItems);
          } catch (err) {
            reject(err);
          }
        },
        error: (error: any) => {
          reject(new Error(`PapaParse error: ${error.message}`));
        },
      });
    });
  } catch (error) {
    console.error('Error fetching Kebaya data from Google Sheets:', error);
    throw error;
  }
}

/**
 * Mock fallback data if Google Sheets fetch fails
 */
export const mockKebayaData: KebayaItem[] = [
  {
    id: 'kb-001',
    kode_kebaya: 'KB-001',
    nama_kebaya: 'Kebaya Brokat Champagne',
    harga_sewa: 350000,
    lingkar_dada: 'M',
    kelengkapan: 'Kain, Manset, Ikat Pinggang',
    status_utama: 'available',
    tanggal_tersewa: [],
    foto_utama: 'https://images.unsplash.com/photo-1617019114583-affb34d1b3cd?w=800&q=80',
    foto_detail: [
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=80',
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&q=80',
    ],
    kategori_tags: ['brokat', 'premium', 'pernikahan'],
  },
  {
    id: 'kb-002',
    kode_kebaya: 'KB-002',
    nama_kebaya: 'Kebaya Modern Rose Gold',
    harga_sewa: 400000,
    lingkar_dada: 'L',
    kelengkapan: 'Kain, Manset, Ikat Pinggang',
    status_utama: 'booked',
    tanggal_tersewa: ['2026-11-15', '2026-11-16', '2026-11-17'],
    foto_utama: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&q=80',
    foto_detail: ['https://images.unsplash.com/photo-1617019114583-affb34d1b3cd?w=800&q=80'],
    kategori_tags: ['modern', 'elegant', 'formal'],
  },
];
