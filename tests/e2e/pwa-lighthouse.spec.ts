import { test, expect, type Page } from '@playwright/test';
import { playAudit } from 'playwright-lighthouse';

test.describe('Lighthouse PWA Compliance', () => {
  let page: Page;

  test.beforeEach(async ({ browser }) => {
    const context = await browser.newContext({
      viewport: { width: 1280, height: 720 },
    });
    page = await context.newPage();
  });

  test('should achieve 100% PWA score', async () => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Run Lighthouse audit
    const lighthouseResult = await playAudit({
      page,
      thresholds: {
        pwa: 100,
        performance: 90,
        accessibility: 95,
        'best-practices': 95,
        seo: 95,
      },
      port: 9222,
    });

    console.log('Lighthouse PWA Score:', lighthouseResult.lhr.categories.pwa.score * 100);
    console.log('Lighthouse Performance Score:', lighthouseResult.lhr.categories.performance.score * 100);
    
    // PWA score should be 100%
    expect(lighthouseResult.lhr.categories.pwa.score).toBe(1);
  });

  test('should pass all PWA audits', async () => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Manual PWA audit checks (since Lighthouse might not be available in all environments)
    
    // 1. Web App Manifest
    const manifestLink = page.locator('link[rel="manifest"]');
    await expect(manifestLink).toHaveAttribute('href', '/manifest.json');
    
    const manifestResponse = await page.request.get('/manifest.json');
    expect(manifestResponse.ok()).toBeTruthy();
    
    const manifest = await manifestResponse.json();
    
    // Required manifest fields for PWA
    expect(manifest.name).toBeDefined();
    expect(manifest.short_name).toBeDefined();
    expect(manifest.start_url).toBeDefined();
    expect(manifest.display).toBeDefined();
    expect(manifest.icons).toBeDefined();
    expect(manifest.icons.length).toBeGreaterThan(0);
    
    // Icons should include required sizes
    const iconSizes = manifest.icons.map((icon: any) => icon.sizes);
    expect(iconSizes).toContain('192x192');
    expect(iconSizes).toContain('512x512');
    
    // 2. Service Worker
    const hasServiceWorker = await page.evaluate(() => 'serviceWorker' in navigator);
    expect(hasServiceWorker).toBe(true);
    
    await page.waitForFunction(() => {
      return navigator.serviceWorker.ready;
    });
    
    const swRegistration = await page.evaluate(async () => {
      const registration = await navigator.serviceWorker.ready;
      return {
        active: !!registration.active,
        scope: registration.scope,
      };
    });
    
    expect(swRegistration.active).toBe(true);
    
    // 3. HTTPS (or localhost)
    const url = new URL(page.url());
    const isSecure = url.protocol === 'https:' || url.hostname === 'localhost';
    expect(isSecure).toBe(true);
    
    // 4. Responsive Design
    const viewport = page.viewportSize();
    expect(viewport?.width).toBeGreaterThan(0);
    expect(viewport?.height).toBeGreaterThan(0);
    
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(1000);
    
    // Page should still be usable
    await expect(page.locator('h1')).toBeVisible();
    
    // 5. Theme Color
    const themeColorMeta = page.locator('meta[name="theme-color"]');
    await expect(themeColorMeta).toHaveAttribute('content');
    
    // 6. Viewport Meta Tag
    const viewportMeta = page.locator('meta[name="viewport"]');
    await expect(viewportMeta).toHaveAttribute('content');
    
    console.log('✅ All PWA audit checks passed');
  });

  test('should have optimized performance metrics', async () => {
    await page.goto('/');
    
    // Measure performance metrics
    const performanceMetrics = await page.evaluate(() => {
      return new Promise((resolve) => {
        if ('performance' in window) {
          const observer = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const metrics: Record<string, number> = {};
            
            entries.forEach((entry) => {
              if (entry.entryType === 'navigation') {
                const nav = entry as PerformanceNavigationTiming;
                metrics.domContentLoaded = nav.domContentLoadedEventEnd - nav.domContentLoadedEventStart;
                metrics.loadComplete = nav.loadEventEnd - nav.loadEventStart;
                metrics.firstByte = nav.responseStart - nav.requestStart;
              }
              
              if (entry.entryType === 'paint') {
                if (entry.name === 'first-contentful-paint') {
                  metrics.firstContentfulPaint = entry.startTime;
                }
                if (entry.name === 'largest-contentful-paint') {
                  metrics.largestContentfulPaint = entry.startTime;
                }
              }
            });
            
            resolve(metrics);
          });
          
          observer.observe({ entryTypes: ['navigation', 'paint'] });
          
          // Fallback timeout
          setTimeout(() => {
            const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
            resolve({
              domContentLoaded: navigation ? navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart : 0,
              loadComplete: navigation ? navigation.loadEventEnd - navigation.loadEventStart : 0,
              firstByte: navigation ? navigation.responseStart - navigation.requestStart : 0,
            });
          }, 5000);
        } else {
          resolve({});
        }
      });
    });
    
    console.log('Performance Metrics:', performanceMetrics);
    
    // Performance expectations
    if (typeof performanceMetrics === 'object' && performanceMetrics !== null) {
      const metrics = performanceMetrics as Record<string, number>;
      
      if (metrics.firstContentfulPaint) {
        expect(metrics.firstContentfulPaint).toBeLessThan(3000); // FCP < 3s
      }
      
      if (metrics.largestContentfulPaint) {
        expect(metrics.largestContentfulPaint).toBeLessThan(4000); // LCP < 4s
      }
      
      if (metrics.firstByte) {
        expect(metrics.firstByte).toBeLessThan(1000); // TTFB < 1s
      }
    }
  });

  test('should have proper accessibility features', async () => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Check for accessibility features
    
    // 1. Alt text for images
    const images = page.locator('img');
    const imageCount = await images.count();
    
    for (let i = 0; i < imageCount; i++) {
      const img = images.nth(i);
      const alt = await img.getAttribute('alt');
      const ariaLabel = await img.getAttribute('aria-label');
      
      // Images should have alt text or aria-label
      expect(alt !== null || ariaLabel !== null).toBe(true);
    }
    
    // 2. Proper heading structure
    const h1Count = await page.locator('h1').count();
    expect(h1Count).toBeGreaterThanOrEqual(1);
    
    // 3. Form labels
    const inputs = page.locator('input[type="text"], input[type="email"], textarea');
    const inputCount = await inputs.count();
    
    for (let i = 0; i < Math.min(inputCount, 5); i++) {
      const input = inputs.nth(i);
      const id = await input.getAttribute('id');
      const ariaLabel = await input.getAttribute('aria-label');
      
      if (id) {
        const label = page.locator(`label[for="${id}"]`);
        const hasLabel = await label.count() > 0;
        expect(hasLabel || ariaLabel !== null).toBe(true);
      }
    }
    
    // 4. Focus management
    const focusableElements = page.locator('button, a, input, select, textarea, [tabindex]:not([tabindex="-1"])');
    const focusableCount = await focusableElements.count();
    expect(focusableCount).toBeGreaterThan(0);
    
    console.log('✅ Accessibility checks passed');
  });

  test('should have proper SEO elements', async () => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Check SEO elements
    
    // 1. Title tag
    const title = await page.title();
    expect(title).toBeDefined();
    expect(title.length).toBeGreaterThan(0);
    expect(title.length).toBeLessThan(60); // Optimal title length
    
    // 2. Meta description
    const metaDescription = page.locator('meta[name="description"]');
    await expect(metaDescription).toHaveAttribute('content');
    
    const description = await metaDescription.getAttribute('content');
    expect(description?.length).toBeGreaterThan(120);
    expect(description?.length).toBeLessThan(160); // Optimal description length
    
    // 3. Open Graph tags
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content');
    await expect(page.locator('meta[property="og:description"]')).toHaveAttribute('content');
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content');
    
    // 4. Canonical URL
    const canonicalLink = page.locator('link[rel="canonical"]');
    const hasCanonical = await canonicalLink.count() > 0;
    
    if (hasCanonical) {
      await expect(canonicalLink).toHaveAttribute('href');
    }
    
    // 5. Structured data (if present)
    const structuredData = page.locator('script[type="application/ld+json"]');
    const hasStructuredData = await structuredData.count() > 0;
    
    if (hasStructuredData) {
      const jsonLd = await structuredData.textContent();
      expect(() => JSON.parse(jsonLd || '')).not.toThrow();
    }
    
    console.log('✅ SEO checks passed');
  });

  test('should handle different network conditions', async () => {
    // Test with slow 3G simulation
    await page.route('**/*', async (route) => {
      // Simulate slow network (500ms delay)
      await new Promise(resolve => setTimeout(resolve, 500));
      await route.continue();
    });
    
    const startTime = Date.now();
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    const loadTime = Date.now() - startTime;
    
    // Should still load within reasonable time even on slow network
    expect(loadTime).toBeLessThan(10000); // 10 seconds max
    
    // Content should be visible
    await expect(page.locator('h1')).toBeVisible();
    
    console.log(`✅ Page loaded in ${loadTime}ms on simulated slow network`);
  });
});
