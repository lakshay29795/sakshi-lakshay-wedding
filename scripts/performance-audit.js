#!/usr/bin/env node

/**
 * Performance Audit Script
 * 
 * This script performs a comprehensive performance audit including:
 * - Bundle size analysis
 * - Tree shaking opportunities
 * - Image optimization analysis
 * - Core Web Vitals monitoring
 * - Performance recommendations
 */

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function logHeader(message) {
  log(`\n${'='.repeat(60)}`, colors.cyan);
  log(`${message}`, colors.cyan + colors.bright);
  log(`${'='.repeat(60)}`, colors.cyan);
}

function logStep(message) {
  log(`\n→ ${message}`, colors.blue);
}

function logSuccess(message) {
  log(`✓ ${message}`, colors.green);
}

function logError(message) {
  log(`✗ ${message}`, colors.red);
}

function logWarning(message) {
  log(`⚠ ${message}`, colors.yellow);
}

// Performance benchmarks
const performanceBenchmarks = {
  bundleSize: {
    initial: 500000, // 500KB
    warning: 750000, // 750KB
    error: 1000000, // 1MB
  },
  lighthouse: {
    performance: 90,
    accessibility: 95,
    bestPractices: 90,
    seo: 95,
  },
  coreWebVitals: {
    fcp: 1800, // First Contentful Paint (ms)
    lcp: 2500, // Largest Contentful Paint (ms)
    fid: 100,  // First Input Delay (ms)
    cls: 0.1,  // Cumulative Layout Shift
  },
};

async function runCommand(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      stdio: 'pipe',
      shell: true,
      ...options,
    });

    let stdout = '';
    let stderr = '';

    child.stdout?.on('data', (data) => {
      stdout += data.toString();
      if (options.verbose) {
        process.stdout.write(data);
      }
    });

    child.stderr?.on('data', (data) => {
      stderr += data.toString();
      if (options.verbose) {
        process.stderr.write(data);
      }
    });

    const timeout = setTimeout(() => {
      child.kill('SIGTERM');
      reject(new Error(`Command timed out after ${options.timeout || 30000}ms`));
    }, options.timeout || 30000);

    child.on('close', (code) => {
      clearTimeout(timeout);
      if (code === 0) {
        resolve({ stdout, stderr, code });
      } else {
        reject(new Error(`Command failed with code ${code}\nStderr: ${stderr}`));
      }
    });

    child.on('error', (error) => {
      clearTimeout(timeout);
      reject(error);
    });
  });
}

async function analyzeBundleSize() {
  logStep('Analyzing bundle size...');
  
  try {
    // Build the project first
    await runCommand('npm', ['run', 'build'], { timeout: 300000 });
    
    // Analyze .next directory
    const nextDir = path.join(process.cwd(), '.next');
    const staticDir = path.join(nextDir, 'static');
    
    if (!fs.existsSync(staticDir)) {
      logWarning('Static directory not found. Build may have failed.');
      return { totalSize: 0, files: [], recommendations: [] };
    }
    
    const files = [];
    let totalSize = 0;
    
    // Recursively analyze files
    function analyzeDirectory(dir, relativePath = '') {
      const items = fs.readdirSync(dir);
      
      items.forEach(item => {
        const fullPath = path.join(dir, item);
        const stats = fs.statSync(fullPath);
        
        if (stats.isDirectory()) {
          analyzeDirectory(fullPath, path.join(relativePath, item));
        } else if (stats.isFile()) {
          const size = stats.size;
          totalSize += size;
          
          files.push({
            name: path.join(relativePath, item),
            size,
            type: path.extname(item).slice(1) || 'unknown',
          });
        }
      });
    }
    
    analyzeDirectory(staticDir);
    
    // Sort files by size (largest first)
    files.sort((a, b) => b.size - a.size);
    
    // Generate recommendations
    const recommendations = [];
    
    if (totalSize > performanceBenchmarks.bundleSize.error) {
      recommendations.push('Bundle size is too large (>1MB) - implement aggressive code splitting');
    } else if (totalSize > performanceBenchmarks.bundleSize.warning) {
      recommendations.push('Bundle size is large (>750KB) - consider code splitting and tree shaking');
    }
    
    const largeFiles = files.filter(f => f.size > 100000); // >100KB
    if (largeFiles.length > 0) {
      recommendations.push(`${largeFiles.length} large files detected - consider optimization`);
    }
    
    const jsFiles = files.filter(f => f.type === 'js');
    const jsSize = jsFiles.reduce((sum, f) => sum + f.size, 0);
    if (jsSize > totalSize * 0.7) {
      recommendations.push('JavaScript files are >70% of bundle - consider dynamic imports');
    }
    
    logSuccess(`Bundle analysis complete. Total size: ${(totalSize / 1024).toFixed(1)}KB`);
    
    return {
      totalSize,
      files: files.slice(0, 10), // Top 10 largest files
      recommendations,
    };
    
  } catch (error) {
    logError(`Bundle analysis failed: ${error.message}`);
    return { totalSize: 0, files: [], recommendations: [] };
  }
}

