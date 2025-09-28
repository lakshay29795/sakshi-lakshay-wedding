/**
 * Tree Shaking and Bundle Optimization Utilities
 * 
 * This module provides utilities for optimizing bundle size through tree shaking,
 * dead code elimination, and selective imports.
 */

// Types for tree shaking analysis
export interface ModuleUsage {
  moduleName: string;
  importedFunctions: string[];
  usedFunctions: string[];
  unusedFunctions: string[];
  size: number;
  treeshakable: boolean;
}

export interface BundleOptimizationReport {
  totalSize: number;
  optimizedSize: number;
  savings: number;
  savingsPercentage: number;
  recommendations: string[];
  moduleAnalysis: ModuleUsage[];
}

/**
 * Tree shaking optimizer
 */
export class TreeShakingOptimizer {
  private static instance: TreeShakingOptimizer;
  private moduleUsage = new Map<string, ModuleUsage>();
  
  static getInstance(): TreeShakingOptimizer {
    if (!TreeShakingOptimizer.instance) {
      TreeShakingOptimizer.instance = new TreeShakingOptimizer();
    }
    return TreeShakingOptimizer.instance;
  }
  
  /**
   * Analyze module usage and provide optimization recommendations
   */
  analyzeModuleUsage(): BundleOptimizationReport {
    const modules = this.getKnownModules();
    const moduleAnalysis: ModuleUsage[] = [];
    let totalSize = 0;
    let optimizedSize = 0;
    
    modules.forEach(module => {
      const usage = this.analyzeModule(module);
      moduleAnalysis.push(usage);
      totalSize += usage.size;
      
      // Calculate optimized size (only used functions)
      const usageRatio = usage.usedFunctions.length / usage.importedFunctions.length;
      optimizedSize += usage.size * usageRatio;
    });
    
    const savings = totalSize - optimizedSize;
    const savingsPercentage = totalSize > 0 ? (savings / totalSize) * 100 : 0;
    
    const recommendations = this.generateRecommendations(moduleAnalysis);
    
    return {
      totalSize,
      optimizedSize,
      savings,
      savingsPercentage,
      recommendations,
      moduleAnalysis,
    };
  }
  
  /**
   * Get known modules that can be optimized
   */
  private getKnownModules(): string[] {
    return [
      'lodash',
      'date-fns',
      'rxjs',
      'framer-motion',
      'lucide-react',
      '@radix-ui/react-checkbox',
      '@radix-ui/react-label',
      '@radix-ui/react-select',
      '@radix-ui/react-slot',
      '@radix-ui/react-switch',
      '@radix-ui/react-dropdown-menu',
      'react-hook-form',
      '@hookform/resolvers',
      'zod',
      'firebase',
      'next',
    ];
  }
  
  /**
   * Analyze individual module usage
   */
  private analyzeModule(moduleName: string): ModuleUsage {
    // This would typically be done by analyzing the actual bundle
    // For now, we'll provide known optimizations for common libraries
    
    const moduleOptimizations = this.getModuleOptimizations();
    const optimization = moduleOptimizations[moduleName];
    
    if (!optimization) {
      return {
        moduleName,
        importedFunctions: [],
        usedFunctions: [],
        unusedFunctions: [],
        size: 0,
        treeshakable: false,
      };
    }
    
    return {
      moduleName,
      importedFunctions: optimization.availableFunctions,
      usedFunctions: optimization.usedFunctions,
      unusedFunctions: optimization.availableFunctions.filter(
        fn => !optimization.usedFunctions.includes(fn)
      ),
      size: optimization.estimatedSize,
      treeshakable: optimization.treeshakable,
    };
  }
  
  /**
   * Get known module optimizations
   */
  private getModuleOptimizations(): Record<string, {
    availableFunctions: string[];
    usedFunctions: string[];
    estimatedSize: number;
    treeshakable: boolean;
  }> {
    return {
      'lodash': {
        availableFunctions: ['debounce', 'throttle', 'cloneDeep', 'merge', 'pick', 'omit', 'get', 'set'],
        usedFunctions: ['debounce', 'cloneDeep'], // Based on actual usage in the app
        estimatedSize: 70000, // ~70KB
        treeshakable: false, // Regular lodash is not tree-shakable
      },
      'date-fns': {
        availableFunctions: ['format', 'parseISO', 'isValid', 'addDays', 'subDays', 'differenceInDays'],
        usedFunctions: ['format', 'parseISO', 'isValid'],
        estimatedSize: 15000, // ~15KB
        treeshakable: true,
      },
      'framer-motion': {
        availableFunctions: ['motion', 'AnimatePresence', 'useAnimation', 'useInView', 'useScroll'],
        usedFunctions: ['motion', 'AnimatePresence', 'useInView'],
        estimatedSize: 45000, // ~45KB
        treeshakable: true,
      },
      'lucide-react': {
        availableFunctions: ['Heart', 'User', 'Calendar', 'Image', 'Mail', 'Phone', 'MapPin'],
        usedFunctions: ['Heart', 'User', 'Calendar', 'Image', 'Mail'],
        estimatedSize: 25000, // ~25KB
        treeshakable: true,
      },
      'firebase': {
        availableFunctions: ['auth', 'firestore', 'storage', 'messaging', 'analytics'],
        usedFunctions: ['auth', 'firestore', 'messaging'],
        estimatedSize: 120000, // ~120KB
        treeshakable: true,
      },
    };
  }
  
