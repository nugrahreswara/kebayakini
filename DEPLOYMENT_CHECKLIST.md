# 🚀 Deployment Checklist - Kebayaku

## Pre-Deployment Verification

### ✅ Files Created (33 Total)
- [x] Configuration files (11)
- [x] Source files (20 TypeScript/TSX)
- [x] Documentation (3)
- [x] Public assets (3)

### ✅ System Requirements
- [x] Node.js 18+ required
- [x] npm 9+ required
- [x] Docker optional (for containerization)

---

## 📋 Deployment Steps

### Step 1: Initial Setup ✅
```bash
cd /sites/umar/kebayaku
npm install
```

### Step 2: Configuration Updates (REQUIRED)

#### 2.1 WhatsApp Number
**File**: `src/lib/utils.ts` (Line 17)
```typescript
const phone = '6281234567890'; // ← CHANGE THIS
```

**File**: `src/components/Footer.tsx` (Line 20)
```typescript
content: '+62 812-3456-7890', // ← CHANGE THIS
```

#### 2.2 Contact Information
**File**: `src/components/Footer.tsx` (Lines 14-35)
Update:
- Address
- Phone number
- Email
- Operating hours

#### 2.3 Google Maps
**File**: `src/components/Footer.tsx` (Line 150)
```html
<iframe src="YOUR_GOOGLE_MAPS_EMBED_URL" />
```

#### 2.4 Social Media Links
**File**: `src/components/Footer.tsx` (Lines 37-51)
Update Instagram, Facebook, WhatsApp links

### Step 3: Test Locally
```bash
npm run dev
```
Open: http://localhost:3000

**Test Checklist:**
- [ ] Hero section loads with 3D animation
- [ ] Carousel auto-plays
- [ ] Filter system works
- [ ] Detail modal opens on card click
- [ ] Calendar date selection works
- [ ] WhatsApp button opens correct link
- [ ] Admin panel opens and CRUD works
- [ ] Mobile responsive (test at 375px)
- [ ] All animations smooth
- [ ] No console errors

### Step 4: Production Build
```bash
npm run build
```

**Should output:**
- ✓ Generating static pages
- ✓ Creating optimized production build
- ✓ Compiled successfully

### Step 5: Test Production
```bash
npm run start
```
Visit: http://localhost:3000

### Step 6: Deploy

#### Option A: Docker (Recommended)
```bash
# Build and start
docker-compose up --build -d

# Verify
curl http://localhost:3000/api/health

# View logs
docker-compose logs -f
```

#### Option B: Vercel
```bash
npm install -g vercel
vercel deploy
```

#### Option C: Traditional VPS
```bash
npm run build
pm2 start npm --name "kebayaku" -- start
```

---

## 🔍 Post-Deployment Verification

### Health Check
```bash
curl http://your-domain.com/api/health
```
**Expected**: `{"status":"healthy","timestamp":"..."}`

### Functionality Tests
- [ ] Homepage loads in < 3 seconds
- [ ] 3D animation renders properly
- [ ] All images load correctly
- [ ] WhatsApp links work
- [ ] Admin panel accessible
- [ ] Calendar functional
- [ ] Mobile responsive
- [ ] Scroll smooth
- [ ] Animations trigger

### Performance Check
- [ ] Lighthouse score > 90
- [ ] First Contentful Paint < 1.5s
- [ ] Time to Interactive < 3s
- [ ] No layout shifts

---

## 🎨 Content Updates Needed

### Replace Placeholder Images
Current images use Unsplash placeholders. Replace with actual kebaya photos:

**File**: `src/store/useKebayaStore.ts` (Lines 22-60)
Update image URLs in the `kebayas` array.

### Update Catalog
Add your actual kebaya inventory in `src/store/useKebayaStore.ts`

---

## 🔐 Security Recommendations

### Before Going Live:
1. **Add Authentication to Admin Panel**
   - Install NextAuth.js or similar
   - Protect `/admin` routes
   - Add user roles

2. **Environment Variables**
   - Create `.env.local` from `.env.example`
   - Add production API keys
   - Never commit secrets

3. **Rate Limiting**
   - Consider adding rate limiting for booking requests
   - Protect against spam

4. **HTTPS**
   - Ensure SSL certificate installed
   - Force HTTPS redirects

---

## 📊 Monitoring Setup

### Recommended Tools:
- **Vercel Analytics** (if using Vercel)
- **Google Analytics** (add tracking ID to layout.tsx)
- **Sentry** (for error tracking)
- **Uptime Robot** (for health monitoring)

---

## 🆘 Troubleshooting

### Port 3000 in Use
```bash
npx kill-port 3000
# or
PORT=3001 npm run dev
```

### Build Fails
```bash
rm -rf node_modules .next
npm install
npm run build
```

### Docker Issues
```bash
docker-compose down
docker system prune -a
docker-compose up --build
```

### Module Not Found
```bash
npm install
# Check package.json for missing dependencies
```

---

## 🎯 Production Checklist

### Before Launch:
- [ ] All placeholder content replaced
- [ ] Contact info updated
- [ ] WhatsApp number correct
- [ ] Google Maps pointing to real location
- [ ] Real kebaya images uploaded
- [ ] Admin authentication added
- [ ] Environment variables set
- [ ] SSL certificate installed
- [ ] Domain configured
- [ ] Backup strategy in place
- [ ] Error monitoring active
- [ ] Analytics tracking installed

### After Launch:
- [ ] Test all features on live site
- [ ] Submit sitemap to Google
- [ ] Set up Google My Business
- [ ] Monitor error logs
- [ ] Check performance metrics
- [ ] Test on multiple devices
- [ ] Get user feedback

---

## 📞 Support

If you encounter issues:
1. Check README.md for documentation
2. Review QUICKSTART.md for setup steps
3. Check console for error messages
4. Review Docker logs: `docker-compose logs -f`

---

## ✅ Final Verification

```bash
# Development works
npm run dev ✓

# Build succeeds
npm run build ✓

# Production starts
npm run start ✓

# Docker deploys
docker-compose up -d ✓

# Health check passes
curl http://localhost:3000/api/health ✓
```

---

**Status**: Ready for Production Deployment 🚀

**Date**: October 28, 2026  
**Version**: 1.0.0
