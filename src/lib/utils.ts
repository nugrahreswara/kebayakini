import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(price);
}

export function formatDate(date: string): string {
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(date));
}

export function generateWhatsAppLink(kebayaName: string, dates?: { start: Date; end: Date }): string {
  const phone = '6281234567890'; // Replace with actual WhatsApp number
  let message = `Halo, saya tertarik untuk menyewa ${kebayaName}`;
  
  if (dates) {
    const startDate = formatDate(dates.start.toISOString());
    const endDate = formatDate(dates.end.toISOString());
    message += ` untuk tanggal ${startDate} - ${endDate}`;
  }
  
  message += '. Mohon informasi lebih lanjut. Terima kasih.';
  
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

export function isDateAvailable(bookedDates: { startDate: string; endDate: string }[], checkDate: Date): boolean {
  const checkTime = checkDate.getTime();
  
  return !bookedDates.some((booked) => {
    const start = new Date(booked.startDate).getTime();
    const end = new Date(booked.endDate).getTime();
    return checkTime >= start && checkTime <= end;
  });
}
