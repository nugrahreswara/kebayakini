/**
 * WhatsApp Booking URL Builder for Kebaya Kini
 * Generates pre-filled WhatsApp message links for kebaya rental bookings.
 * 
 * STRICTLY NO EMOJIS OR EMOTICONS IN MESSAGES.
 */

const WHATSAPP_PHONE = '6282156405364';

export interface BookingDetails {
  kebayaName: string;
  kebayaCode?: string;
  price?: number;
  startDate?: string;
  endDate?: string;
  renterName?: string;
}

/**
 * Build WhatsApp booking URL with pre-filled professional message template.
 * All parameters are optional except kebayaName.
 * 
 * @param details - Booking information
 * @returns WhatsApp URL with encoded message
 */
export function buildWhatsAppBookingUrl(details: BookingDetails): string {
  const { kebayaName, kebayaCode, price, startDate, endDate, renterName } = details;

  let message = 'Halo Admin Kebaya Kini, saya ingin mengajukan peminjaman kebaya dengan rincian sebagai berikut:\n\n';
  
  message += `- Nama Penyewa: ${renterName || ''}\n`;
  
  if (kebayaCode) {
    message += `- Kode / Busana: ${kebayaName} (${kebayaCode})\n`;
  } else {
    message += `- Kode / Busana: ${kebayaName}\n`;
  }
  
  if (price) {
    const formattedPrice = new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
    message += `- Harga Sewa: ${formattedPrice}\n`;
  }
  
  if (startDate && endDate) {
    message += `- Rencana Tanggal Sewa: ${startDate} s/d ${endDate}\n`;
  } else if (startDate) {
    message += `- Rencana Tanggal Sewa: ${startDate}\n`;
  }
  
  message += '\nMohon konfirmasi ketersediaan busana serta panduan pembayaran DP. Terima kasih.';

  return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`;
}

/**
 * Quick booking URL for simple cases (just kebaya name).
 */
export function quickWhatsAppUrl(kebayaName: string): string {
  return buildWhatsAppBookingUrl({ kebayaName });
}

/**
 * Format date to Indonesian readable format (DD Month YYYY)
 */
export function formatDateForWhatsApp(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(dateObj);
}
