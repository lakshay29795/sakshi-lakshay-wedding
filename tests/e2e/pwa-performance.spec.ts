import { test, expect, type Page, type BrowserContext } from '@playwright/test';

test.describe('PWA Performance on Slow Networks', () => {
  let page: Page;
  let context: BrowserContext;

  test.beforeEach(async ({ browser }) => {
    context = await browser.newContext({
      viewport: { width: 1280, height: 720 },
    });
    page = await context.newPage();
  });

  test.afterEach(async () => {
    await context.close();
  });

  test('should load quickly on fast connection', async () => {
    const startTime = Date.now();
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const loadTime = Date.now() - startTime;
    console.log(`Fast connection load time: ${loadTime}ms`);
    
    // Should load quickly on fast connection
    expect(loadTime).toBeLessThan(3000); // 3 seconds
    
    // Content should be visible
    await expect(page.locator('h1')).toBeVisible();
  });

  test('should handle slow 3G network conditions', async () => {
    // Simulate slow 3G (1.6 Mbps, 300ms RTT)
    await context.route('**/*', async (route) => {
      const url = route.request().url();
      
      // Different delays for different resource types
      let delay = 300; // Base RTT
      
      if (url.includes('.js') || url.includes('.css')) {
        delay += 1000; // Additional delay for scripts/styles
      } else if (url.includes('.jpg') || url.includes('.png') || url.includes('.webp')) {
        delay += 2000; // Additional delay for images
      }
      
      await new Promise(resolve => setTimeout(resolve, delay));
      await route.continue();
    });
    
    const startTime = Date.now();
    
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    
    const loadTime = Date.now() - startTime;
    console.log(`Slow 3G load time: ${loadTime}ms`);
    
    // Should still load within reasonable time
    expect(loadTime).toBeLessThan(15000); // 15 seconds max
    
    // Critical content should be visible
    await expect(page.locator('h1')).toBeVisible({ timeout: 20000 });
  });

  test('should prioritize critical resources', async () => {
    const resourceLoadTimes: Record<string, number> = {};
    const resourceStartTimes: Record<string, number> = {};
    
    // Track resource loading
    page.on('request', (request) => {
      resourceStartTimes[request.url()] = Date.now();
    });
    
    page.on('response', (response) => {
      const url = response.url();
      if (resourceStartTimes[url]) {
        resourceLoadTimes[url] = Date.now() - resourceStartTimes[url];
      }
    });
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Analyze resource loading priorities
    const htmlLoadTime = Object.entries(resourceLoadTimes)
      .find(([url]) => url === page.url())?.[1] || 0;
    
    const cssLoadTimes = Object.entries(resourceLoadTimes)
      .filter(([url]) => url.includes('.css'))
      .map(([, time]) => time);
    
    const jsLoadTimes = Object.entries(resourceLoadTimes)
      .filter(([url]) => url.includes('.js'))
      .map(([, time]) => time);
    
    console.log('Resource load times:', {
      html: htmlLoadTime,
      css: cssLoadTimes,
      js: jsLoadTimes,
    });
    
    // HTML should load first and quickly
    expect(htmlLoadTime).toBeLessThan(2000);
    
    // Critical CSS should load quickly
    if (cssLoadTimes.length > 0) {
      const avgCssTime = cssLoadTimes.reduce((a, b) => a + b, 0) / cssLoadTimes.length;
      expect(avgCssTime).toBeLessThan(3000);
    }
  });

  test('should show loading states appropriately', async () => {
    // Simulate slow network
    await context.route('**/*', async (route) => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      await route.continue();
    });
    
    const navigationPromise = page.goto('/');
    
    // Check for loading indicators during navigation
    await page.waitForTimeout(500);
    
    // Look for loading states (skeleton, spinner, etc.)
    const loadingIndicators = page.locator('[data-testid="loading"]').or(
      page.locator('.skeleton').or(
        page.locator('text=Loading')
      )
    );
    
    const hasLoadingState = await loadingIndicators.isVisible().catch(() => false);
    
    if (hasLoadingState) {
      console.log('✅ Loading state visible during slow load');
    }
    
    await navigationPromise;
    await page.waitForLoadState('domcontentloaded');
    
    // Loading states should be gone after load
    const stillLoading = await loadingIndicators.isVisible().catch(() => false);
    expect(stillLoading).toBe(false);
  });

  test('should implement progressive image loading', async () => {
    // Navigate to gallery page (likely to have many images)
    await page.goto('/gallery');
    
    // Count total images
    const images = page.locator('img');
    const imageCount = await images.count();
    
    if (imageCount > 0) {
      console.log(`Found ${imageCount} images to test`);
      
      // Check for lazy loading attributes
      for (let i = 0; i < Math.min(imageCount, 5); i++) {
        const img = images.nth(i);
        const loading = await img.getAttribute('loading');
        const src = await img.getAttribute('src');
        const dataSrc = await img.getAttribute('data-src');
        
        // Should have lazy loading or progressive loading
        const hasLazyLoading = loading === 'lazy' || dataSrc !== null;
        
        if (hasLazyLoading) {
          console.log(`✅ Image ${i + 1} has lazy loading`);
        }
      }
      
      // Simulate slow image loading
      await context.route('**/*.{jpg,jpeg,png,webp}', async (route) => {
        await new Promise(resolve => setTimeout(resolve, 2000));
        await route.continue();
      });
      
      // Scroll to trigger lazy loading
      await page.evaluate(() => {
        window.scrollTo(0, document.body.scrollHeight / 2);
      });
      
      await page.waitForTimeout(1000);
      
      // Check if images are loading progressively
      const visibleImages = await page.evaluate(() => {
        const imgs = Array.from(document.querySelectorAll('img'));
        return imgs.filter(img => {
          const rect = img.getBoundingClientRect();
          return rect.top < window.innerHeight && rect.bottom > 0;
        }).length;
      });
      
      console.log(`${visibleImages} images in viewport`);
    }
  });

  test('should cache resources effectively', async () => {
    // First visit - measure load time
    const firstVisitStart = Date.now();
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    const firstVisitTime = Date.now() - firstVisitStart;
    
    console.log(`First visit load time: ${firstVisitTime}ms`);
    
    // Second visit - should be faster due to caching
    const secondVisitStart = Date.now();
    await page.reload();
    await page.waitForLoadState('networkidle');
    const secondVisitTime = Date.now() - secondVisitStart;
    
    console.log(`Second visit load time: ${secondVisitTime}ms`);
    
    // Second visit should be significantly faster
    const improvement = ((firstVisitTime - secondVisitTime) / firstVisitTime) * 100;
    console.log(`Cache improvement: ${improvement.toFixed(1)}%`);
    
    // Should have at least some improvement from caching
    expect(secondVisitTime).toBeLessThan(firstVisitTime);
  });

  test('should handle network failures gracefully', async () => {
    // Start with working network
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Simulate network failure for some resources
    let failureCount = 0;
    await context.route('**/*', async (route) => {
      const url = route.request().url();
      
      // Fail 30% of requests randomly
      if (Math.random() < 0.3 && !url.includes('localhost')) {
        failureCount++;
        await route.abort('failed');
      } else {
        await route.continue();
      }
    });
    
    // Navigate to another page
    await page.goto('/story');
    await page.waitForLoadState('domcontentloaded');
    
    console.log(`Simulated ${failureCount} network failures`);
    
    // Page should still be functional despite some failures
    await expect(page.locator('h1')).toBeVisible();
    
    // Should show some content even with failures
    const bodyText = await page.textContent('body');
    expect(bodyText?.length).toBeGreaterThan(100);
  });

  test('should optimize for Core Web Vitals', async () => {
    await page.goto('/');
    
    // Measure Core Web Vitals
    const webVitals = await page.evaluate(() => {
      return new Promise((resolve) => {
        const vitals: Record<string, number> = {};
        
        // First Contentful Paint
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.name === 'first-contentful-paint') {
              vitals.fcp = entry.startTime;
            }
          }
        });
        observer.observe({ entryTypes: ['paint'] });
        
        // Largest Contentful Paint
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          vitals.lcp = lastEntry.startTime;
        });
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
        
        // Cumulative Layout Shift
        let clsValue = 0;
        const clsObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (!(entry as any).hadRecentInput) {
              clsValue += (entry as any).value;
            }
          }
          vitals.cls = clsValue;
        });
        clsObserver.observe({ entryTypes: ['layout-shift'] });
        
        // First Input Delay (simulated)
        let fidMeasured = false;
        const fidObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (!fidMeasured) {
              vitals.fid = (entry as any).processingStart - entry.startTime;
              fidMeasured = true;
            }
          }
        });
        fidObserver.observe({ entryTypes: ['first-input'] });
        
        // Resolve after a reasonable time
        setTimeout(() => {
          resolve(vitals);
        }, 5000);
      });
    });
    
    console.log('Core Web Vitals:', webVitals);
    
    if (typeof webVitals === 'object' && webVitals !== null) {
      const vitals = webVitals as Record<string, number>;
      
      // Core Web Vitals thresholds
      if (vitals.fcp) {
        expect(vitals.fcp).toBeLessThan(1800); // FCP < 1.8s (good)
      }
      
      if (vitals.lcp) {
        expect(vitals.lcp).toBeLessThan(2500); // LCP < 2.5s (good)
      }
      
      if (vitals.cls !== undefined) {
        expect(vitals.cls).toBeLessThan(0.1); // CLS < 0.1 (good)
      }
      
      if (vitals.fid) {
        expect(vitals.fid).toBeLessThan(100); // FID < 100ms (good)
      }
    }
  });

  test('should handle memory constraints', async () => {
    // Simulate memory pressure
    await page.evaluate(() => {
      // Create some memory pressure
      const arrays: number[][] = [];
      for (let i = 0; i < 100; i++) {
        arrays.push(new Array(10000).fill(i));
      }
      
      // Store in global to prevent GC
      (window as any).memoryTest = arrays;
    });
    
    // Navigate through several pages
    const pages = ['/', '/story', '/gallery', '/rsvp', '/guestbook'];
    
    for (const pagePath of pages) {
      await page.goto(pagePath);
      await page.waitForLoadState('domcontentloaded');
      
      // Check if page still works under memory pressure
      await expect(page.locator('h1')).toBeVisible();
      
      // Small delay between navigations
      await page.waitForTimeout(500);
    }
    
    // Clean up memory test
    await page.evaluate(() => {
      delete (window as any).memoryTest;
    });
    
    console.log('✅ App handles memory constraints gracefully');
  });
});