  /**
   * Generate optimization recommendations
   */
  private generateRecommendations(moduleAnalysis: ModuleUsage[]): string[] {
    const recommendations: string[] = [];
    
    moduleAnalysis.forEach(module => {
      if (!module.treeshakable && module.unusedFunctions.length > 0) {
        recommendations.push(
          `Replace ${module.moduleName} with tree-shakable alternative (e.g., lodash-es instead of lodash)`
        );
      }
      
      if (module.unusedFunctions.length > module.usedFunctions.length) {
        recommendations.push(
          `${module.moduleName}: ${module.unusedFunctions.length} unused functions detected - consider selective imports`
        );
      }
      
      if (module.size > 50000 && module.unusedFunctions.length > 0) {
        recommendations.push(
          `${module.moduleName} is large (${(module.size / 1024).toFixed(1)}KB) - optimize imports to reduce bundle size`
        );
      }
    });
    
    // General recommendations
    recommendations.push(
      'Use dynamic imports for non-critical code',
      'Enable tree shaking in webpack configuration',
      'Use babel-plugin-import for UI libraries',
      'Consider using smaller alternatives for heavy libraries'
    );
    
    return recommendations;
  }
  
  /**
   * Generate optimized import statements
   */
  generateOptimizedImports(): Record<string, string[]> {
    return {
      // Instead of: import _ from 'lodash'
      'lodash-es': [
        "import { debounce } from 'lodash-es'",
        "import { cloneDeep } from 'lodash-es'",
      ],
      
      // Instead of: import * as dateFns from 'date-fns'
      'date-fns': [
        "import { format } from 'date-fns'",
        "import { parseISO } from 'date-fns'",
        "import { isValid } from 'date-fns'",
      ],
      
      // Optimized Framer Motion imports
      'framer-motion': [
        "import { motion, AnimatePresence } from 'framer-motion'",
        "import { useInView } from 'framer-motion'",
      ],
      
      // Optimized Lucide React imports
      'lucide-react': [
        "import { Heart, User, Calendar, Image, Mail } from 'lucide-react'",
      ],
      
      // Optimized Firebase imports
      'firebase': [
        "import { initializeApp } from 'firebase/app'",
        "import { getAuth } from 'firebase/auth'",
        "import { getFirestore } from 'firebase/firestore'",
        "import { getMessaging } from 'firebase/messaging'",
      ],
    };
  }
}

/**
 * Bundle size analyzer
 */
export class BundleSizeAnalyzer {
  /**
   * Analyze bundle composition
   */
  static analyzeBundleComposition(): {
    chunks: Array<{
      name: string;
      size: number;
      type: 'vendor' | 'app' | 'runtime';
      modules: string[];
    }>;
    totalSize: number;
    recommendations: string[];
  } {
    // This would typically come from webpack-bundle-analyzer
    // For now, we'll provide estimated analysis
    
    const chunks = [
      {
        name: 'runtime',
        size: 5000, // ~5KB
        type: 'runtime' as const,
        modules: ['webpack/runtime'],
      },
      {
        name: 'vendors',
        size: 250000, // ~250KB
        type: 'vendor' as const,
        modules: ['react', 'react-dom', 'next', 'framer-motion', 'firebase'],
      },
      {
        name: 'app',
        size: 150000, // ~150KB
        type: 'app' as const,
        modules: ['pages', 'components', 'lib', 'hooks'],
      },
    ];
    
    const totalSize = chunks.reduce((sum, chunk) => sum + chunk.size, 0);
    
    const recommendations = [
      'Consider code splitting for the app chunk',
      'Vendor chunk is large - consider splitting into smaller chunks',
      'Use dynamic imports for non-critical features',
    ];
    
    return {
      chunks,
      totalSize,
      recommendations,
    };
  }
  
