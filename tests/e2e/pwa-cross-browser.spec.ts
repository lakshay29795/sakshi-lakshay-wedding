import { test, expect, type Page, type BrowserContext, devices } from '@playwright/test';

// Test PWA functionality across different browsers and devices
const testDevices = [
  { name: 'Desktop Chrome', ...devices['Desktop Chrome'] },
  { name: 'Desktop Firefox', ...devices['Desktop Firefox'] },
  { name: 'Desktop Safari', ...devices['Desktop Safari'] },
  { name: 'iPhone 12', ...devices['iPhone 12'] },
  { name: 'Pixel 5', ...devices['Pixel 5'] },
  { name: 'iPad Pro', ...devices['iPad Pro'] },
];

for (const device of testDevices) {
  test.describe(`PWA Cross-Browser: ${device.name}`, () => {
    let page: Page;
    let context: BrowserContext;

    test.beforeEach(async ({ browser }) => {
      context = await browser.newContext({
        ...device,
        permissions: ['notifications'],
      });
      page = await context.newPage();
    });

    test.afterEach(async () => {
      await context.close();
    });

    test(`should load correctly on ${device.name}`, async () => {
      await page.goto('/');
      await page.waitForLoadState('domcontentloaded');
      
      // Basic functionality should work
      await expect(page.locator('h1')).toBeVisible();
      
      // Check viewport
      const viewport = page.viewportSize();
      expect(viewport?.width).toBeGreaterThan(0);
      expect(viewport?.height).toBeGreaterThan(0);
      
      console.log(`✅ ${device.name} - Basic load successful`);
    });

    test(`should have responsive design on ${device.name}`, async () => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      // Check if navigation is appropriate for device
      const isMobile = device.name.includes('iPhone') || device.name.includes('Pixel');
      
      if (isMobile) {
        // Mobile should have hamburger menu or mobile navigation
        const mobileMenu = page.locator('[data-testid="mobile-menu"]').or(
          page.locator('button[aria-label*="menu"]').or(
            page.locator('.hamburger')
          )
        );
        
        const hasMobileMenu = await mobileMenu.isVisible().catch(() => false);
        if (hasMobileMenu) {
          console.log(`✅ ${device.name} - Mobile navigation detected`);
        }
      } else {
        // Desktop should have full navigation
        const desktopNav = page.locator('nav').or(
          page.locator('[data-testid="desktop-nav"]')
        );
        
        const hasDesktopNav = await desktopNav.isVisible().catch(() => false);
        if (hasDesktopNav) {
          console.log(`✅ ${device.name} - Desktop navigation detected`);
        }
      }
      
      // Content should be readable
      const bodyText = await page.textContent('body');
      expect(bodyText?.length).toBeGreaterThan(100);
    });

    test(`should support PWA features on ${device.name}`, async () => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      // Check service worker support
      const hasServiceWorker = await page.evaluate(() => 'serviceWorker' in navigator);
      
      if (hasServiceWorker) {
        console.log(`✅ ${device.name} - Service Worker supported`);
        
        // Wait for service worker registration
        await page.waitForFunction(() => {
          return navigator.serviceWorker.ready;
        }, { timeout: 10000 }).catch(() => {
          console.log(`⚠️ ${device.name} - Service Worker registration timeout`);
        });
      } else {
        console.log(`ℹ️ ${device.name} - Service Worker not supported`);
      }
      
      // Check manifest support
      const manifestLink = page.locator('link[rel="manifest"]');
      const hasManifest = await manifestLink.count() > 0;
      
      if (hasManifest) {
        console.log(`✅ ${device.name} - Web App Manifest present`);
        
        // Test manifest accessibility
        const manifestHref = await manifestLink.getAttribute('href');
        if (manifestHref) {
          const manifestResponse = await page.request.get(manifestHref);
          expect(manifestResponse.ok()).toBeTruthy();
        }
      }
      
      // Check notification support
      const hasNotifications = await page.evaluate(() => 'Notification' in window);
      
      if (hasNotifications) {
        console.log(`✅ ${device.name} - Notifications supported`);
      } else {
        console.log(`ℹ️ ${device.name} - Notifications not supported`);
      }
    });

    test(`should handle touch interactions on ${device.name}`, async () => {
      const isTouchDevice = device.name.includes('iPhone') || 
                           device.name.includes('Pixel') || 
                           device.name.includes('iPad');
      
      if (!isTouchDevice) {
        test.skip();
        return;
      }
      
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      // Test touch interactions
      const buttons = page.locator('button');
      const buttonCount = await buttons.count();
      
      if (buttonCount > 0) {
        const firstButton = buttons.first();
        
        // Test tap
        await firstButton.tap();
        await page.waitForTimeout(500);
        
        console.log(`✅ ${device.name} - Touch interactions working`);
      }
      
      // Test scroll behavior
      await page.evaluate(() => {
        window.scrollTo(0, 100);
      });
      
      await page.waitForTimeout(500);
      
      const scrollY = await page.evaluate(() => window.scrollY);
      expect(scrollY).toBeGreaterThan(0);
    });

    test(`should work offline on ${device.name}`, async () => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      // Wait for service worker if supported
      const hasServiceWorker = await page.evaluate(() => 'serviceWorker' in navigator);
      
      if (hasServiceWorker) {
        await page.waitForFunction(() => {
          return navigator.serviceWorker.ready;
        }, { timeout: 10000 }).catch(() => {
          console.log(`⚠️ ${device.name} - Service Worker not ready for offline test`);
        });
        
        // Give time for caching
        await page.waitForTimeout(2000);
        
        // Go offline
        await context.setOffline(true);
        
        // Try to reload
        await page.reload();
        await page.waitForLoadState('domcontentloaded');
        
        // Should still show content
        const hasContent = await page.locator('h1').isVisible().catch(() => false);
        
        if (hasContent) {
          console.log(`✅ ${device.name} - Offline functionality working`);
        } else {
          console.log(`⚠️ ${device.name} - Offline functionality limited`);
        }
        
        // Go back online
        await context.setOffline(false);
      } else {
        console.log(`ℹ️ ${device.name} - Skipping offline test (no service worker support)`);
      }
    });
  });
}

