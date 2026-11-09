export interface KebayaImage {
  id: string;
  url: string;
  type: 'full' | 'close-up' | 'sleeve' | 'bottom' | 'back';
  alt: string;
}

export interface BookedDate {
  startDate: string;
  endDate: string;
  customerName?: string;
}

export interface Kebaya {
  id: string;
  name: string;
  description: string;
  price: number;
  size: 'S' | 'M' | 'L' | 'XL';
  color: string;
  status: 'available' | 'booked';
  images: KebayaImage[];
  bookedDates: BookedDate[];
  featured: boolean;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface FilterOptions {
  size: string[];
  color: string[];
  dateRange: {
    start: Date | null;
    end: Date | null;
  };
  priceRange: {
    min: number;
    max: number;
  };
}

export interface Testimonial {
  id: string;
  customerName: string;
  event: string;
  rating: number;
  comment: string;
  image: string;
  date: string;
}