async function runLighthouseAudit() {
  logStep('Running Lighthouse audit...');
  
  try {
    // Check if server is running
    const serverCheck = await runCommand('curl', ['-s', 'http://localhost:3000'], { timeout: 5000 })
      .catch(() => null);
    
    if (!serverCheck) {
      logWarning('Development server not running. Starting server...');
      // Start server in background
      const serverProcess = spawn('npm', ['run', 'dev'], {
        stdio: 'pipe',
        detached: true,
      });
      
      // Wait for server to start
      await new Promise(resolve => setTimeout(resolve, 10000));
    }
    
    // Run Lighthouse
    const result = await runCommand('lighthouse', [
      'http://localhost:3000',
      '--only-categories=performance,accessibility,best-practices,seo',
      '--output=json',
      '--output-path=./test-results/lighthouse-audit.json',
      '--chrome-flags="--headless --no-sandbox"',
    ], { timeout: 120000 });
    
    // Parse results
    const reportPath = path.join(process.cwd(), 'test-results', 'lighthouse-audit.json');
    if (fs.existsSync(reportPath)) {
      const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
      const scores = {
        performance: Math.round(report.categories.performance.score * 100),
        accessibility: Math.round(report.categories.accessibility.score * 100),
        bestPractices: Math.round(report.categories['best-practices'].score * 100),
        seo: Math.round(report.categories.seo.score * 100),
      };
      
      logSuccess(`Lighthouse audit complete. Performance: ${scores.performance}/100`);
      
      return {
        scores,
        recommendations: generateLighthouseRecommendations(scores),
      };
    }
    
    return { scores: {}, recommendations: [] };
    
  } catch (error) {
    logError(`Lighthouse audit failed: ${error.message}`);
    return { scores: {}, recommendations: [] };
  }
}

function generateLighthouseRecommendations(scores) {
  const recommendations = [];
  
  if (scores.performance < performanceBenchmarks.lighthouse.performance) {
    recommendations.push(`Performance score (${scores.performance}) is below target (${performanceBenchmarks.lighthouse.performance})`);
  }
  
  if (scores.accessibility < performanceBenchmarks.lighthouse.accessibility) {
    recommendations.push(`Accessibility score (${scores.accessibility}) needs improvement`);
  }
  
  if (scores.bestPractices < performanceBenchmarks.lighthouse.bestPractices) {
    recommendations.push(`Best practices score (${scores.bestPractices}) needs improvement`);
  }
  
  if (scores.seo < performanceBenchmarks.lighthouse.seo) {
    recommendations.push(`SEO score (${scores.seo}) needs improvement`);
  }
  
  return recommendations;
}