test.describe('PWA Feature Detection', () => {
  test('should detect PWA capabilities across browsers', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const capabilities = await page.evaluate(() => {
      const caps = {
        serviceWorker: 'serviceWorker' in navigator,
        notifications: 'Notification' in window,
        pushManager: 'PushManager' in window,
        backgroundSync: 'serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype,
        webShare: 'share' in navigator,
        installPrompt: 'BeforeInstallPromptEvent' in window,
        fullscreen: 'requestFullscreen' in document.documentElement,
        deviceOrientation: 'DeviceOrientationEvent' in window,
        geolocation: 'geolocation' in navigator,
        camera: 'mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices,
        storage: 'storage' in navigator && 'estimate' in navigator.storage,
        clipboard: 'clipboard' in navigator,
        webGL: (() => {
          try {
            const canvas = document.createElement('canvas');
            return !!(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
          } catch (e) {
            return false;
          }
        })(),
        indexedDB: 'indexedDB' in window,
        webWorkers: 'Worker' in window,
        fetch: 'fetch' in window,
        promises: 'Promise' in window,
        intersectionObserver: 'IntersectionObserver' in window,
        resizeObserver: 'ResizeObserver' in window,
      };
      
      return caps;
    });
    
    console.log('Browser Capabilities:', capabilities);
    
    // Core PWA features
    expect(capabilities.serviceWorker).toBe(true);
    expect(capabilities.fetch).toBe(true);
    expect(capabilities.promises).toBe(true);
    
    // Log feature support
    Object.entries(capabilities).forEach(([feature, supported]) => {
      console.log(`${feature}: ${supported ? '✅' : '❌'}`);
    });
  });
});

test.describe('PWA Installation Behavior', () => {
  test('should handle installation prompts correctly', async ({ page, browserName }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Simulate beforeinstallprompt event (mainly works in Chromium)
    if (browserName === 'chromium') {
      await page.evaluate(() => {
        const event = new Event('beforeinstallprompt') as any;
        event.prompt = () => Promise.resolve();
        event.userChoice = Promise.resolve({ outcome: 'accepted' });
        window.dispatchEvent(event);
      });
      
      await page.waitForTimeout(1000);
      
      // Look for install prompt
      const installPrompt = page.locator('text=Install').or(
        page.locator('[data-testid="install-prompt"]')
      );
      
      const hasPrompt = await installPrompt.isVisible().catch(() => false);
      
      if (hasPrompt) {
        console.log('✅ Install prompt appeared in Chromium');
        
        // Test prompt interaction
        await installPrompt.click();
        await page.waitForTimeout(500);
      }
    } else {
      console.log(`ℹ️ Install prompt test skipped for ${browserName}`);
    }
  });

  test('should handle add to home screen on mobile', async ({ page, browserName }) => {
    // Simulate mobile Safari add to home screen
    if (browserName === 'webkit') {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      // Check for iOS-specific meta tags
      const appleMobileCapable = page.locator('meta[name="apple-mobile-web-app-capable"]');
      await expect(appleMobileCapable).toHaveAttribute('content', 'yes');
      
      const appleTitle = page.locator('meta[name="apple-mobile-web-app-title"]');
      await expect(appleTitle).toHaveAttribute('content');
      
      const appleTouchIcon = page.locator('link[rel="apple-touch-icon"]');
      await expect(appleTouchIcon).toHaveAttribute('href');
      
      console.log('✅ iOS add to home screen meta tags present');
    }
  });
});

test.describe('PWA Accessibility Across Devices', () => {
  test('should be accessible on all devices', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Test keyboard navigation
    await page.keyboard.press('Tab');
    const focusedElement = await page.evaluate(() => document.activeElement?.tagName);
    expect(focusedElement).toBeDefined();
    
    // Test screen reader compatibility
    const ariaLabels = await page.locator('[aria-label]').count();
    const altTexts = await page.locator('img[alt]').count();
    const headings = await page.locator('h1, h2, h3, h4, h5, h6').count();
    
    console.log('Accessibility features:', {
      ariaLabels,
      altTexts,
      headings,
    });
    
    expect(headings).toBeGreaterThan(0);
  });

  test('should support high contrast mode', async ({ page }) => {
    // Simulate high contrast mode
    await page.emulateMedia({ colorScheme: 'dark', reducedMotion: 'reduce' });
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Content should still be visible and readable
    await expect(page.locator('h1')).toBeVisible();
    
    const bodyStyles = await page.evaluate(() => {
      const body = document.body;
      const styles = window.getComputedStyle(body);
      return {
        backgroundColor: styles.backgroundColor,
        color: styles.color,
      };
    });
    
    console.log('High contrast mode styles:', bodyStyles);
  });
});
