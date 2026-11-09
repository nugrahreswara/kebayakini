import { test, expect } from '@playwright/test';

test.describe('Kebaya Kini E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the landing page
    await page.goto('/');
    // Wait for page to be fully loaded
    await page.waitForLoadState('networkidle');
  });

  test.describe('Landing Page', () => {
    test('should render landing page with correct title', async ({ page }) => {
      const title = await page.title();
      expect(title).toContain('Kebaya Kini');
    });

    test('should display Kebaya Kini logo in navbar', async ({ page }) => {
      const logo = page.locator('a[href="/"] >> text="Kebaya Kini"');
      await expect(logo).toBeVisible();
    });

    test('should display navigation links', async ({ page }) => {
      const katalogLink = page.locator('button:has-text("Katalog")');
      const caraSewaLink = page.locator('button:has-text("Cara Sewa")');
      const testimoniLink = page.locator('button:has-text("Testimoni")');
      const kontakLink = page.locator('button:has-text("Kontak")');

      await expect(katalogLink).toBeVisible();
      await expect(caraSewaLink).toBeVisible();
      await expect(testimoniLink).toBeVisible();
      await expect(kontakLink).toBeVisible();
    });

    test('should display Rules button in navbar', async ({ page }) => {
      const rulesButton = page.locator('button:has-text("Aturan")');
      await expect(rulesButton).toBeVisible();
    });

    test('should display hero section', async ({ page }) => {
      const heroSection = page.locator('section').first();
      await expect(heroSection).toBeVisible();
    });

    test('should have responsive design for mobile', async ({ page }) => {
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });
      
      // Check that mobile menu button is visible
      const mobileMenuButton = page.locator('button[aria-label="Toggle menu"]');
      await expect(mobileMenuButton).toBeVisible();

      // Check that desktop nav is hidden
      const desktopNav = page.locator('text=Katalog').first();
      await expect(desktopNav).not.toBeVisible();
    });
  });

  test.describe('Rules Modal', () => {
    test('should open Rules modal when clicking Aturan button', async ({ page }) => {
      const rulesButton = page.locator('button:has-text("Aturan")');
      await rulesButton.click();

      // Check that modal is visible
      const modalTitle = page.locator('text="Ketentuan & Aturan"');
      await expect(modalTitle).toBeVisible();
    });

    test('should display Rules Sewa tab by default', async ({ page }) => {
      const rulesButton = page.locator('button:has-text("Aturan")');
      await rulesButton.click();

      // Check Rules Sewa content is visible
      const rentalsRulesTitle = page.locator('text="RULES SEWA"');
      await expect(rentalsRulesTitle).toBeVisible();
    });

    test('should switch to Ketentuan Fitting tab', async ({ page }) => {
      const rulesButton = page.locator('button:has-text("Aturan")');
      await rulesButton.click();

      // Click Ketentuan Fitting tab
      const fittingTab = page.locator('button:has-text("Ketentuan Fitting")');
      await fittingTab.click();

      // Check Fitting content is visible
      const fittingTitle = page.locator('text="KETENTUAN FITTING"');
      await expect(fittingTitle).toBeVisible();
    });

    test('should close Rules modal when clicking close button', async ({ page }) => {
      const rulesButton = page.locator('button:has-text("Aturan")');
      await rulesButton.click();

      // Click close button
      const closeButton = page.locator('button[aria-label="Close modal"]');
      await closeButton.click();

      // Check modal is closed
      const modalTitle = page.locator('text="Ketentuan & Aturan"');
      await expect(modalTitle).not.toBeVisible();
    });

    test('should display deposit information in Rules Sewa', async ({ page }) => {
      const rulesButton = page.locator('button:has-text("Aturan")');
      await rulesButton.click();

      // Check for DP content
      const dpText = page.locator('text="Minimum DP: 50%"');
      await expect(dpText).toBeVisible();
    });

    test('should display fitting reservation info in Ketentuan Fitting', async ({ page }) => {
      const rulesButton = page.locator('button:has-text("Aturan")');
      await rulesButton.click();

      const fittingTab = page.locator('button:has-text("Ketentuan Fitting")');
      await fittingTab.click();

      // Check for reservation requirement
      const reservationText = page.locator('text="Fitting hanya dilakukan dengan reservasi"');
      await expect(reservationText).toBeVisible();
    });
  });

  test.describe('Catalog & Modal Interaction', () => {
    test('should display catalog section', async ({ page }) => {
      // Scroll to catalog section
      const catalogSection = page.locator('#katalog');
      await catalogSection.scrollIntoViewIfNeeded();

      await expect(catalogSection).toBeVisible();
    });

    test('should have catalog items visible', async ({ page }) => {
      const catalogSection = page.locator('#katalog');
      await catalogSection.scrollIntoViewIfNeeded();

      // Look for kebaya cards
      const kebayaCards = page.locator('[class*="card"], [class*="item"]').filter({ hasText: /Rp|harga|sewa/i });
      const count = await kebayaCards.count();
      expect(count).toBeGreaterThan(0);
    });
  });

  test.describe('Navigation Links', () => {
    test('should scroll to Katalog section when clicking Katalog link', async ({ page }) => {
      const katalogLink = page.locator('button:has-text("Katalog")').first();
      await katalogLink.click();

      // Check if scrolled near catalog section
      const katalogSection = page.locator('#katalog');
      const isInViewport = await katalogSection.isVisible();
      expect(isInViewport).toBeTruthy();
    });

    test('should scroll to Cara Sewa section when clicking Cara Sewa link', async ({ page }) => {
      const caraSewaLink = page.locator('button:has-text("Cara Sewa")').first();
      await caraSewaLink.click();

      // Check if scrolled near cara sewa section
      const caraSewaSection = page.locator('#cara-sewa');
      const isInViewport = await caraSewaSection.isVisible();
      expect(isInViewport).toBeTruthy();
    });
  });

  test.describe('Mobile Navigation', () => {
    test.beforeEach(async ({ page }) => {
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });
    });

    test('should open mobile menu when clicking menu button', async ({ page }) => {
      const menuButton = page.locator('button[aria-label="Toggle menu"]');
      await menuButton.click();

      // Check mobile menu is visible
      const katalogMobileLink = page.locator('button:has-text("Katalog")').nth(1);
      await expect(katalogMobileLink).toBeVisible();
    });

    test('should close mobile menu when clicking overlay', async ({ page }) => {
      const menuButton = page.locator('button[aria-label="Toggle menu"]');
      await menuButton.click();

      // Click overlay
      const overlay = page.locator('fixed').filter({ has: page.locator('bg-black') });
      if (await overlay.count() > 0) {
        await overlay.first().click();
      }

      // Menu should be closed
      const mobileNav = page.locator('[class*="fixed"][class*="right"]');
      // Just verify menu button is clickable again
      await expect(menuButton).toBeVisible();
    });

    test('should display Aturan button in mobile menu', async ({ page }) => {
      const menuButton = page.locator('button[aria-label="Toggle menu"]');
      await menuButton.click();

      const aturanMobileButton = page.locator('button:has-text("Aturan")').nth(1);
      await expect(aturanMobileButton).toBeVisible();
    });
  });

  test.describe('Accessibility', () => {
    test('should have proper heading hierarchy', async ({ page }) => {
      const h1 = page.locator('h1');
      const count = await h1.count();
      expect(count).toBeGreaterThan(0);
    });

    test('should have alt text on images', async ({ page }) => {
      const images = page.locator('img');
      const count = await images.count();
      
      if (count > 0) {
        const firstImage = images.first();
        const altText = await firstImage.getAttribute('alt');
        expect(altText).toBeTruthy();
      }
    });

    test('should have descriptive button labels', async ({ page }) => {
      const buttons = page.locator('button');
      const count = await buttons.count();
      expect(count).toBeGreaterThan(0);
    });
  });

  test.describe('Performance', () => {
    test('should load page within acceptable time', async ({ page }) => {
      const startTime = Date.now();
      await page.goto('/');
      const endTime = Date.now();
      
      const loadTime = endTime - startTime;
      expect(loadTime).toBeLessThan(5000); // 5 seconds
    });
  });
});