  /**
   * Generate size budget recommendations
   */
  static generateSizeBudget(): {
    budgets: Array<{
      type: string;
      maximumWarning: number;
      maximumError: number;
    }>;
    current: Array<{
      type: string;
      size: number;
      status: 'ok' | 'warning' | 'error';
    }>;
  } {
    const budgets = [
      { type: 'initial', maximumWarning: 500000, maximumError: 1000000 }, // 500KB warning, 1MB error
      { type: 'anyComponentStyle', maximumWarning: 2000, maximumError: 4000 }, // 2KB warning, 4KB error
      { type: 'anyScript', maximumWarning: 100000, maximumError: 200000 }, // 100KB warning, 200KB error
    ];
    
    const analysis = this.analyzeBundleComposition();
    const current = [
      {
        type: 'initial',
        size: analysis.totalSize,
        status: analysis.totalSize > 1000000 ? 'error' : analysis.totalSize > 500000 ? 'warning' : 'ok' as const,
      },
    ];
    
    return { budgets, current };
  }
}

/**
 * Dead code elimination utilities
 */
export class DeadCodeEliminator {
  /**
   * Identify potentially unused code
   */
  static identifyUnusedCode(): {
    unusedFiles: string[];
    unusedExports: string[];
    unusedImports: string[];
    recommendations: string[];
  } {
    // This would typically be done by analyzing the actual codebase
    // For now, we'll provide a framework for analysis
    
    const unusedFiles = [
      // Files that might not be imported anywhere
    ];
    
    const unusedExports = [
      // Exports that are never imported
    ];
    
    const unusedImports = [
      // Imports that are never used
    ];
    
    const recommendations = [
      'Use tools like webpack-bundle-analyzer to identify unused code',
      'Enable tree shaking in your build configuration',
      'Use ESLint rules to detect unused variables and imports',
      'Consider using tools like unimported to find unused files',
    ];
    
    return {
      unusedFiles,
      unusedExports,
      unusedImports,
      recommendations,
    };
  }
  
  /**
   * Generate ESLint configuration for dead code detection
   */
  static generateESLintConfig(): Record<string, any> {
    return {
      rules: {
        'no-unused-vars': ['error', { 
          vars: 'all',
          args: 'after-used',
          ignoreRestSiblings: false,
        }],
        '@typescript-eslint/no-unused-vars': ['error', {
          vars: 'all',
          args: 'after-used',
          ignoreRestSiblings: false,
        }],
        'import/no-unused-modules': ['error', {
          unusedExports: true,
          src: ['src/**/*'],
          ignoreExports: ['src/pages/**/*', 'src/app/**/*'],
        }],
      },
    };
  }
}

/**
 * Compression optimizer
 */
export class CompressionOptimizer {
  /**
   * Analyze compression opportunities
   */
  static analyzeCompressionOpportunities(): {
    files: Array<{
      name: string;
      originalSize: number;
      gzipSize: number;
      brotliSize: number;
      compressionRatio: number;
    }>;
    recommendations: string[];
  } {
    // This would typically analyze actual build output
    const files = [
      {
        name: 'main.js',
        originalSize: 150000,
        gzipSize: 45000,
        brotliSize: 38000,
        compressionRatio: 0.75,
      },
      {
        name: 'vendors.js',
        originalSize: 250000,
        gzipSize: 85000,
        brotliSize: 72000,
        compressionRatio: 0.71,
      },
      {
        name: 'styles.css',
        originalSize: 25000,
        gzipSize: 6000,
        brotliSize: 5200,
        compressionRatio: 0.79,
      },
    ];
    
    const recommendations = [
      'Enable Brotli compression for better compression ratios',
      'Use gzip as fallback for older browsers',
      'Consider pre-compressing static assets',
      'Optimize CSS and JavaScript for better compression',
    ];
    
    return { files, recommendations };
  }
  
  /**
   * Generate compression configuration
   */
  static generateCompressionConfig(): {
    gzip: Record<string, any>;
    brotli: Record<string, any>;
    precompression: Record<string, any>;
  } {
    return {
      gzip: {
        enabled: true,
        level: 9,
        threshold: 1024,
        fileTypes: ['.js', '.css', '.html', '.svg', '.json'],
      },
      brotli: {
        enabled: true,
        quality: 11,
        threshold: 1024,
        fileTypes: ['.js', '.css', '.html', '.svg', '.json'],
      },
      precompression: {
        enabled: true,
        algorithms: ['gzip', 'brotli'],
        staticAssets: true,
      },
    };
  }
}

// Export singleton instances
export const treeShakingOptimizer = TreeShakingOptimizer.getInstance();
export const bundleSizeAnalyzer = BundleSizeAnalyzer;
export const deadCodeEliminator = DeadCodeEliminator;
export const compressionOptimizer = CompressionOptimizer;
