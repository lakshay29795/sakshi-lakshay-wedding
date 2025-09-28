#!/usr/bin/env node

/**
 * PWA Testing Automation Script
 * 
 * This script runs comprehensive PWA tests including:
 * - Installation flow testing
 * - Offline functionality verification
 * - Lighthouse PWA compliance
 * - Performance on slow networks
 * - Cross-browser compatibility
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Configuration
const config = {
  baseUrl: process.env.PWA_TEST_URL || 'http://localhost:3000',
  outputDir: './test-results/pwa',
  browsers: ['chromium', 'firefox', 'webkit'],
  devices: ['Desktop Chrome', 'iPhone 12', 'Pixel 5'],
  lighthouseConfig: {
    performance: 90,
    accessibility: 95,
    'best-practices': 95,
    seo: 95,
    pwa: 100,
  },
};

// Ensure output directory exists
if (!fs.existsSync(config.outputDir)) {
  fs.mkdirSync(config.outputDir, { recursive: true });
}

console.log('🚀 Starting PWA Testing Suite...\n');

// Test results storage
const testResults = {
  timestamp: new Date().toISOString(),
  baseUrl: config.baseUrl,
  results: {},
  summary: {
    total: 0,
    passed: 0,
    failed: 0,
    skipped: 0,
  },
};

/**
 * Run Playwright tests
 */
function runPlaywrightTests() {
  console.log('📋 Running Playwright PWA Tests...');
  
  const testFiles = [
    'tests/e2e/pwa-installation.spec.ts',
    'tests/e2e/pwa-offline.spec.ts',
    'tests/e2e/pwa-performance.spec.ts',
    'tests/e2e/pwa-cross-browser.spec.ts',
  ];
  
  const results = {};
  
  for (const testFile of testFiles) {
    const testName = path.basename(testFile, '.spec.ts');
    console.log(`\n  Running ${testName}...`);
    
    try {
      const output = execSync(
        `npx playwright test ${testFile} --reporter=json`,
        { 
          encoding: 'utf8',
          env: { ...process.env, BASE_URL: config.baseUrl }
        }
      );
      
      const result = JSON.parse(output);
      results[testName] = {
        status: 'passed',
        tests: result.suites?.length || 0,
        passed: result.stats?.passed || 0,
        failed: result.stats?.failed || 0,
        duration: result.stats?.duration || 0,
      };
      
      console.log(`  ✅ ${testName}: ${results[testName].passed} passed, ${results[testName].failed} failed`);
      
    } catch (error) {
      results[testName] = {
        status: 'failed',
        error: error.message,
        tests: 0,
        passed: 0,
        failed: 1,
        duration: 0,
      };
      
      console.log(`  ❌ ${testName}: Failed`);
    }
  }
  
  testResults.results.playwright = results;
  return results;
}

/**
 * Run Lighthouse PWA audit
 */
function runLighthouseAudit() {
  console.log('\n🔍 Running Lighthouse PWA Audit...');
  
  try {
    // Install lighthouse if not present
    try {
      execSync('lighthouse --version', { stdio: 'ignore' });
    } catch {
      console.log('  Installing Lighthouse...');
      execSync('npm install -g lighthouse', { stdio: 'inherit' });
    }
    
    const outputFile = path.join(config.outputDir, 'lighthouse-report.json');
    
    const lighthouseCmd = [
      'lighthouse',
      config.baseUrl,
      '--only-categories=pwa,performance,accessibility,best-practices,seo',
      '--output=json',
      `--output-path=${outputFile}`,
      '--chrome-flags="--headless --no-sandbox"',
      '--quiet',
    ].join(' ');
    
    execSync(lighthouseCmd, { stdio: 'inherit' });
    
    // Parse results
    const report = JSON.parse(fs.readFileSync(outputFile, 'utf8'));
    const categories = report.lhr.categories;
    
    const lighthouseResults = {
      status: 'completed',
      scores: {
        pwa: Math.round(categories.pwa.score * 100),
        performance: Math.round(categories.performance.score * 100),
        accessibility: Math.round(categories.accessibility.score * 100),
        'best-practices': Math.round(categories['best-practices'].score * 100),
        seo: Math.round(categories.seo.score * 100),
      },
      audits: {},
    };
    
    // Extract PWA-specific audit results
    const pwaAudits = [
      'installable-manifest',
      'service-worker',
      'offline-start-url',
      'apple-touch-icon',
      'splash-screen',
      'themed-omnibox',
      'content-width',
      'viewport',
    ];
    
    pwaAudits.forEach(auditId => {
      if (report.lhr.audits[auditId]) {
        lighthouseResults.audits[auditId] = {
          score: report.lhr.audits[auditId].score,
          title: report.lhr.audits[auditId].title,
          description: report.lhr.audits[auditId].description,
        };
      }
    });
    
    // Check if PWA score meets threshold
    const pwaScore = lighthouseResults.scores.pwa;
    const pwaThreshold = config.lighthouseConfig.pwa;
    
    if (pwaScore >= pwaThreshold) {
      console.log(`  ✅ PWA Score: ${pwaScore}/100 (Target: ${pwaThreshold})`);
    } else {
      console.log(`  ❌ PWA Score: ${pwaScore}/100 (Target: ${pwaThreshold})`);
      lighthouseResults.status = 'failed';
    }
    
    // Log other scores
    Object.entries(lighthouseResults.scores).forEach(([category, score]) => {
      if (category !== 'pwa') {
        const threshold = config.lighthouseConfig[category] || 90;
        const status = score >= threshold ? '✅' : '⚠️';
        console.log(`  ${status} ${category}: ${score}/100`);
      }
    });
    
    testResults.results.lighthouse = lighthouseResults;
    return lighthouseResults;
    
  } catch (error) {
    console.log(`  ❌ Lighthouse audit failed: ${error.message}`);
    
    const failedResult = {
      status: 'failed',
      error: error.message,
      scores: {},
    };
    
    testResults.results.lighthouse = failedResult;
    return failedResult;
  }
}

