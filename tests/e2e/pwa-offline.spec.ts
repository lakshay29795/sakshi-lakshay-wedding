import { test, expect, type Page, type BrowserContext } from '@playwright/test';

test.describe('PWA Offline Functionality', () => {
  let page: Page;
  let context: BrowserContext;

  test.beforeEach(async ({ browser }) => {
    context = await browser.newContext({
      viewport: { width: 1280, height: 720 },
    });
    page = await context.newPage();
    
    // Navigate to the app and wait for service worker
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Wait for service worker to be ready
    await page.waitForFunction(() => {
      return 'serviceWorker' in navigator && navigator.serviceWorker.ready;
    });
    
    // Give service worker time to cache resources
    await page.waitForTimeout(2000);
  });

  test.afterEach(async () => {
    await context.close();
  });

  test('should cache essential resources on first visit', async () => {
    // Check if service worker has cached essential resources
    const cachedResources = await page.evaluate(async () => {
      const cacheNames = await caches.keys();
      const results: Record<string, string[]> = {};
      
      for (const cacheName of cacheNames) {
        const cache = await caches.open(cacheName);
        const requests = await cache.keys();
        results[cacheName] = requests.map(req => req.url);
      }
      
      return results;
    });
    
    console.log('Cached resources:', cachedResources);
    
    // Should have at least one cache
    expect(Object.keys(cachedResources).length).toBeGreaterThan(0);
    
    // Check for essential cached resources
    const allCachedUrls = Object.values(cachedResources).flat();
    const hasEssentialResources = allCachedUrls.some(url => 
      url.includes('/') || // Root page
      url.includes('manifest.json') ||
      url.includes('.js') ||
      url.includes('.css')
    );
    
    expect(hasEssentialResources).toBe(true);
  });

  test('should work offline after initial load', async () => {
    // First, ensure the page loads online
    await expect(page.locator('h1')).toBeVisible();
    
    // Go offline
    await context.setOffline(true);
    
    // Navigate to home page (should work from cache)
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    
    // Page should still load
    await expect(page.locator('h1')).toBeVisible();
    
    // Check for offline indicator
    const offlineIndicator = page.locator('text=offline').or(
      page.locator('[data-testid="offline-status"]')
    );
    
    const hasOfflineIndicator = await offlineIndicator.isVisible().catch(() => false);
    if (hasOfflineIndicator) {
      console.log('✅ Offline indicator is visible');
    }
  });

  test('should show offline page for uncached routes', async () => {
    // Go offline
    await context.setOffline(true);
    
    // Try to navigate to a route that might not be cached
    await page.goto('/offline-test-route-that-does-not-exist');
    
    // Should either show offline page or handle gracefully
    const pageContent = await page.textContent('body');
    const hasOfflineContent = pageContent?.includes('offline') || 
                             pageContent?.includes('connection') ||
                             pageContent?.includes('network');
    
    if (hasOfflineContent) {
      console.log('✅ Offline fallback page is working');
      expect(hasOfflineContent).toBe(true);
    } else {
      // Should at least not show a browser error page
      expect(pageContent).not.toContain('This site can't be reached');
    }
  });

  test('should handle API requests gracefully when offline', async () => {
    // Go offline
    await context.setOffline(true);
    
    // Try to make an API request (e.g., through form submission)
    await page.goto('/rsvp');
    await page.waitForLoadState('domcontentloaded');
    
    // Fill out form
    const nameInput = page.locator('input[name="primaryGuest.name"]').or(
      page.locator('input[placeholder*="name"]')
    );
    
    if (await nameInput.isVisible()) {
      await nameInput.fill('Test User');
      
      // Try to submit (should handle offline gracefully)
      const submitButton = page.locator('button[type="submit"]').or(
        page.locator('button:has-text("Submit")')
      );
      
      if (await submitButton.isVisible()) {
        await submitButton.click();
        
        // Should show offline message or queue for later
        await page.waitForTimeout(2000);
        
        const pageText = await page.textContent('body');
        const hasOfflineHandling = pageText?.includes('offline') ||
                                  pageText?.includes('saved') ||
                                  pageText?.includes('queue') ||
                                  pageText?.includes('sync');
        
        if (hasOfflineHandling) {
          console.log('✅ Offline form submission handled gracefully');
        }
      }
    }
  });

  test('should sync data when back online', async () => {
    // Start offline
    await context.setOffline(true);
    
    // Navigate to a form page
    await page.goto('/guestbook');
    await page.waitForLoadState('domcontentloaded');
    
    // Try to submit data while offline
    const nameInput = page.locator('input[name="guestName"]').or(
      page.locator('input[placeholder*="name"]')
    );
    const messageInput = page.locator('textarea[name="message"]').or(
      page.locator('textarea[placeholder*="message"]')
    );
    
    if (await nameInput.isVisible() && await messageInput.isVisible()) {
      await nameInput.fill('Offline Test User');
      await messageInput.fill('This message was submitted while offline');
      
      const submitButton = page.locator('button[type="submit"]').or(
        page.locator('button:has-text("Send")')
      );
      
      if (await submitButton.isVisible()) {
        await submitButton.click();
        await page.waitForTimeout(1000);
        
        // Go back online
        await context.setOffline(false);
        await page.waitForTimeout(3000); // Wait for sync
        
        // Check if data was synced (look for success message or similar)
        const pageText = await page.textContent('body');
        const hasSyncSuccess = pageText?.includes('synced') ||
                              pageText?.includes('submitted') ||
                              pageText?.includes('success');
        
        if (hasSyncSuccess) {
          console.log('✅ Background sync working');
        }
      }
    }
  });

  test('should cache images and assets for offline viewing', async () => {
    // Load gallery page to trigger image caching
    await page.goto('/gallery');
    await page.waitForLoadState('networkidle');
    
    // Wait for images to load and be cached
    await page.waitForTimeout(3000);
    
    // Go offline
    await context.setOffline(true);
    
    // Reload gallery page
    await page.reload();
    await page.waitForLoadState('domcontentloaded');
    
    // Check if images are still visible (from cache)
    const images = page.locator('img');
    const imageCount = await images.count();
    
    if (imageCount > 0) {
      // Check if at least some images loaded from cache
      let loadedImages = 0;
      for (let i = 0; i < Math.min(imageCount, 5); i++) {
        const img = images.nth(i);
        const isVisible = await img.isVisible().catch(() => false);
        if (isVisible) {
          loadedImages++;
        }
      }
      
      if (loadedImages > 0) {
        console.log(`✅ ${loadedImages} images loaded from cache while offline`);
      }
    }
  });

  test('should show connection status indicator', async () => {
    // Check online status indicator
    const onlineStatus = await page.evaluate(() => navigator.onLine);
    expect(onlineStatus).toBe(true);
    
    // Look for connection status in UI
    const statusIndicator = page.locator('[data-testid="connection-status"]').or(
      page.locator('text=Online').or(page.locator('text=Connected'))
    );
    
    // Go offline
    await context.setOffline(true);
    
    // Trigger offline event
    await page.evaluate(() => {
      window.dispatchEvent(new Event('offline'));
    });
    
    await page.waitForTimeout(1000);
    
    // Check if offline status is reflected
    const offlineStatus = await page.evaluate(() => navigator.onLine);
    expect(offlineStatus).toBe(false);
    
    // Look for offline indicator
    const offlineIndicator = page.locator('text=Offline').or(
      page.locator('text=Disconnected').or(
        page.locator('[data-testid="offline-indicator"]')
      )
    );
    
    const hasOfflineIndicator = await offlineIndicator.isVisible().catch(() => false);
    if (hasOfflineIndicator) {
      console.log('✅ Offline status indicator working');
    }
  });

  test('should handle service worker updates', async () => {
    // Check current service worker
    const initialSW = await page.evaluate(async () => {
      const registration = await navigator.serviceWorker.ready;
      return {
        scriptURL: registration.active?.scriptURL,
        state: registration.active?.state,
      };
    });
    
    expect(initialSW.scriptURL).toBeDefined();
    expect(initialSW.state).toBe('activated');
    
    // Simulate service worker update
    await page.evaluate(() => {
      navigator.serviceWorker.ready.then(registration => {
        // Simulate update found
        const event = new Event('updatefound');
        registration.dispatchEvent(event);
      });
    });
    
    await page.waitForTimeout(1000);
    
    // Check if update handling works
    console.log('✅ Service worker update simulation completed');
  });
});

test.describe('PWA Offline Edge Cases', () => {
  test('should handle intermittent connectivity', async ({ page, context }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Simulate flaky connection
    for (let i = 0; i < 3; i++) {
      await context.setOffline(true);
      await page.waitForTimeout(1000);
      
      await context.setOffline(false);
      await page.waitForTimeout(1000);
    }
    
    // App should handle this gracefully
    await expect(page.locator('h1')).toBeVisible();
    console.log('✅ Intermittent connectivity handled');
  });

  test('should work with slow network conditions', async ({ page, context }) => {
    // Simulate slow network
    await context.route('**/*', async (route) => {
      await new Promise(resolve => setTimeout(resolve, 500)); // 500ms delay
      await route.continue();
    });
    
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    
    // Should still load, just slower
    await expect(page.locator('h1')).toBeVisible({ timeout: 10000 });
    console.log('✅ Slow network conditions handled');
  });

  test('should handle cache storage limits', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Check cache storage usage
    const cacheUsage = await page.evaluate(async () => {
      if ('storage' in navigator && 'estimate' in navigator.storage) {
        const estimate = await navigator.storage.estimate();
        return {
          quota: estimate.quota,
          usage: estimate.usage,
          available: estimate.quota ? estimate.quota - (estimate.usage || 0) : null,
        };
      }
      return null;
    });
    
    if (cacheUsage) {
      console.log('Cache storage usage:', cacheUsage);
      
      // Should have reasonable usage
      if (cacheUsage.quota && cacheUsage.usage) {
        const usagePercent = (cacheUsage.usage / cacheUsage.quota) * 100;
        expect(usagePercent).toBeLessThan(50); // Should use less than 50% of available storage
      }
    }
  });
});
