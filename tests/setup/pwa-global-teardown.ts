import { FullConfig } from '@playwright/test';
import fs from 'fs';
import path from 'path';

/**
 * Global teardown for PWA tests
 * Cleans up test environment and generates final reports
 */
async function globalTeardown(config: FullConfig) {
  console.log('🧹 Cleaning up PWA test environment...');
  
  const testResultsDir = path.join(process.cwd(), 'test-results');
  const pwaResultsDir = path.join(testResultsDir, 'pwa');
  
  try {
    // Generate test summary
    const setupInfoPath = path.join(pwaResultsDir, 'setup-info.json');
    let setupInfo = {};
    
    if (fs.existsSync(setupInfoPath)) {
      setupInfo = JSON.parse(fs.readFileSync(setupInfoPath, 'utf8'));
    }
    
    // Collect test results if available
    const resultsPath = path.join(testResultsDir, 'pwa-results.json');
    let testResults = {};
    
    if (fs.existsSync(resultsPath)) {
      testResults = JSON.parse(fs.readFileSync(resultsPath, 'utf8'));
    }
    
    // Generate final summary
    const summary = {
      timestamp: new Date().toISOString(),
      setupInfo,
      testResults,
      environment: {
        nodeVersion: process.version,
        platform: process.platform,
        arch: process.arch,
        ci: !!process.env.CI,
      },
    };
    
    // Save final summary
    fs.writeFileSync(
      path.join(pwaResultsDir, 'final-summary.json'),
      JSON.stringify(summary, null, 2)
    );
    
    // Generate simple text report
    const textReport = generateTextReport(summary);
    fs.writeFileSync(
      path.join(pwaResultsDir, 'summary.txt'),
      textReport
    );
    
    console.log('📊 PWA test summary generated');
    console.log(`📁 Results saved to: ${pwaResultsDir}`);
    
    // Clean up temporary files if needed
    const tempFiles = [
      path.join(testResultsDir, 'temp-*'),
    ];
    
    // Note: In a real implementation, you might want to clean up temp files
    // For now, we'll keep all files for debugging
    
    console.log('✅ PWA test environment cleanup complete');
    
  } catch (error) {
    console.error('❌ PWA teardown failed:', error);
    // Don't throw here to avoid masking test failures
  }
}

function generateTextReport(summary: any): string {
  const lines = [
    '='.repeat(60),
    'PWA TEST SUMMARY REPORT',
    '='.repeat(60),
    '',
    `Generated: ${summary.timestamp}`,
    `Environment: ${summary.environment.platform} ${summary.environment.arch}`,
    `Node.js: ${summary.environment.nodeVersion}`,
    `CI: ${summary.environment.ci ? 'Yes' : 'No'}`,
    '',
    'SETUP VALIDATION:',
    '-'.repeat(20),
  ];
  
  if (summary.setupInfo) {
    const setup = summary.setupInfo;
    lines.push(`Base URL: ${setup.baseURL || 'Unknown'}`);
    lines.push(`Manifest: ${setup.hasManifest ? '✅ Present' : '❌ Missing'}`);
    lines.push(`Service Worker: ${setup.hasServiceWorker ? '✅ Available' : '❌ Not Available'}`);
    lines.push(`Secure Context: ${setup.isSecure ? '✅ Yes' : '❌ No'}`);
    
    if (setup.metaTags) {
      lines.push('Meta Tags:');
      lines.push(`  Theme Color: ${setup.metaTags.themeColor ? '✅' : '❌'}`);
      lines.push(`  Viewport: ${setup.metaTags.viewport ? '✅' : '❌'}`);
      lines.push(`  Apple Mobile: ${setup.metaTags.appleMobileCapable ? '✅' : '❌'}`);
    }
  }
  
  lines.push('');
  lines.push('TEST RESULTS:');
  lines.push('-'.repeat(20));
  
  if (summary.testResults && summary.testResults.stats) {
    const stats = summary.testResults.stats;
    lines.push(`Total Tests: ${stats.total || 0}`);
    lines.push(`Passed: ${stats.passed || 0}`);
    lines.push(`Failed: ${stats.failed || 0}`);
    lines.push(`Skipped: ${stats.skipped || 0}`);
    
    if (stats.total > 0) {
      const successRate = Math.round(((stats.passed || 0) / stats.total) * 100);
      lines.push(`Success Rate: ${successRate}%`);
    }
  } else {
    lines.push('No test results available');
  }
  
  lines.push('');
  lines.push('='.repeat(60));
  
  return lines.join('\n');
}

export default globalTeardown;
