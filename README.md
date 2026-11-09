# Kebayaku - Luxury Kebaya Rental Platform

![Kebayaku Banner](https://images.unsplash.com/photo-1617019114583-affb34d1b3cd?w=1200&q=80)

A premium kebaya rental web application built with Next.js 14, featuring interactive 3D animations, smooth scrolling, and a comprehensive admin panel for managing inventory and bookings.

## ✨ Features

### 🎨 Frontend Features
- **3D Interactive Hero**: React Three Fiber particle system with mouse-responsive animations
- **Smooth Scrolling**: Lenis smooth scroll integration for seamless navigation
- **Auto-Play Carousel**: Full-screen hero carousel with status badges and direct WhatsApp booking
- **Advanced Filtering**: Filter by size, color, price range, and availability dates
- **Interactive Calendar**: Visual availability calendar with date range selection
- **Responsive Design**: Fully responsive from 320px (smartwatch) to 4K displays
- **Glassmorphism UI**: Modern glass-morphic navigation with backdrop blur effects
- **Framer Motion Animations**: Smooth page transitions and micro-interactions
- **GSAP Scroll Triggers**: Scroll-triggered animations for engaging user experience

### 🛠️ Admin Panel Features
- **Full CRUD Operations**: Add, edit, and delete kebaya items
- **Multi-Image Management**: Upload multiple images with type tagging (full, close-up, sleeve, back, bottom)
- **Date Booking System**: Manually block off booked dates with customer information
- **Status Management**: Toggle between available/booked status
- **Featured Items**: Mark premium items for hero carousel display
- **Tag Management**: Add custom tags and categories
- **Real-time Updates**: Zustand state management for instant UI updates

### 🎯 User Experience
- **4-Step Rental Process**: Clear visual guide for the rental journey
- **Testimonial Carousel**: Showcase customer reviews with auto-rotation
- **WhatsApp Integration**: Direct booking via WhatsApp with pre-filled messages
- **Google Maps Integration**: Embedded map for store location
- **Mobile-First Design**: Optimized for all device sizes
- **Accessibility**: Semantic HTML and ARIA labels

## 🚀 Tech Stack

### Core Framework
- **Next.js 14+** - App Router with React Server Components
- **TypeScript** - Type-safe development
- **React 18.3+** - Latest React features

### Styling & UI
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide Icons** - Beautiful, consistent icon set
- **Custom Design System** - Rose Gold, Champagne Gold, Warm White theme

### 3D & Animations
- **React Three Fiber** - React renderer for Three.js
- **@react-three/drei** - Useful helpers for R3F
- **GSAP** - Professional-grade animation library
- **Framer Motion** - Production-ready motion library
- **Lenis** - Smooth scroll library

### State Management
- **Zustand** - Lightweight state management

### Utilities
- **date-fns** - Modern date utility library
- **clsx & tailwind-merge** - Conditional class utilities

### DevOps
- **Docker** - Multi-stage production builds
- **Docker Compose** - Container orchestration

## 📦 Installation

### Prerequisites
- Node.js 18+ and npm 9+
- Git

### Local Development

1. **Clone the repository**
```bash
git clone <repository-url>
cd kebayaku
```

2. **Install dependencies**
```bash
npm install
```

3. **Run development server**
```bash
npm run dev
```

4. **Open browser**
```
http://localhost:3000
```

## 🐳 Docker Deployment

### Build and Run with Docker Compose

1. **Build the image**
```bash
docker-compose build
```

2. **Start the container**
```bash
docker-compose up -d
```

3. **Access the application**
```
http://localhost:3000
```

4. **View logs**
```bash
docker-compose logs -f
```

5. **Stop the container**
```bash
docker-compose down
```

### Manual Docker Build

```bash
# Build the image
docker build -t kebayaku-app .

# Run the container
docker run -d -p 3000:3000 --name kebayaku kebayaku-app

# View logs
docker logs -f kebayaku

# Stop and remove
docker stop kebayaku
docker rm kebayaku
```

## 🗂️ Project Structure

```
kebayaku/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── health/
│   │   │       └── route.ts          # Health check endpoint
│   │   ├── globals.css               # Global styles
│   │   ├── layout.tsx                # Root layout
│   │   └── page.tsx                  # Home page
│   ├── components/
│   │   ├── 3d/
│   │   │   └── FabricParticles.tsx   # 3D particle system
│   │   ├── AdminPanel.tsx            # Admin CRUD interface
│   │   ├── AvailabilityCalendar.tsx  # Interactive date calendar
│   │   ├── CatalogSection.tsx        # Catalog grid with filters
│   │   ├── FilterBar.tsx             # Advanced filter controls
│   │   ├── Footer.tsx                # Footer with contact info
│   │   ├── HeroCarousel.tsx          # Auto-play carousel
│   │   ├── HeroSection.tsx           # Hero with 3D background
│   │   ├── HowItWorksSection.tsx     # 4-step process guide
│   │   ├── KebayaCard.tsx            # Individual kebaya card
│   │   ├── KebayaDetailModal.tsx     # Detail modal with gallery
│   │   ├── Navigation.tsx            # Fixed glassmorphism nav
│   │   ├── SmoothScroll.tsx          # Lenis scroll wrapper
│   │   └── TestimonialsSection.tsx   # Testimonial carousel
│   ├── lib/
│   │   └── utils.ts                  # Utility functions
│   ├── store/
│   │   └── useKebayaStore.ts         # Zustand state management
│   └── types/
│       └── index.ts                  # TypeScript types
├── public/                           # Static assets
├── .dockerignore                     # Docker ignore rules
├── .eslintrc.json                    # ESLint configuration
├── .gitignore                        # Git ignore rules
├── docker-compose.yml                # Docker Compose config
├── Dockerfile                        # Multi-stage Docker build
├── next.config.js                    # Next.js configuration
├── package.json                      # Dependencies
├── postcss.config.js                 # PostCSS configuration
├── tailwind.config.ts                # Tailwind configuration
├── tsconfig.json                     # TypeScript configuration
└── README.md                         # This file
```

## 🎨 Design System

### Color Palette
```css
Rose Gold:       #E0A96D
Champagne Gold:  #D4AF37
Warm White:      #FAF8F5
Deep Navy:       #0F172A
Emerald Green:   #10B981  (Available status)
Amber Orange:    #F59E0B  (Booked status)
```

### Typography
- **Headings**: Playfair Display (Serif)
- **Body**: Inter (Sans-serif)

### Responsive Breakpoints
```
Mobile:      375px - 767px
Tablet:      768px - 1023px
Desktop:     1024px - 1919px
Large:       1920px+
Ultra-Small: 320px (smartwatch support)
```

## 📱 Features Walkthrough

### 1. Hero Section
- Full-screen 100vh height
- 3D interactive particle system background
- Auto-rotating carousel with status badges
- Direct WhatsApp booking CTA
- Animated scroll indicator

### 2. Catalog Section
- Grid layout with responsive columns
- Advanced filter bar (size, color, dates, price)
- Real-time filter results
- Hover effects and animations
- Click to open detail modal

### 3. Detail Modal
- Multi-image gallery with thumbnails
- Image type indicators (full, close-up, sleeve, back)
- Interactive availability calendar
- Date range selection
- Direct WhatsApp booking with selected dates

### 4. Admin Panel
- Slide-in panel from right
- Add new kebaya with full details
- Edit existing items
- Delete with confirmation
- Multi-image upload with type selection
- Tag management
- Date booking management
- Real-time preview

### 5. How It Works
- Visual 4-step process
- GSAP scroll-triggered animations
- Icon-based step indicators
- Additional info cards

### 6. Testimonials
- Auto-rotating carousel
- Customer photos and ratings
- Event type badges
- Manual navigation controls

### 7. Footer
- Comprehensive contact information
- Google Maps integration
- Social media links
- Rental terms and conditions
- Quick navigation links

## 🔧 Configuration

### WhatsApp Number
Update the WhatsApp number in:
- `src/lib/utils.ts` - `generateWhatsAppLink` function
- `src/components/Footer.tsx` - Contact information

### Google Maps
Update the Google Maps embed URL in:
- `src/components/Footer.tsx` - iframe src

### Contact Information
Update contact details in:
- `src/components/Footer.tsx` - contactInfo array

## 📊 Performance Optimizations

- **Image Optimization**: Next.js Image component with proper sizing
- **Code Splitting**: Automatic route-based code splitting
- **Lazy Loading**: React.lazy for non-critical components
- **Font Optimization**: Google Fonts with display=swap
- **Static Generation**: Pre-rendered pages where possible
- **Docker Multi-stage**: Minimal production image size

## 🔐 Security

- **Environment Variables**: Sensitive data in .env files
- **Docker User**: Non-root user in production container
- **Health Checks**: Docker health monitoring
- **Input Validation**: Form validation on all inputs

## 🚧 Future Enhancements

- [ ] Backend API integration (Supabase/Firebase)
- [ ] User authentication system
- [ ] Payment gateway integration
- [ ] Email notifications
- [ ] SMS reminders
- [ ] Advanced analytics dashboard
- [ ] Multi-language support (i18n)
- [ ] PWA support with offline mode
- [ ] Image upload to cloud storage
- [ ] PDF invoice generation
- [ ] Customer portal

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is private and proprietary. All rights reserved.

## 👨‍💻 Developer

**Project Name**: Kebayaku  
**Version**: 1.0.0  
**Build**: Production-ready  
**Last Updated**: October 2026

## 📞 Support

For support and inquiries:
- **Email**: info@kebayaku.com
- **WhatsApp**: +62 812-3456-7890
- **Website**: https://kebayaku.com

---

**Built with ❤️ for elegant moments**
