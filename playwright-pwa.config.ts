import { defineConfig, devices } from '@playwright/test';

/**
 * PWA-specific Playwright configuration
 * Optimized for testing Progressive Web App features
 */
export default defineConfig({
  testDir: './tests/e2e',
  testMatch: '**/pwa-*.spec.ts',
  
  /* Run tests in files in parallel */
  fullyParallel: true,
  
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    ['html', { outputFolder: 'test-results/pwa-html-report' }],
    ['json', { outputFile: 'test-results/pwa-results.json' }],
    ['junit', { outputFile: 'test-results/pwa-junit.xml' }],
    ['list'],
  ],
  
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
    
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
    
    /* Take screenshot on failure */
    screenshot: 'only-on-failure',
    
    /* Record video on failure */
    video: 'retain-on-failure',
    
    /* PWA-specific settings */
    permissions: ['notifications', 'geolocation'],
    
    /* Ignore HTTPS errors for local testing */
    ignoreHTTPSErrors: true,
    
    /* Extra HTTP headers */
    extraHTTPHeaders: {
      'Accept-Language': 'en-US,en;q=0.9',
    },
  },

  /* Configure projects for major browsers and devices */
  projects: [
    // Desktop browsers
    {
      name: 'Desktop Chrome',
      use: { 
        ...devices['Desktop Chrome'],
        // Enable service worker and PWA features
        contextOptions: {
          permissions: ['notifications'],
        },
      },
    },
    {
      name: 'Desktop Firefox',
      use: { 
        ...devices['Desktop Firefox'],
        contextOptions: {
          permissions: ['notifications'],
        },
      },
    },
    {
      name: 'Desktop Safari',
      use: { 
        ...devices['Desktop Safari'],
        contextOptions: {
          permissions: ['notifications'],
        },
      },
    },
    
    // Mobile devices
    {
      name: 'Mobile Chrome',
      use: { 
        ...devices['Pixel 5'],
        contextOptions: {
          permissions: ['notifications'],
        },
      },
    },
    {
      name: 'Mobile Safari',
      use: { 
        ...devices['iPhone 12'],
        contextOptions: {
          permissions: ['notifications'],
        },
      },
    },
    
    // Tablet
    {
      name: 'Tablet',
      use: { 
        ...devices['iPad Pro'],
        contextOptions: {
          permissions: ['notifications'],
        },
      },
    },
    
    // PWA-specific test configurations
    {
      name: 'PWA Offline',
      use: {
        ...devices['Desktop Chrome'],
        contextOptions: {
          permissions: ['notifications'],
          offline: false, // Will be controlled in tests
        },
      },
      testMatch: '**/pwa-offline.spec.ts',
    },
    
    {
      name: 'PWA Performance',
      use: {
        ...devices['Desktop Chrome'],
        contextOptions: {
          permissions: ['notifications'],
        },
        // Slow down network for performance testing
        launchOptions: {
          args: ['--disable-web-security', '--disable-features=VizDisplayCompositor'],
        },
      },
      testMatch: '**/pwa-performance.spec.ts',
    },
    
    {
      name: 'PWA Installation',
      use: {
        ...devices['Desktop Chrome'],
        contextOptions: {
          permissions: ['notifications'],
        },
        // Enable install prompt
        launchOptions: {
          args: ['--disable-web-security'],
        },
      },
      testMatch: '**/pwa-installation.spec.ts',
    },
  ],

  /* Global setup and teardown */
  globalSetup: require.resolve('./tests/setup/pwa-global-setup.ts'),
  globalTeardown: require.resolve('./tests/setup/pwa-global-teardown.ts'),

  /* Run your local dev server before starting the tests */
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000, // 2 minutes
  },

  /* Test timeout */
  timeout: 60 * 1000, // 1 minute per test

  /* Expect timeout */
  expect: {
    timeout: 10 * 1000, // 10 seconds for assertions
  },
});