/**
 * Test PWA manifest
 */
function testManifest() {
  console.log('\n📱 Testing Web App Manifest...');
  
  try {
    const manifestUrl = `${config.baseUrl}/manifest.json`;
    const response = execSync(`curl -s "${manifestUrl}"`, { encoding: 'utf8' });
    const manifest = JSON.parse(response);
    
    const requiredFields = [
      'name',
      'short_name',
      'start_url',
      'display',
      'theme_color',
      'background_color',
      'icons',
    ];
    
    const manifestResults = {
      status: 'passed',
      fields: {},
      icons: {},
    };
    
    // Check required fields
    requiredFields.forEach(field => {
      const hasField = manifest[field] !== undefined;
      manifestResults.fields[field] = hasField;
      
      if (hasField) {
        console.log(`  ✅ ${field}: ${typeof manifest[field] === 'object' ? 'present' : manifest[field]}`);
      } else {
        console.log(`  ❌ ${field}: missing`);
        manifestResults.status = 'failed';
      }
    });
    
    // Check icons
    if (manifest.icons && Array.isArray(manifest.icons)) {
      const requiredSizes = ['192x192', '512x512'];
      
      requiredSizes.forEach(size => {
        const hasSize = manifest.icons.some(icon => icon.sizes === size);
        manifestResults.icons[size] = hasSize;
        
        if (hasSize) {
          console.log(`  ✅ Icon ${size}: present`);
        } else {
          console.log(`  ❌ Icon ${size}: missing`);
          manifestResults.status = 'failed';
        }
      });
    }
    
    testResults.results.manifest = manifestResults;
    return manifestResults;
    
  } catch (error) {
    console.log(`  ❌ Manifest test failed: ${error.message}`);
    
    const failedResult = {
      status: 'failed',
      error: error.message,
    };
    
    testResults.results.manifest = failedResult;
    return failedResult;
  }
}

/**
 * Test service worker
 */
function testServiceWorker() {
  console.log('\n⚙️ Testing Service Worker...');
  
  try {
    // Check if service worker file exists
    const swUrls = [
      `${config.baseUrl}/sw.js`,
      `${config.baseUrl}/service-worker.js`,
      `${config.baseUrl}/firebase-messaging-sw.js`,
    ];
    
    const swResults = {
      status: 'failed',
      files: {},
    };
    
    swUrls.forEach(url => {
      try {
        execSync(`curl -s -f "${url}"`, { stdio: 'ignore' });
        swResults.files[url] = true;
        swResults.status = 'passed';
        console.log(`  ✅ Service Worker found: ${url}`);
      } catch {
        swResults.files[url] = false;
      }
    });
    
    if (swResults.status === 'failed') {
      console.log('  ❌ No service worker files found');
    }
    
    testResults.results.serviceWorker = swResults;
    return swResults;
    
  } catch (error) {
    console.log(`  ❌ Service worker test failed: ${error.message}`);
    
    const failedResult = {
      status: 'failed',
      error: error.message,
    };
    
    testResults.results.serviceWorker = failedResult;
    return failedResult;
  }
}

/**
 * Generate test report
 */
