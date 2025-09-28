/**
 * Bundle Analysis and Optimization Utilities
 * 
 * This module provides utilities for analyzing bundle size, identifying optimization
 * opportunities, and monitoring performance metrics.
 */

// Types for bundle analysis
export interface BundleStats {
  name: string;
  size: number;
  gzipSize: number;
  modules: ModuleStats[];
  chunks: ChunkStats[];
  assets: AssetStats[];
}

export interface ModuleStats {
  name: string;
  size: number;
  chunks: string[];
  reasons: string[];
}

export interface ChunkStats {
  id: string;
  name: string;
  size: number;
  modules: string[];
  parents: string[];
  children: string[];
}

export interface AssetStats {
  name: string;
  size: number;
  type: 'js' | 'css' | 'image' | 'font' | 'other';
  compressed: boolean;
}

export interface PerformanceMetrics {
  bundleLoadTime: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  cumulativeLayoutShift: number;
  firstInputDelay: number;
  totalBlockingTime: number;
}

/**
 * Bundle size analyzer
 */
export class BundleAnalyzer {
  private static instance: BundleAnalyzer;
  private metrics: Map<string, PerformanceMetrics> = new Map();
  
  static getInstance(): BundleAnalyzer {
    if (!BundleAnalyzer.instance) {
      BundleAnalyzer.instance = new BundleAnalyzer();
    }
    return BundleAnalyzer.instance;
  }
  
  /**
   * Analyze bundle composition and suggest optimizations
   */
  analyzeBundles(stats: BundleStats[]): {
    recommendations: string[];
    heavyModules: ModuleStats[];
    duplicateModules: ModuleStats[];
    unusedModules: ModuleStats[];
  } {
    const recommendations: string[] = [];
    const heavyModules: ModuleStats[] = [];
    const duplicateModules: ModuleStats[] = [];
    const unusedModules: ModuleStats[] = [];
    
    // Find heavy modules (> 100KB)
    stats.forEach(bundle => {
      bundle.modules.forEach(module => {
        if (module.size > 100 * 1024) {
          heavyModules.push(module);
        }
      });
    });
    
    // Find duplicate modules
    const moduleMap = new Map<string, ModuleStats[]>();
    stats.forEach(bundle => {
      bundle.modules.forEach(module => {
        if (!moduleMap.has(module.name)) {
          moduleMap.set(module.name, []);
        }
        moduleMap.get(module.name)!.push(module);
      });
    });
    
    moduleMap.forEach((modules, name) => {
      if (modules.length > 1) {
        duplicateModules.push(...modules);
      }
    });
    
    // Generate recommendations
    if (heavyModules.length > 0) {
      recommendations.push(
        `Consider code splitting for ${heavyModules.length} heavy modules (${heavyModules.map(m => m.name).join(', ')})`
      );
    }
    
    if (duplicateModules.length > 0) {
      recommendations.push(
        `${duplicateModules.length} duplicate modules found - consider using splitChunks optimization`
      );
    }
    
    const totalSize = stats.reduce((sum, bundle) => sum + bundle.size, 0);
    if (totalSize > 1024 * 1024) { // > 1MB
      recommendations.push(
        `Total bundle size (${(totalSize / 1024 / 1024).toFixed(2)}MB) is large - consider aggressive code splitting`
      );
    }
    
    return {
      recommendations,
      heavyModules,
      duplicateModules,
      unusedModules,
    };
  }
  
  /**
   * Track performance metrics
   */
  trackMetrics(bundleName: string, metrics: Partial<PerformanceMetrics>): void {
    const existing = this.metrics.get(bundleName) || {} as PerformanceMetrics;
    this.metrics.set(bundleName, { ...existing, ...metrics });
  }
  
  /**
   * Get performance report
   */
  getPerformanceReport(): Record<string, PerformanceMetrics> {
    return Object.fromEntries(this.metrics.entries());
  }
  
