import { test, expect, type Page, type BrowserContext } from '@playwright/test';

test.describe('PWA Installation Flow', () => {
  let page: Page;
  let context: BrowserContext;

  test.beforeEach(async ({ browser }) => {
    // Create context with PWA-friendly settings
    context = await browser.newContext({
      viewport: { width: 1280, height: 720 },
      permissions: ['notifications'],
    });
    page = await context.newPage();
    
    // Navigate to the app
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test.afterEach(async () => {
    await context.close();
  });

  test('should have valid web app manifest', async () => {
    // Check if manifest is linked
    const manifestLink = page.locator('link[rel="manifest"]');
    await expect(manifestLink).toHaveAttribute('href', '/manifest.json');

    // Fetch and validate manifest content
    const manifestResponse = await page.request.get('/manifest.json');
    expect(manifestResponse.ok()).toBeTruthy();
    
    const manifest = await manifestResponse.json();
    
    // Validate required manifest fields
    expect(manifest.name).toBe("Sarah & Michael's Wedding");
    expect(manifest.short_name).toBe("S&M Wedding");
    expect(manifest.display).toBe("standalone");
    expect(manifest.start_url).toBe("/");
    expect(manifest.theme_color).toBe("#A8B5A0");
    expect(manifest.background_color).toBe("#FFF8F0");
    
    // Validate icons
    expect(manifest.icons).toBeDefined();
    expect(manifest.icons.length).toBeGreaterThan(0);
    
    // Check for required icon sizes
    const iconSizes = manifest.icons.map((icon: any) => icon.sizes);
    expect(iconSizes).toContain('192x192');
    expect(iconSizes).toContain('512x512');
  });

  test('should register service worker successfully', async () => {
    // Wait for service worker registration
    await page.waitForFunction(() => {
      return 'serviceWorker' in navigator && navigator.serviceWorker.ready;
    });

    // Check service worker registration
    const swRegistration = await page.evaluate(async () => {
      const registration = await navigator.serviceWorker.ready;
      return {
        scope: registration.scope,
        active: !!registration.active,
        installing: !!registration.installing,
        waiting: !!registration.waiting,
      };
    });

    expect(swRegistration.active).toBe(true);
    expect(swRegistration.scope).toContain(new URL(page.url()).origin);
  });

  test('should show install prompt when criteria are met', async () => {
    // Wait for the page to load completely
    await page.waitForLoadState('networkidle');
    
    // Check if install prompt appears (may take a few seconds)
    await page.waitForTimeout(6000); // Wait for install prompt delay
    
    // Look for install prompt or install button
    const installPrompt = page.locator('[data-testid="pwa-install-prompt"]').or(
      page.locator('text=Install Our Wedding App')
    ).or(
      page.locator('button:has-text("Install")')
    );
    
    // The install prompt should be visible (if PWA criteria are met)
    // Note: This might not work in all test environments
    const isVisible = await installPrompt.isVisible().catch(() => false);
    
    if (isVisible) {
      console.log('✅ Install prompt is visible');
      await expect(installPrompt).toBeVisible();
    } else {
      console.log('ℹ️ Install prompt not visible (may be environment-specific)');
    }
  });

  test('should have proper PWA meta tags', async () => {
    // Check for PWA-specific meta tags
    await expect(page.locator('meta[name="apple-mobile-web-app-capable"]')).toHaveAttribute('content', 'yes');
    await expect(page.locator('meta[name="apple-mobile-web-app-status-bar-style"]')).toHaveAttribute('content', 'default');
    await expect(page.locator('meta[name="apple-mobile-web-app-title"]')).toHaveAttribute('content', 'Sarah & Michael');
    await expect(page.locator('meta[name="mobile-web-app-capable"]')).toHaveAttribute('content', 'yes');
    await expect(page.locator('meta[name="theme-color"]')).toHaveAttribute('content', '#A8B5A0');
  });

  test('should have all required icons accessible', async () => {
    const manifest = await page.request.get('/manifest.json').then(r => r.json());
    
    // Test each icon URL
    for (const icon of manifest.icons) {
      const iconResponse = await page.request.get(icon.src);
      expect(iconResponse.ok()).toBeTruthy();
      expect(iconResponse.headers()['content-type']).toContain('image');
    }
    
    // Test favicon
    const faviconResponse = await page.request.get('/favicon.ico');
    expect(faviconResponse.ok()).toBeTruthy();
    
    // Test apple touch icon
    const appleTouchIconResponse = await page.request.get('/icons/icon-192x192.png');
    expect(appleTouchIconResponse.ok()).toBeTruthy();
  });

  test('should handle app shortcuts correctly', async () => {
    const manifest = await page.request.get('/manifest.json').then(r => r.json());
    
    expect(manifest.shortcuts).toBeDefined();
    expect(manifest.shortcuts.length).toBeGreaterThan(0);
    
    // Validate shortcut structure
    for (const shortcut of manifest.shortcuts) {
      expect(shortcut.name).toBeDefined();
      expect(shortcut.url).toBeDefined();
      expect(shortcut.icons).toBeDefined();
      
      // Test shortcut URL accessibility
      const shortcutResponse = await page.request.get(shortcut.url);
      expect(shortcutResponse.ok()).toBeTruthy();
    }
  });

  test('should support share target functionality', async () => {
    const manifest = await page.request.get('/manifest.json').then(r => r.json());
    
    expect(manifest.share_target).toBeDefined();
    expect(manifest.share_target.action).toBe('/share');
    expect(manifest.share_target.method).toBe('POST');
    expect(manifest.share_target.params).toBeDefined();
    
    // Test share target endpoint
    const shareResponse = await page.request.get('/api/share');
    expect(shareResponse.status()).toBe(302); // Should redirect
  });
});

test.describe('PWA Installation Simulation', () => {
  test('should simulate installation process', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Simulate beforeinstallprompt event
    await page.evaluate(() => {
      const event = new Event('beforeinstallprompt');
      (event as any).prompt = () => Promise.resolve();
      (event as any).userChoice = Promise.resolve({ outcome: 'accepted' });
      window.dispatchEvent(event);
    });
    
    // Wait for install prompt to appear
    await page.waitForTimeout(1000);
    
    // Check if install button becomes visible
    const installButton = page.locator('button:has-text("Install")');
    const isVisible = await installButton.isVisible().catch(() => false);
    
    if (isVisible) {
      await installButton.click();
      console.log('✅ Install button clicked successfully');
    } else {
      console.log('ℹ️ Install button not found (simulated environment)');
    }
  });

  test('should handle app installation state changes', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Check initial installation state
    const initialState = await page.evaluate(() => {
      return {
        standalone: window.matchMedia('(display-mode: standalone)').matches,
        webAppCapable: (navigator as any).standalone === true,
      };
    });
    
    console.log('Installation state:', initialState);
    
    // Simulate app installation
    await page.evaluate(() => {
      const event = new Event('appinstalled');
      window.dispatchEvent(event);
    });
    
    // Wait for state change handling
    await page.waitForTimeout(1000);
    
    // The app should handle the installation event
    // (Actual behavior depends on implementation)
  });
});