function generateReport() {
  console.log('\n📊 Generating Test Report...');
  
  // Calculate summary
  Object.values(testResults.results).forEach(result => {
    if (typeof result === 'object' && result.status) {
      testResults.summary.total++;
      
      if (result.status === 'passed' || result.status === 'completed') {
        testResults.summary.passed++;
      } else if (result.status === 'failed') {
        testResults.summary.failed++;
      } else {
        testResults.summary.skipped++;
      }
    }
  });
  
  // Add Playwright test counts
  if (testResults.results.playwright) {
    Object.values(testResults.results.playwright).forEach(test => {
      testResults.summary.total += test.tests || 0;
      testResults.summary.passed += test.passed || 0;
      testResults.summary.failed += test.failed || 0;
    });
  }
  
  // Generate JSON report
  const reportFile = path.join(config.outputDir, 'pwa-test-report.json');
  fs.writeFileSync(reportFile, JSON.stringify(testResults, null, 2));
  
  // Generate HTML report
  const htmlReport = generateHtmlReport(testResults);
  const htmlFile = path.join(config.outputDir, 'pwa-test-report.html');
  fs.writeFileSync(htmlFile, htmlReport);
  
  console.log(`\n📋 Test Report Generated:`);
  console.log(`  JSON: ${reportFile}`);
  console.log(`  HTML: ${htmlFile}`);
  
  // Print summary
  console.log(`\n📈 Test Summary:`);
  console.log(`  Total Tests: ${testResults.summary.total}`);
  console.log(`  Passed: ${testResults.summary.passed}`);
  console.log(`  Failed: ${testResults.summary.failed}`);
  console.log(`  Skipped: ${testResults.summary.skipped}`);
  
  const successRate = testResults.summary.total > 0 
    ? Math.round((testResults.summary.passed / testResults.summary.total) * 100)
    : 0;
  
  console.log(`  Success Rate: ${successRate}%`);
  
  return successRate;
}

/**
 * Generate HTML report
 */
function generateHtmlReport(results) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PWA Test Report</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .header { background: #f5f5f5; padding: 20px; border-radius: 8px; }
        .summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin: 20px 0; }
        .metric { background: white; padding: 15px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .metric h3 { margin: 0 0 10px 0; color: #333; }
        .metric .value { font-size: 24px; font-weight: bold; }
        .passed { color: #28a745; }
        .failed { color: #dc3545; }
        .warning { color: #ffc107; }
        .results { margin-top: 30px; }
        .test-section { margin: 20px 0; padding: 20px; border: 1px solid #ddd; border-radius: 8px; }
        .test-section h2 { margin-top: 0; }
        .audit-item { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee; }
        .score { font-weight: bold; padding: 4px 8px; border-radius: 4px; }
        .score.high { background: #d4edda; color: #155724; }
        .score.medium { background: #fff3cd; color: #856404; }
        .score.low { background: #f8d7da; color: #721c24; }
    </style>
</head>
<body>
    <div class="header">
        <h1>PWA Test Report</h1>
        <p><strong>Generated:</strong> ${results.timestamp}</p>
        <p><strong>Base URL:</strong> ${results.baseUrl}</p>
    </div>
    
    <div class="summary">
        <div class="metric">
            <h3>Total Tests</h3>
            <div class="value">${results.summary.total}</div>
        </div>
        <div class="metric">
            <h3>Passed</h3>
            <div class="value passed">${results.summary.passed}</div>
        </div>
        <div class="metric">
            <h3>Failed</h3>
            <div class="value failed">${results.summary.failed}</div>
        </div>
        <div class="metric">
            <h3>Success Rate</h3>
            <div class="value">${Math.round((results.summary.passed / results.summary.total) * 100)}%</div>
        </div>
    </div>
    
    <div class="results">
        ${Object.entries(results.results).map(([category, result]) => `
            <div class="test-section">
                <h2>${category.charAt(0).toUpperCase() + category.slice(1)}</h2>
                <div class="audit-item">
                    <span>Status</span>
                    <span class="${result.status === 'passed' || result.status === 'completed' ? 'passed' : 'failed'}">
                        ${result.status}
                    </span>
                </div>
                ${result.scores ? Object.entries(result.scores).map(([metric, score]) => `
                    <div class="audit-item">
                        <span>${metric}</span>
                        <span class="score ${score >= 90 ? 'high' : score >= 70 ? 'medium' : 'low'}">${score}/100</span>
                    </div>
                `).join('') : ''}
                ${result.error ? `<p class="failed">Error: ${result.error}</p>` : ''}
            </div>
        `).join('')}
    </div>
</body>
</html>
  `;
}

/**
 * Main execution
 */
async function main() {
  try {
    // Check if server is running
    try {
      execSync(`curl -s -f "${config.baseUrl}"`, { stdio: 'ignore' });
    } catch {
      console.log(`❌ Server not running at ${config.baseUrl}`);
      console.log('Please start the development server first: npm run dev');
      process.exit(1);
    }
    
    // Run all tests
    const playwrightResults = runPlaywrightTests();
    const lighthouseResults = runLighthouseAudit();
    const manifestResults = testManifest();
    const serviceWorkerResults = testServiceWorker();
    
    // Generate report
    const successRate = generateReport();
    
    console.log('\n🎉 PWA Testing Complete!');
    
    // Exit with appropriate code
    if (successRate >= 90) {
      console.log('✅ PWA tests passed with excellent results!');
      process.exit(0);
    } else if (successRate >= 70) {
      console.log('⚠️ PWA tests passed with some issues to address.');
      process.exit(0);
    } else {
      console.log('❌ PWA tests failed. Please address the issues above.');
      process.exit(1);
    }
    
  } catch (error) {
    console.error('❌ PWA testing failed:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = {
  runPWATests: main,
  config,
};
