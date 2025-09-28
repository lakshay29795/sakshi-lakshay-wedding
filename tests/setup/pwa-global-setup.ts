import { chromium, FullConfig } from '@playwright/test';
import fs from 'fs';
import path from 'path';

/**
 * Global setup for PWA tests
 * Prepares the environment and validates PWA requirements
 */
async function globalSetup(config: FullConfig) {
  console.log('🚀 Setting up PWA test environment...');
  
  // Ensure test results directory exists
  const testResultsDir = path.join(process.cwd(), 'test-results');
  if (!fs.existsSync(testResultsDir)) {
    fs.mkdirSync(testResultsDir, { recursive: true });
  }
  
  // Create PWA-specific directories
  const pwaResultsDir = path.join(testResultsDir, 'pwa');
  if (!fs.existsSync(pwaResultsDir)) {
    fs.mkdirSync(pwaResultsDir, { recursive: true });
  }
  
  const baseURL = config.webServer?.url || 'http://localhost:3000';
  console.log(`📍 Base URL: ${baseURL}`);
  
  // Launch browser for initial setup
  const browser = await chromium.launch();
  const context = await browser.newContext({
    permissions: ['notifications'],
  });
  const page = await context.newPage();
  
  try {
    console.log('🔍 Validating PWA prerequisites...');
    
    // Check if the app is running
    await page.goto(baseURL, { timeout: 30000 });
    console.log('✅ Application is accessible');
    
    // Check for manifest
    const manifestLink = page.locator('link[rel="manifest"]');
    const hasManifest = await manifestLink.count() > 0;
    
    if (hasManifest) {
      const manifestHref = await manifestLink.getAttribute('href');
      const manifestUrl = new URL(manifestHref!, baseURL).toString();
      
      try {
        const manifestResponse = await page.request.get(manifestUrl);
        if (manifestResponse.ok()) {
          const manifest = await manifestResponse.json();
          console.log('✅ Web App Manifest is valid');
          console.log(`   Name: ${manifest.name}`);
          console.log(`   Icons: ${manifest.icons?.length || 0}`);
        } else {
          console.log('⚠️ Web App Manifest is not accessible');
        }
      } catch (error) {
        console.log('⚠️ Failed to fetch manifest:', error);
      }
    } else {
      console.log('⚠️ Web App Manifest not found');
    }
    
    // Check for service worker registration
    await page.waitForTimeout(2000); // Give time for SW registration
    
    const hasServiceWorker = await page.evaluate(() => {
      return 'serviceWorker' in navigator;
    });
    
    if (hasServiceWorker) {
      console.log('✅ Service Worker API is available');
      
      // Check if service worker is registered
      const swRegistered = await page.evaluate(async () => {
        try {
          const registration = await navigator.serviceWorker.ready;
          return !!registration.active;
        } catch {
          return false;
        }
      });
      
      if (swRegistered) {
        console.log('✅ Service Worker is registered and active');
      } else {
        console.log('⚠️ Service Worker is not registered');
      }
    } else {
      console.log('⚠️ Service Worker API not available');
    }
    
    // Check HTTPS or localhost
    const url = new URL(baseURL);
    const isSecure = url.protocol === 'https:' || url.hostname === 'localhost';
    
    if (isSecure) {
      console.log('✅ Secure context (HTTPS or localhost)');
    } else {
      console.log('⚠️ Not a secure context - PWA features may be limited');
    }
    
    // Check for PWA-specific meta tags
    const themeColor = await page.locator('meta[name="theme-color"]').count();
    const viewport = await page.locator('meta[name="viewport"]').count();
    const appleMobileCapable = await page.locator('meta[name="apple-mobile-web-app-capable"]').count();
    
    console.log(`✅ PWA Meta Tags: theme-color(${themeColor}), viewport(${viewport}), apple-mobile-capable(${appleMobileCapable})`);
    
    // Save setup information
    const setupInfo = {
      timestamp: new Date().toISOString(),
      baseURL,
      hasManifest,
      hasServiceWorker,
      isSecure,
      metaTags: {
        themeColor: themeColor > 0,
        viewport: viewport > 0,
        appleMobileCapable: appleMobileCapable > 0,
      },
    };
    
    fs.writeFileSync(
      path.join(pwaResultsDir, 'setup-info.json'),
      JSON.stringify(setupInfo, null, 2)
    );
    
    console.log('✅ PWA test environment setup complete');
    
  } catch (error) {
    console.error('❌ PWA setup failed:', error);
    throw error;
  } finally {
    await context.close();
    await browser.close();
  }
}

export default globalSetup;