  /**
   * Monitor Core Web Vitals
   */
  monitorCoreWebVitals(): void {
    if (typeof window === 'undefined') return;
    
    // First Contentful Paint
    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        if (entry.name === 'first-contentful-paint') {
          this.trackMetrics('core-web-vitals', {
            firstContentfulPaint: entry.startTime,
          });
        }
      });
    }).observe({ entryTypes: ['paint'] });
    
    // Largest Contentful Paint
    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      this.trackMetrics('core-web-vitals', {
        largestContentfulPaint: lastEntry.startTime,
      });
    }).observe({ entryTypes: ['largest-contentful-paint'] });
    
    // Cumulative Layout Shift
    let clsValue = 0;
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries() as any[]) {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
        }
      }
      this.trackMetrics('core-web-vitals', {
        cumulativeLayoutShift: clsValue,
      });
    }).observe({ entryTypes: ['layout-shift'] });
    
    // First Input Delay
    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry: any) => {
        this.trackMetrics('core-web-vitals', {
          firstInputDelay: entry.processingStart - entry.startTime,
        });
      });
    }).observe({ entryTypes: ['first-input'] });
  }
}

/**
 * Tree shaking analyzer
 */
export class TreeShakingAnalyzer {
  /**
   * Identify unused exports in modules
   */
  static analyzeUnusedExports(moduleExports: Record<string, string[]>): string[] {
    const unusedExports: string[] = [];
    
    // This would typically be integrated with webpack or other bundler
    // For now, we'll provide a framework for analysis
    
    Object.entries(moduleExports).forEach(([moduleName, exports]) => {
      exports.forEach(exportName => {
        // Check if export is used (this would be done by bundler analysis)
        const isUsed = this.isExportUsed(moduleName, exportName);
        if (!isUsed) {
          unusedExports.push(`${moduleName}:${exportName}`);
        }
      });
    });
    
    return unusedExports;
  }
  
  private static isExportUsed(moduleName: string, exportName: string): boolean {
    // Placeholder for actual usage analysis
    // In practice, this would be done by the bundler
    return true;
  }
  
  /**
   * Generate tree shaking report
   */
  static generateTreeShakingReport(): {
    shakableModules: string[];
    recommendations: string[];
  } {
    const shakableModules = [
      'lodash', // Use lodash-es instead
      'moment', // Use date-fns instead
      'rxjs', // Import only needed operators
      'antd', // Use babel-plugin-import
      'material-ui', // Use tree-shakable imports
    ];
    
    const recommendations = [
      'Use ES6 imports instead of CommonJS require()',
      'Import only needed functions from utility libraries',
      'Use babel-plugin-import for UI libraries',
      'Avoid importing entire libraries when only using a few functions',
      'Use dynamic imports for code that may not be needed',
    ];
    
    return {
      shakableModules,
      recommendations,
    };
  }
}

/**
 * Bundle optimization strategies
 */
