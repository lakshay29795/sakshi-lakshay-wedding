#!/usr/bin/env node

/**
 * Comprehensive Admin Testing Script
 * 
 * This script runs all admin-related tests including:
 * - Unit tests for authentication and authorization
 * - Integration tests for admin APIs
 * - Security vulnerability assessments
 * - Real-time update verification
 * - End-to-end workflow tests
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

// Test suites configuration
const testSuites = {
  unit: {
    name: 'Unit Tests',
    description: 'Authentication, authorization, and component tests',
    command: 'npm',
    args: ['test', '--', '--testPathPattern=admin', '--coverage', '--verbose'],
    timeout: 120000, // 2 minutes
  },
  integration: {
    name: 'Integration Tests',
    description: 'API endpoints and database integration tests',
    command: 'npm',
    args: ['test', '--', '--testPathPattern=admin.*\\.test\\.ts$', '--runInBand'],
    timeout: 180000, // 3 minutes
  },
  security: {
    name: 'Security Tests',
    description: 'Vulnerability assessments and security validation',
    command: 'npm',
    args: ['test', '--', '--testPathPattern=security', '--verbose'],
    timeout: 300000, // 5 minutes
  },
  realtime: {
    name: 'Real-time Tests',
    description: 'Real-time update and WebSocket functionality',
    command: 'npm',
    args: ['test', '--', '--testPathPattern=realtime', '--verbose'],
    timeout: 120000, // 2 minutes
  },
  e2e: {
    name: 'End-to-End Tests',
    description: 'Complete admin workflow testing',
    command: 'npx',
    args: ['playwright', 'test', 'tests/e2e/admin-workflow.spec.ts', '--reporter=html'],
    timeout: 600000, // 10 minutes
  },
};

// Performance benchmarks
const performanceBenchmarks = {
  loginTime: 2000, // 2 seconds
  dashboardLoadTime: 3000, // 3 seconds
  apiResponseTime: 1000, // 1 second
  bulkOperationTime: 5000, // 5 seconds
};

// Security checks
const securityChecks = [
  'CSRF token validation',
  'XSS prevention',
  'SQL injection prevention',
  'Rate limiting',
  'Session security',
  'Input sanitization',
  'Error message security',
  'Authentication bypass attempts',
];

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

async function checkPrerequisites() {
  logStep('Checking prerequisites...');

  // Check if Node.js is installed
  try {
    await runCommand('node', ['--version']);
    logSuccess('Node.js is installed');
  } catch (error) {
    logError('Node.js is not installed or not in PATH');
    process.exit(1);
  }

  // Check if npm is installed
  try {
    await runCommand('npm', ['--version']);
    logSuccess('npm is installed');
  } catch (error) {
    logError('npm is not installed or not in PATH');
    process.exit(1);
  }

  // Check if dependencies are installed
  if (!fs.existsSync(path.join(process.cwd(), 'node_modules'))) {
    logWarning('Dependencies not installed. Installing...');
    try {
      await runCommand('npm', ['install'], { timeout: 300000 });
      logSuccess('Dependencies installed');
    } catch (error) {
      logError('Failed to install dependencies');
      process.exit(1);
    }
  } else {
    logSuccess('Dependencies are installed');
  }

  // Check if Playwright browsers are installed
  try {
    await runCommand('npx', ['playwright', '--version']);
    logSuccess('Playwright is available');
  } catch (error) {
    logWarning('Playwright browsers not installed. Installing...');
    try {
      await runCommand('npx', ['playwright', 'install'], { timeout: 300000 });
      logSuccess('Playwright browsers installed');
    } catch (error) {
      logError('Failed to install Playwright browsers');
      process.exit(1);
    }
  }
}

async function runTestSuite(suiteKey, suite) {
  logStep(`Running ${suite.name}...`);
  log(`Description: ${suite.description}`, colors.magenta);

  const startTime = Date.now();

  try {
    const result = await runCommand(suite.command, suite.args, {
      timeout: suite.timeout,
      verbose: process.argv.includes('--verbose'),
    });

    const duration = Date.now() - startTime;
    logSuccess(`${suite.name} completed in ${duration}ms`);

    return {
      suite: suiteKey,
      success: true,
      duration,
      output: result.stdout,
      error: null,
    };
  } catch (error) {
    const duration = Date.now() - startTime;
    logError(`${suite.name} failed after ${duration}ms`);
    logError(error.message);

    return {
      suite: suiteKey,
      success: false,
      duration,
      output: null,
      error: error.message,
    };
  }
}

async function generateTestReport(results) {
  logStep('Generating test report...');

  const reportDir = path.join(process.cwd(), 'test-results', 'admin');
  if (!fs.existsSync(reportDir)) {
    fs.mkdirSync(reportDir, { recursive: true });
  }

  const report = {
    timestamp: new Date().toISOString(),
    summary: {
      total: results.length,
      passed: results.filter(r => r.success).length,
      failed: results.filter(r => r.success === false).length,
      totalDuration: results.reduce((sum, r) => sum + r.duration, 0),
    },
    results,
    performanceBenchmarks,
    securityChecks,
  };

  // Generate JSON report
  const jsonReportPath = path.join(reportDir, 'admin-test-report.json');
  fs.writeFileSync(jsonReportPath, JSON.stringify(report, null, 2));

  // Generate HTML report
  const htmlReport = generateHtmlReport(report);
  const htmlReportPath = path.join(reportDir, 'admin-test-report.html');
  fs.writeFileSync(htmlReportPath, htmlReport);

  logSuccess(`Test report generated: ${htmlReportPath}`);
  return report;
}

function generateHtmlReport(report) {
  const { summary, results } = report;
  const passRate = ((summary.passed / summary.total) * 100).toFixed(1);

  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Testing Report</title>
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
        .metric.passed .value { color: #28a745; }
        .metric.failed .value { color: #dc3545; }
        .metric.duration .value { color: #007bff; }
        .metric.rate .value { color: #6f42c1; }
        .results { padding: 0 30px 30px; }
        .test-suite { margin-bottom: 20px; border: 1px solid #dee2e6; border-radius: 8px; overflow: hidden; }
        .test-suite-header { padding: 15px 20px; background: #f8f9fa; border-bottom: 1px solid #dee2e6; display: flex; justify-content: space-between; align-items: center; }
        .test-suite-header h3 { margin: 0; }
        .status { padding: 4px 12px; border-radius: 20px; font-size: 0.8em; font-weight: bold; text-transform: uppercase; }
        .status.passed { background: #d4edda; color: #155724; }
        .status.failed { background: #f8d7da; color: #721c24; }
        .test-suite-body { padding: 20px; }
        .duration { color: #6c757d; font-size: 0.9em; }
        .error { background: #f8f9fa; border-left: 4px solid #dc3545; padding: 15px; margin-top: 15px; font-family: monospace; font-size: 0.9em; }
        .security-checks { margin-top: 30px; padding: 20px; background: #f8f9fa; border-radius: 8px; }
        .security-checks h3 { margin-top: 0; color: #495057; }
        .security-checks ul { columns: 2; column-gap: 30px; }
        .security-checks li { margin-bottom: 8px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Admin Testing Report</h1>
            <p>Generated on ${new Date(report.timestamp).toLocaleString()}</p>
        </div>
        
        <div class="summary">
            <div class="metric passed">
                <h3>Passed</h3>
                <div class="value">${summary.passed}</div>
            </div>
            <div class="metric failed">
                <h3>Failed</h3>
                <div class="value">${summary.failed}</div>
            </div>
            <div class="metric duration">
                <h3>Duration</h3>
                <div class="value">${(summary.totalDuration / 1000).toFixed(1)}s</div>
            </div>
            <div class="metric rate">
                <h3>Pass Rate</h3>
                <div class="value">${passRate}%</div>
            </div>
        </div>
        
        <div class="results">
            <h2>Test Results</h2>
            ${results.map(result => `
                <div class="test-suite">
                    <div class="test-suite-header">
                        <h3>${testSuites[result.suite]?.name || result.suite}</h3>
                        <div>
                            <span class="status ${result.success ? 'passed' : 'failed'}">
                                ${result.success ? 'Passed' : 'Failed'}
                            </span>
                            <span class="duration">${(result.duration / 1000).toFixed(1)}s</span>
                        </div>
                    </div>
                    <div class="test-suite-body">
                        <p>${testSuites[result.suite]?.description || 'No description available'}</p>
                        ${result.error ? `<div class="error">${result.error}</div>` : ''}
                    </div>
                </div>
            `).join('')}
        </div>
        
        <div class="security-checks">
            <h3>Security Validation Checklist</h3>
            <ul>
                ${securityChecks.map(check => `<li>${check}</li>`).join('')}
            </ul>
        </div>
    </div>
</body>
</html>
  `;
}

async function main() {
  logHeader('Admin Testing Suite');
  log('Comprehensive testing for admin functionality, security, and performance\n');

  const startTime = Date.now();
  const results = [];

  try {
    // Check prerequisites
    await checkPrerequisites();

    // Get test suites to run
    const suitesToRun = process.argv.includes('--suite') 
      ? [process.argv[process.argv.indexOf('--suite') + 1]]
      : Object.keys(testSuites);

    // Run test suites
    for (const suiteKey of suitesToRun) {
      if (!testSuites[suiteKey]) {
        logWarning(`Unknown test suite: ${suiteKey}`);
        continue;
      }

      const result = await runTestSuite(suiteKey, testSuites[suiteKey]);
      results.push(result);

      // Stop on first failure if --fail-fast is specified
      if (!result.success && process.argv.includes('--fail-fast')) {
        logError('Stopping due to --fail-fast flag');
        break;
      }
    }

    // Generate report
    const report = await generateTestReport(results);

    // Summary
    const totalDuration = Date.now() - startTime;
    logHeader('Test Summary');
    log(`Total Duration: ${(totalDuration / 1000).toFixed(1)}s`);
    log(`Test Suites: ${report.summary.total}`);
    log(`Passed: ${report.summary.passed}`, colors.green);
    log(`Failed: ${report.summary.failed}`, report.summary.failed > 0 ? colors.red : colors.green);
    log(`Pass Rate: ${((report.summary.passed / report.summary.total) * 100).toFixed(1)}%`);

    // Exit with appropriate code
    process.exit(report.summary.failed > 0 ? 1 : 0);

  } catch (error) {
    logError(`Testing failed: ${error.message}`);
    process.exit(1);
  }
}

// Handle CLI arguments
if (process.argv.includes('--help') || process.argv.includes('-h')) {
  console.log(`
Admin Testing Suite

Usage: node scripts/test-admin.js [options]

Options:
  --suite <name>    Run specific test suite (unit|integration|security|realtime|e2e)
  --verbose         Show detailed output
  --fail-fast       Stop on first failure
  --help, -h        Show this help message

Examples:
  node scripts/test-admin.js                    # Run all test suites
  node scripts/test-admin.js --suite security   # Run only security tests
  node scripts/test-admin.js --verbose          # Run with detailed output
  node scripts/test-admin.js --fail-fast        # Stop on first failure
  `);
  process.exit(0);
}

// Run the main function
main().catch(error => {
  logError(`Unexpected error: ${error.message}`);
  process.exit(1);
});