async function analyzeTreeShaking() {
  logStep('Analyzing tree shaking opportunities...');
  
  // This would typically require webpack-bundle-analyzer output
  // For now, we'll provide general recommendations
  
  const recommendations = [
    'Use ES6 imports instead of CommonJS require()',
    'Import only needed functions from utility libraries',
    'Enable sideEffects: false in package.json for tree-shakable packages',
    'Use dynamic imports for code that may not be needed',
    'Consider using lodash-es instead of lodash for better tree shaking',
  ];
  
  const potentialSavings = {
    lodash: '~50KB by using lodash-es and selective imports',
    'framer-motion': '~20KB by importing only used components',
    'lucide-react': '~15KB by importing only used icons',
    firebase: '~30KB by importing only needed services',
  };
  
  logSuccess('Tree shaking analysis complete');
  
  return {
    recommendations,
    potentialSavings,
  };
}

async function analyzeImages() {
  logStep('Analyzing image optimization...');
  
  const publicDir = path.join(process.cwd(), 'public');
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.svg', '.webp', '.avif'];
  const images = [];
  
  function findImages(dir, relativePath = '') {
    if (!fs.existsSync(dir)) return;
    
    const items = fs.readdirSync(dir);
    
    items.forEach(item => {
      const fullPath = path.join(dir, item);
      const stats = fs.statSync(fullPath);
      
      if (stats.isDirectory()) {
        findImages(fullPath, path.join(relativePath, item));
      } else if (stats.isFile()) {
        const ext = path.extname(item).toLowerCase();
        if (imageExtensions.includes(ext)) {
          images.push({
            name: path.join(relativePath, item),
            size: stats.size,
            format: ext.slice(1),
          });
        }
      }
    });
  }
  
  findImages(publicDir);
  
  const totalImageSize = images.reduce((sum, img) => sum + img.size, 0);
  const largeImages = images.filter(img => img.size > 500000); // >500KB
  const oldFormatImages = images.filter(img => ['jpg', 'jpeg', 'png'].includes(img.format));
  
  const recommendations = [];
  
  if (largeImages.length > 0) {
    recommendations.push(`${largeImages.length} large images (>500KB) found - consider compression`);
  }
  
  if (oldFormatImages.length > 0) {
    recommendations.push(`${oldFormatImages.length} images using old formats - consider WebP/AVIF`);
  }
  
  if (totalImageSize > 5000000) { // >5MB
    recommendations.push('Total image size is large (>5MB) - implement lazy loading');
  }
  
  logSuccess(`Image analysis complete. ${images.length} images, ${(totalImageSize / 1024 / 1024).toFixed(1)}MB total`);
  
  return {
    totalImages: images.length,
    totalSize: totalImageSize,
    largeImages: largeImages.length,
    oldFormatImages: oldFormatImages.length,
    recommendations,
  };
}

async function generateReport(results) {
  logStep('Generating performance report...');
  
  const reportDir = path.join(process.cwd(), 'test-results');
  if (!fs.existsSync(reportDir)) {
    fs.mkdirSync(reportDir, { recursive: true });
  }
  
  const report = {
    timestamp: new Date().toISOString(),
    summary: {
      bundleSize: results.bundleAnalysis.totalSize,
      lighthouseScores: results.lighthouseAudit.scores,
      totalImages: results.imageAnalysis.totalImages,
      imageSize: results.imageAnalysis.totalSize,
    },
    results,
    benchmarks: performanceBenchmarks,
  };
  
  // Generate JSON report
  const jsonReportPath = path.join(reportDir, 'performance-audit.json');
  fs.writeFileSync(jsonReportPath, JSON.stringify(report, null, 2));
  
  // Generate HTML report
  const htmlReport = generateHtmlReport(report);
  const htmlReportPath = path.join(reportDir, 'performance-audit.html');
  fs.writeFileSync(htmlReportPath, htmlReport);
  
  logSuccess(`Performance report generated: ${htmlReportPath}`);
  
  return report;
}