export class BundleOptimizer {
  /**
   * Generate webpack optimization config
   */
  static generateWebpackOptimization() {
    return {
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          // Vendor chunk for stable third-party libraries
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
            priority: 10,
          },
          // Common chunk for shared code
          common: {
            name: 'common',
            minChunks: 2,
            chunks: 'all',
            priority: 5,
            reuseExistingChunk: true,
          },
          // React chunk
          react: {
            test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
            name: 'react',
            chunks: 'all',
            priority: 20,
          },
          // UI library chunk
          ui: {
            test: /[\\/]node_modules[\\/](@radix-ui|framer-motion|lucide-react)[\\/]/,
            name: 'ui',
            chunks: 'all',
            priority: 15,
          },
          // Firebase chunk
          firebase: {
            test: /[\\/]node_modules[\\/](firebase|@firebase)[\\/]/,
            name: 'firebase',
            chunks: 'all',
            priority: 15,
          },
        },
      },
      runtimeChunk: {
        name: 'runtime',
      },
      moduleIds: 'deterministic',
      chunkIds: 'deterministic',
    };
  }
  
  /**
   * Generate compression strategies
   */
  static generateCompressionConfig() {
    return {
      gzip: {
        enabled: true,
        threshold: 1024, // Only compress files larger than 1KB
        compressionLevel: 9,
        fileExtensions: ['.js', '.css', '.html', '.svg'],
      },
      brotli: {
        enabled: true,
        threshold: 1024,
        quality: 11,
        fileExtensions: ['.js', '.css', '.html', '.svg'],
      },
    };
  }
  
  /**
   * Generate caching strategies
   */
  static generateCachingConfig() {
    return {
      // Long-term caching for static assets
      staticAssets: {
        maxAge: 31536000, // 1 year
        immutable: true,
        filePattern: /\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$/,
      },
      // Short-term caching for HTML
      html: {
        maxAge: 0,
        mustRevalidate: true,
        filePattern: /\.html$/,
      },
      // API caching
      api: {
        maxAge: 300, // 5 minutes
        staleWhileRevalidate: 3600, // 1 hour
        filePattern: /^\/api\//,
      },
    };
  }
}

/**
 * Performance monitoring utilities
 */
export class PerformanceMonitor {
  private static observers: PerformanceObserver[] = [];
  
  /**
   * Start monitoring performance
   */
  static startMonitoring(): void {
    if (typeof window === 'undefined') return;
    
    const analyzer = BundleAnalyzer.getInstance();
    
    // Monitor Core Web Vitals
    analyzer.monitorCoreWebVitals();
    
    // Monitor resource loading
    const resourceObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        if (entry.entryType === 'resource') {
          const resourceEntry = entry as PerformanceResourceTiming;
          console.log(`Resource loaded: ${resourceEntry.name} (${resourceEntry.transferSize} bytes)`);
        }
      });
    });
    
    resourceObserver.observe({ entryTypes: ['resource'] });
    this.observers.push(resourceObserver);
    
    // Monitor long tasks
    if ('PerformanceObserver' in window && 'PerformanceLongTaskTiming' in window) {
      const longTaskObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          console.warn(`Long task detected: ${entry.duration}ms`);
          analyzer.trackMetrics('long-tasks', {
            totalBlockingTime: entry.duration,
          });
        });
      });
      
      longTaskObserver.observe({ entryTypes: ['longtask'] });
      this.observers.push(longTaskObserver);
    }
  }
  
  /**
   * Stop monitoring performance
   */
  static stopMonitoring(): void {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
  }
  
  /**
   * Generate performance report
   */
  static generateReport(): {
    coreWebVitals: PerformanceMetrics;
    recommendations: string[];
  } {
    const analyzer = BundleAnalyzer.getInstance();
    const report = analyzer.getPerformanceReport();
    const coreWebVitals = report['core-web-vitals'] || {} as PerformanceMetrics;
    
    const recommendations: string[] = [];
    
    // Analyze Core Web Vitals and provide recommendations
    if (coreWebVitals.firstContentfulPaint > 1800) {
      recommendations.push('First Contentful Paint is slow - consider optimizing critical rendering path');
    }
    
    if (coreWebVitals.largestContentfulPaint > 2500) {
      recommendations.push('Largest Contentful Paint is slow - optimize largest elements and images');
    }
    
    if (coreWebVitals.cumulativeLayoutShift > 0.1) {
      recommendations.push('Cumulative Layout Shift is high - add size attributes to images and reserve space for dynamic content');
    }
    
    if (coreWebVitals.firstInputDelay > 100) {
      recommendations.push('First Input Delay is high - reduce JavaScript execution time');
    }
    
    return {
      coreWebVitals,
      recommendations,
    };
  }
}

// Export singleton instances
export const bundleAnalyzer = BundleAnalyzer.getInstance();
export const performanceMonitor = PerformanceMonitor;
