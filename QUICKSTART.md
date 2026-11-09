# Kebayaku - Quick Start Guide

## 🚀 Quick Start (3 Simple Steps)

### Option 1: Automated Startup (Recommended)
```bash
# Make the script executable (first time only)
chmod +x start.sh

# Run the startup script
./start.sh
```

The script will guide you through:
1. Installing dependencies
2. Running development server
3. Building for production
4. Docker deployment

### Option 2: Manual Commands

**Development:**
```bash
npm install
npm run dev
```
Open http://localhost:3000

**Production:**
```bash
npm install
npm run build
npm run start
```

**Docker:**
```bash
docker-compose up --build -d
```

## 📋 System Requirements

- Node.js 18.0.0 or higher
- npm 9.0.0 or higher
- Docker (optional, for containerized deployment)

## 🎯 First Time Setup

1. **Clone or extract the project**
   ```bash
   cd /sites/umar/kebayaku
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   ```
   http://localhost:3000
   ```

## 🔧 Available Scripts

```bash
npm run dev         # Start development server
npm run build       # Build for production
npm run start       # Start production server
npm run lint        # Run ESLint
npm run type-check  # Run TypeScript type checking
```

## 🐳 Docker Commands

```bash
# Build and start
docker-compose up --build -d

# View logs
docker-compose logs -f

# Stop containers
docker-compose down

# Restart
docker-compose restart
```

## 📱 Accessing the Application

Once started, visit:
- **Local**: http://localhost:3000
- **Network**: http://YOUR_IP:3000 (accessible from other devices on same network)

## 🎨 Key Features to Try

1. **Hero Section**: Scroll to see 3D particle animations
2. **Catalog**: Use filters to find kebaya by size, color, date
3. **Detail Modal**: Click any kebaya card to see full details
4. **Admin Panel**: Click "Panel Admin" button (top right) to manage inventory
5. **WhatsApp**: Click "Pesan Sekarang" to test WhatsApp integration
6. **Calendar**: Select date ranges in the detail modal
7. **Testimonials**: See auto-rotating customer reviews

## 🔐 Admin Panel Access

The admin panel is currently open (no authentication for development).

To add authentication in production:
1. Implement login system
2. Add JWT/session management
3. Protect admin routes
4. Add role-based access control

## ⚠️ Important Notes

- **WhatsApp Number**: Update in `src/lib/utils.ts`
- **Contact Info**: Update in `src/components/Footer.tsx`
- **Google Maps**: Replace embed URL in Footer component
- **Images**: Replace placeholder images with actual kebaya photos

## 🐛 Troubleshooting

### Port 3000 Already in Use
```bash
# Kill process on port 3000
npx kill-port 3000

# Or use a different port
PORT=3001 npm run dev
```

### Dependencies Installation Failed
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Docker Build Failed
```bash
# Clean Docker cache
docker system prune -a

# Rebuild from scratch
docker-compose build --no-cache
docker-compose up -d
```

## 📞 Need Help?

Check the main [README.md](./README.md) for comprehensive documentation.

---

**Built with ❤️ for elegant moments**