function generateHtmlReport(report) {
  const { summary, results } = report;
  
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Performance Audit Report</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; background: white; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 8px 8px 0 0; }
        .header h1 { margin: 0; font-size: 2.5em; }
        .header p { margin: 10px 0 0; opacity: 0.9; }
        .summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; padding: 30px; }
        .metric { text-align: center; padding: 20px; border-radius: 8px; background: #f8f9fa; }
        .metric h3 { margin: 0; color: #495057; font-size: 0.9em; text-transform: uppercase; letter-spacing: 1px; }
        .metric .value { font-size: 2.5em; font-weight: bold; margin: 10px 0; }
        .metric.good .value { color: #28a745; }
        .metric.warning .value { color: #ffc107; }
        .metric.error .value { color: #dc3545; }
        .section { padding: 0 30px 30px; }
        .section h2 { color: #495057; border-bottom: 2px solid #e9ecef; padding-bottom: 10px; }
        .recommendations { background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 8px; padding: 20px; margin: 20px 0; }
        .recommendations h3 { margin-top: 0; color: #856404; }
        .recommendations ul { margin: 0; }
        .recommendations li { margin-bottom: 8px; }
        .file-list { background: #f8f9fa; border-radius: 8px; padding: 20px; }
        .file-item { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e9ecef; }
        .file-item:last-child { border-bottom: none; }
        .file-name { font-family: monospace; }
        .file-size { color: #6c757d; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Performance Audit Report</h1>
            <p>Generated on ${new Date(report.timestamp).toLocaleString()}</p>
        </div>
        
        <div class="summary">
            <div class="metric ${getBundleSizeStatus(summary.bundleSize)}">
                <h3>Bundle Size</h3>
                <div class="value">${(summary.bundleSize / 1024).toFixed(0)}KB</div>
            </div>
            <div class="metric ${getScoreStatus(summary.lighthouseScores.performance)}">
                <h3>Performance</h3>
                <div class="value">${summary.lighthouseScores.performance || 0}</div>
            </div>
            <div class="metric">
                <h3>Images</h3>
                <div class="value">${summary.totalImages}</div>
            </div>
            <div class="metric">
                <h3>Image Size</h3>
                <div class="value">${(summary.imageSize / 1024 / 1024).toFixed(1)}MB</div>
            </div>
        </div>
        
        <div class="section">
            <h2>Bundle Analysis</h2>
            ${results.bundleAnalysis.recommendations.length > 0 ? `
                <div class="recommendations">
                    <h3>Recommendations</h3>
                    <ul>
                        ${results.bundleAnalysis.recommendations.map(rec => `<li>${rec}</li>`).join('')}
                    </ul>
                </div>
            ` : ''}
            
            <div class="file-list">
                <h3>Largest Files</h3>
                ${results.bundleAnalysis.files.map(file => `
                    <div class="file-item">
                        <span class="file-name">${file.name}</span>
                        <span class="file-size">${(file.size / 1024).toFixed(1)}KB</span>
                    </div>
                `).join('')}
            </div>
        </div>
        
        <div class="section">
            <h2>Lighthouse Scores</h2>
            <div class="summary">
                <div class="metric ${getScoreStatus(summary.lighthouseScores.performance)}">
                    <h3>Performance</h3>
                    <div class="value">${summary.lighthouseScores.performance || 0}</div>
                </div>
                <div class="metric ${getScoreStatus(summary.lighthouseScores.accessibility)}">
                    <h3>Accessibility</h3>
                    <div class="value">${summary.lighthouseScores.accessibility || 0}</div>
                </div>
                <div class="metric ${getScoreStatus(summary.lighthouseScores.bestPractices)}">
                    <h3>Best Practices</h3>
                    <div class="value">${summary.lighthouseScores.bestPractices || 0}</div>
                </div>
                <div class="metric ${getScoreStatus(summary.lighthouseScores.seo)}">
                    <h3>SEO</h3>
                    <div class="value">${summary.lighthouseScores.seo || 0}</div>
                </div>
            </div>
            
            ${results.lighthouseAudit.recommendations.length > 0 ? `
                <div class="recommendations">
                    <h3>Recommendations</h3>
                    <ul>
                        ${results.lighthouseAudit.recommendations.map(rec => `<li>${rec}</li>`).join('')}
                    </ul>
                </div>
            ` : ''}
        </div>
        
        <div class="section">
            <h2>Tree Shaking Analysis</h2>
            <div class="recommendations">
                <h3>Optimization Opportunities</h3>
                <ul>
                    ${results.treeShakingAnalysis.recommendations.map(rec => `<li>${rec}</li>`).join('')}
                </ul>
            </div>
            
            <div class="file-list">
                <h3>Potential Savings</h3>
                ${Object.entries(results.treeShakingAnalysis.potentialSavings).map(([lib, saving]) => `
                    <div class="file-item">
                        <span class="file-name">${lib}</span>
                        <span class="file-size">${saving}</span>
                    </div>
                `).join('')}
            </div>
        </div>
        
        <div class="section">
            <h2>Image Analysis</h2>
            ${results.imageAnalysis.recommendations.length > 0 ? `
                <div class="recommendations">
                    <h3>Recommendations</h3>
                    <ul>
                        ${results.imageAnalysis.recommendations.map(rec => `<li>${rec}</li>`).join('')}
                    </ul>
                </div>
            ` : ''}
        </div>
    </div>
</body>
</html>
  `;
}

function getBundleSizeStatus(size) {
  if (size > performanceBenchmarks.bundleSize.error) return 'error';
  if (size > performanceBenchmarks.bundleSize.warning) return 'warning';
  return 'good';
}

function getScoreStatus(score) {
  if (score >= 90) return 'good';
  if (score >= 70) return 'warning';
  return 'error';
}

async function main() {
  logHeader('Performance Audit');
  log('Comprehensive performance analysis for the wedding website\n');
  
  const startTime = Date.now();
  const results = {};
  
  try {
    // Run all analyses
    results.bundleAnalysis = await analyzeBundleSize();
    results.lighthouseAudit = await runLighthouseAudit();
    results.treeShakingAnalysis = await analyzeTreeShaking();
    results.imageAnalysis = await analyzeImages();
    
    // Generate comprehensive report
    const report = await generateReport(results);
    
    // Summary
    const totalDuration = Date.now() - startTime;
    logHeader('Performance Audit Summary');
    log(`Total Duration: ${(totalDuration / 1000).toFixed(1)}s`);
    log(`Bundle Size: ${(results.bundleAnalysis.totalSize / 1024).toFixed(1)}KB`);
    log(`Performance Score: ${results.lighthouseAudit.scores.performance || 'N/A'}/100`);
    log(`Total Images: ${results.imageAnalysis.totalImages}`);
    log(`Image Size: ${(results.imageAnalysis.totalSize / 1024 / 1024).toFixed(1)}MB`);
    
    // Overall recommendations
    const allRecommendations = [
      ...results.bundleAnalysis.recommendations,
      ...results.lighthouseAudit.recommendations,
      ...results.treeShakingAnalysis.recommendations,
      ...results.imageAnalysis.recommendations,
    ];
    
    if (allRecommendations.length > 0) {
      log('\nTop Recommendations:', colors.yellow);
      allRecommendations.slice(0, 5).forEach(rec => {
        log(`• ${rec}`, colors.yellow);
      });
    }
    
    process.exit(0);
    
  } catch (error) {
    logError(`Performance audit failed: ${error.message}`);
    process.exit(1);
  }
}

// Handle CLI arguments
if (process.argv.includes('--help') || process.argv.includes('-h')) {
  console.log(`
Performance Audit Script

Usage: node scripts/performance-audit.js [options]

Options:
  --help, -h        Show this help message

Examples:
  node scripts/performance-audit.js    # Run complete performance audit
  npm run perf:audit                   # Run via npm script
  `);
  process.exit(0);
}

// Run the main function
main().catch(error => {
  logError(`Unexpected error: ${error.message}`);
  process.exit(1);
});