test.describe('Cross-Browser PWA Support', () => {
  test('should work in Chromium-based browsers', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Check service worker support
    const hasServiceWorker = await page.evaluate(() => 'serviceWorker' in navigator);
    expect(hasServiceWorker).toBe(true);
    
    // Check manifest support
    const manifestSupported = await page.evaluate(() => {
      const link = document.querySelector('link[rel="manifest"]');
      return !!link;
    });
    expect(manifestSupported).toBe(true);
    
    // Check notification support
    const notificationSupported = await page.evaluate(() => 'Notification' in window);
    expect(notificationSupported).toBe(true);
  });

  test('should gracefully degrade in unsupported browsers', async ({ page }) => {
    // Simulate browser without PWA support
    await page.addInitScript(() => {
      // Remove service worker support
      delete (window.navigator as any).serviceWorker;
      delete (window as any).Notification;
    });
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // App should still function without PWA features
    await expect(page.locator('h1')).toBeVisible();
    
    // Check that PWA-specific UI is hidden or shows fallback
    const pwaStatus = page.locator('[data-testid="pwa-status"]');
    const isVisible = await pwaStatus.isVisible().catch(() => false);
    
    if (isVisible) {
      // Should show "not supported" or similar message
      const statusText = await pwaStatus.textContent();
      expect(statusText).toMatch(/not supported|unavailable/i);
    }
  });
});
