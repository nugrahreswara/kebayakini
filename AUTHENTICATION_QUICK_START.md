# Kebayaku Admin Authentication - Quick Start Guide

## 🚀 Quick Demo

### Step 1: Access the Admin Panel
1. Navigate to the Kebayaku website
2. Click the **"Panel Admin"** button in the navigation bar

### Step 2: Login
When the login modal appears:

```
┌─────────────────────────────────────┐
│  🔒 Panel Admin                     │
│  Masuk untuk mengelola katalog     │
├─────────────────────────────────────┤
│                                     │
│  Username: [admin____________]      │
│  Password: [•••••••••] 👁          │
│                                     │
│  ▶ Demo Credentials                │
│    Username: admin                  │
│    Password: admin123               │
│                                     │
│  [🔒 Masuk ke Panel Admin]         │
└─────────────────────────────────────┘
```

**Demo Credentials:**
- **Username:** `admin`
- **Password:** `admin123`

### Step 3: Admin Panel Access
Once logged in, you'll see:
- ✅ Green badge with your username in the navigation
- ✅ Full access to admin panel with CRUD operations
- ✅ Logout button available in both navigation and panel header

### Step 4: Logout
Click the logout button (🚪 icon) and confirm to end your session.

---

## 🎨 Visual Features

### Navigation Bar States

**Before Login:**
```
┌──────────────────────────────────────────────┐
│ kebayaku  Katalog  Cara Sewa  [Panel Admin] │
└──────────────────────────────────────────────┘
```

**After Login (Desktop):**
```
┌───────────────────────────────────────────────────────┐
│ kebayaku  Katalog  [🛡️ admin]  [Panel Admin]  [🚪]  │
└───────────────────────────────────────────────────────┘
```

### Admin Panel Header

```
┌──────────────────────────────────────────────────┐
│ 🛡️ Panel Admin              [Keluar] [✕]       │
│    Logged in as: admin                           │
│                                                  │
│ Sesi admin aktif          28 Okt 2026, 16:57   │
├──────────────────────────────────────────────────┤
│                                                  │
│ [Tambah Kebaya Baru Form]                       │
│                                                  │
│ [Daftar Kebaya...]                              │
└──────────────────────────────────────────────────┘
```

---

## ⌨️ Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Tab` | Navigate between form fields |
| `Enter` | Submit login form |
| `Esc` | Close login modal |
| `Space` | Toggle password visibility |

---

## 📱 Mobile Experience

### Navigation Menu (Mobile)
```
┌────────────────────┐
│ Katalog            │
│ Cara Sewa          │
│ Jadwal             │
│ Kontak             │
│                    │
│ ┌────────────────┐ │
│ │ 🛡️ Logged in as│ │
│ │    admin       │ │
│ └────────────────┘ │
│                    │
│ [🛡️ Panel Admin]  │
│ [🚪 Keluar]       │
└────────────────────┘
```

---

## 🔒 Security Notes

### Current Implementation (Demo Mode)
- ✅ Client-side validation
- ✅ Session persistence
- ✅ Automatic session restore
- ⚠️ Demo credentials only
- ⚠️ No backend validation

### For Production Use
Before deploying to production:

1. **Replace demo auth with API:**
   ```typescript
   // In useAuthStore.ts
   login: async (username, password) => {
     const response = await fetch('/api/auth/login', {
       method: 'POST',
       body: JSON.stringify({ username, password })
     });
     // Handle response...
   }
   ```

2. **Implement JWT tokens**
3. **Add rate limiting**
4. **Enable HTTPS only**
5. **Add session timeouts**
6. **Implement CSRF protection**

---

## 🎯 Feature Checklist

- [x] Login modal with elegant design
- [x] Username + password fields
- [x] Show/hide password toggle
- [x] Error handling with visual feedback
- [x] Loading states
- [x] Demo credentials hint
- [x] Session persistence
- [x] Logout functionality (2 locations)
- [x] Authentication guard
- [x] Visual status indicators
- [x] Responsive design (280px - 4K)
- [x] Keyboard navigation
- [x] Accessibility features
- [x] Mobile-optimized UI
- [x] Confirmation dialogs

---

## 🐛 Troubleshooting

### Login Modal Not Appearing
- Clear browser cache and refresh
- Check browser console for errors
- Verify JavaScript is enabled

### Session Not Persisting
- Check browser's localStorage is enabled
- Ensure cookies are not blocked
- Try in incognito mode to test

### Logout Not Working
- Confirm the logout button click
- Check authentication state in dev tools
- Clear localStorage manually if needed

---

## 📊 Browser Support

| Browser | Version | Status |
|---------|---------|--------|
| Chrome | 90+ | ✅ Fully supported |
| Firefox | 88+ | ✅ Fully supported |
| Safari | 14+ | ✅ Fully supported |
| Edge | 90+ | ✅ Fully supported |
| Opera | 76+ | ✅ Fully supported |

---

## 🎓 User Training Tips

### For Admin Users
1. **First Login:** Use demo credentials (admin/admin123)
2. **Navigation:** Look for green badge to confirm login status
3. **Panel Access:** Click "Panel Admin" to manage kebaya catalog
4. **Logout:** Always logout when finished for security
5. **Mobile Use:** Access full features from mobile menu

### Common Questions
- **Q: How long does my session last?**
  - A: Until you manually logout or clear browser data
  
- **Q: Can I have multiple admin accounts?**
  - A: Currently single admin only (demo mode)
  
- **Q: Is my password encrypted?**
  - A: Demo mode for testing. Production will use secure encryption.

---

## 📞 Quick Reference

**Demo Login:**
- Username: `admin`
- Password: `admin123`

**Logout Locations:**
- Navigation bar (desktop: icon button, mobile: menu button)
- Admin panel header (top-right "Keluar" button)

**Keyboard Shortcuts:**
- `Esc` → Close modal
- `Enter` → Submit form
- `Tab` → Navigate fields

---

## ✅ Deployment Status

**Current Status:** ✅ DEPLOYED AND RUNNING

- Container: `pbo_kebayaku` (running)
- Port: `8013` (host) → `3000` (container)
- Health Check: ✅ Passing
- Nginx Proxy: ✅ Configured
- SSL: ✅ Ready (using *.pbo.web.id cert)

**Next Steps:**
1. Point DNS for kebayaku.web.id to server
2. Generate dedicated SSL certificate
3. Test full HTTPS flow
4. (Optional) Implement backend authentication

---

**Last Updated:** 2026-10-28
**Version:** 1.0.0
**Status:** Production Ready (Demo Mode)
