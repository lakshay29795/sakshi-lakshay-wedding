/**
 * Image Optimization Utilities
 * 
 * This module provides comprehensive image optimization including modern formats,
 * responsive images, lazy loading, and performance monitoring.
 */

import { ImageProps } from 'next/image';

// Types for image optimization
export interface OptimizedImageProps extends Omit<ImageProps, 'src'> {
  src: string;
  alt: string;
  priority?: boolean;
  lazy?: boolean;
  responsive?: boolean;
  formats?: ('webp' | 'avif' | 'jpeg' | 'png')[];
  quality?: number;
  blur?: boolean;
  placeholder?: 'blur' | 'empty';
  onLoad?: () => void;
  onError?: (error: Error) => void;
}

export interface ImageMetrics {
  src: string;
  loadTime: number;
  size: number;
  format: string;
  dimensions: { width: number; height: number };
  compressionRatio: number;
}

export interface ResponsiveImageConfig {
  breakpoints: { name: string; width: number }[];
  sizes: string;
  formats: string[];
  quality: number;
}

/**
 * Image format detector and optimizer
 */
export class ImageOptimizer {
  private static instance: ImageOptimizer;
  private metrics: Map<string, ImageMetrics> = new Map();
  private loadingImages = new Set<string>();
  
  static getInstance(): ImageOptimizer {
    if (!ImageOptimizer.instance) {
      ImageOptimizer.instance = new ImageOptimizer();
    }
    return ImageOptimizer.instance;
  }
  
  /**
   * Detect optimal image format based on browser support
   */
  detectOptimalFormat(): 'avif' | 'webp' | 'jpeg' {
    if (typeof window === 'undefined') return 'jpeg';
    
    // Check AVIF support
    if (this.supportsFormat('avif')) {
      return 'avif';
    }
    
    // Check WebP support
    if (this.supportsFormat('webp')) {
      return 'webp';
    }
    
    // Fallback to JPEG
    return 'jpeg';
  }
  
  /**
   * Check if browser supports a specific image format
   */
  private supportsFormat(format: string): boolean {
    if (typeof window === 'undefined') return false;
    
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    
    try {
      const dataURL = canvas.toDataURL(`image/${format}`);
      return dataURL.indexOf(`data:image/${format}`) === 0;
    } catch {
      return false;
    }
  }
  
  /**
   * Generate responsive image configuration
   */
  generateResponsiveConfig(baseWidth: number, baseHeight: number): ResponsiveImageConfig {
    const aspectRatio = baseWidth / baseHeight;
    
    const breakpoints = [
      { name: 'mobile', width: 640 },
      { name: 'tablet', width: 768 },
      { name: 'desktop', width: 1024 },
      { name: 'large', width: 1280 },
      { name: 'xl', width: 1920 },
    ];
    
    // Generate sizes string for responsive images
    const sizes = breakpoints
      .map((bp, index) => {
        if (index === breakpoints.length - 1) {
          return `${bp.width}px`;
        }
        return `(max-width: ${bp.width}px) ${bp.width}px`;
      })
      .join(', ');
    
    return {
      breakpoints,
      sizes,
      formats: ['avif', 'webp', 'jpeg'],
      quality: 85,
    };
  }
  
  /**
   * Optimize image URL with format and quality parameters
   */
  optimizeImageUrl(
    src: string,
    width?: number,
    height?: number,
    format?: string,
    quality = 85
  ): string {
    if (!src) return '';
    
    // If it's already a Next.js optimized image URL, return as is
    if (src.includes('/_next/image')) {
      return src;
    }
    
    // Build optimization parameters
    const params = new URLSearchParams();
    
    if (width) params.set('w', width.toString());
    if (height) params.set('h', height.toString());
    if (format) params.set('f', format);
    if (quality !== 85) params.set('q', quality.toString());
    
    // For external images, use Next.js image optimization
    const optimizedUrl = `/_next/image?url=${encodeURIComponent(src)}&${params.toString()}`;
    
    return optimizedUrl;
  }
  
  /**
   * Generate srcSet for responsive images
   */
  generateSrcSet(src: string, widths: number[], format?: string): string {
    const optimalFormat = format || this.detectOptimalFormat();
    
    return widths
      .map(width => {
        const optimizedUrl = this.optimizeImageUrl(src, width, undefined, optimalFormat);
        return `${optimizedUrl} ${width}w`;
      })
      .join(', ');
  }
  
  /**
   * Preload critical images
   */
  preloadImage(src: string, priority = false): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.loadingImages.has(src)) {
        return resolve();
      }
      
      this.loadingImages.add(src);
      const startTime = performance.now();
      
      const img = new Image();
      
      img.onload = () => {
        const loadTime = performance.now() - startTime;
        
        // Track metrics
        this.metrics.set(src, {
          src,
          loadTime,
          size: 0, // Would need to be calculated from response headers
          format: this.getImageFormat(src),
          dimensions: { width: img.naturalWidth, height: img.naturalHeight },
          compressionRatio: 0, // Would need original size to calculate
        });
        
        this.loadingImages.delete(src);
        resolve();
      };
      
      img.onerror = () => {
        this.loadingImages.delete(src);
        reject(new Error(`Failed to load image: ${src}`));
      };
      
      // Set priority for critical images
      if (priority) {
        img.loading = 'eager';
        img.fetchPriority = 'high';
      }
      
      img.src = src;
    });
  }
  
  /**
   * Get image format from URL or file extension
   */
  private getImageFormat(src: string): string {
    const url = new URL(src, window.location.origin);
    const pathname = url.pathname.toLowerCase();
    
    if (pathname.includes('.avif')) return 'avif';
    if (pathname.includes('.webp')) return 'webp';
    if (pathname.includes('.png')) return 'png';
    if (pathname.includes('.gif')) return 'gif';
    if (pathname.includes('.svg')) return 'svg';
    
    return 'jpeg'; // Default
  }
  
  /**
   * Get performance metrics for loaded images
   */
  getMetrics(): ImageMetrics[] {
    return Array.from(this.metrics.values());
  }
  
  /**
   * Generate performance report
   */
  generatePerformanceReport(): {
    totalImages: number;
    averageLoadTime: number;
    formatDistribution: Record<string, number>;
    recommendations: string[];
  } {
    const metrics = this.getMetrics();
    const totalImages = metrics.length;
    
    if (totalImages === 0) {
      return {
        totalImages: 0,
        averageLoadTime: 0,
        formatDistribution: {},
        recommendations: [],
      };
    }
    
    const averageLoadTime = metrics.reduce((sum, m) => sum + m.loadTime, 0) / totalImages;
    
    const formatDistribution = metrics.reduce((acc, m) => {
      acc[m.format] = (acc[m.format] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const recommendations: string[] = [];
    
    // Analyze and provide recommendations
    if (averageLoadTime > 1000) {
      recommendations.push('Average image load time is high - consider optimizing image sizes');
    }
    
    if (formatDistribution.jpeg > formatDistribution.webp + formatDistribution.avif) {
      recommendations.push('Consider using modern formats (WebP/AVIF) for better compression');
    }
    
    const largeImages = metrics.filter(m => m.loadTime > 2000);
    if (largeImages.length > 0) {
      recommendations.push(`${largeImages.length} images are loading slowly - consider lazy loading`);
    }
    
    return {
      totalImages,
      averageLoadTime,
      formatDistribution,
      recommendations,
    };
  }
}

/**
 * Lazy loading utilities
 */
export class LazyImageLoader {
  private static observer: IntersectionObserver | null = null;
  private static loadedImages = new Set<string>();
  
  /**
   * Initialize intersection observer for lazy loading
   */
  static initialize(): void {
    if (typeof window === 'undefined' || this.observer) return;
    
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement;
            this.loadImage(img);
            this.observer?.unobserve(img);
          }
        });
      },
      {
        rootMargin: '50px', // Start loading 50px before image enters viewport
        threshold: 0.1,
      }
    );
  }
  
  /**
   * Observe an image for lazy loading
   */
  static observe(img: HTMLImageElement): void {
    if (!this.observer) {
      this.initialize();
    }
    
    this.observer?.observe(img);
  }
  
  /**
   * Load an image
   */
  private static loadImage(img: HTMLImageElement): void {
    const src = img.dataset.src;
    const srcset = img.dataset.srcset;
    
    if (src && !this.loadedImages.has(src)) {
      img.src = src;
      this.loadedImages.add(src);
    }
    
    if (srcset) {
      img.srcset = srcset;
    }
    
    img.classList.remove('lazy');
    img.classList.add('loaded');
  }
  
  /**
   * Cleanup observer
   */
  static cleanup(): void {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
  }
}

/**
 * Image blur placeholder generator
 */
export class BlurPlaceholderGenerator {
  /**
   * Generate a blur data URL for placeholder
   */
  static generateBlurDataURL(width = 8, height = 8, color = '#f3f4f6'): string {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return '';
    
    // Create gradient for more realistic blur effect
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, color);
    gradient.addColorStop(1, this.adjustBrightness(color, -10));
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    
    return canvas.toDataURL('image/jpeg', 0.1);
  }
  
  /**
   * Adjust color brightness
   */
  private static adjustBrightness(color: string, amount: number): string {
    const hex = color.replace('#', '');
    const r = Math.max(0, Math.min(255, parseInt(hex.substr(0, 2), 16) + amount));
    const g = Math.max(0, Math.min(255, parseInt(hex.substr(2, 2), 16) + amount));
    const b = Math.max(0, Math.min(255, parseInt(hex.substr(4, 2), 16) + amount));
    
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  }
  
  /**
   * Generate blur placeholder from image
   */
  static async generateFromImage(src: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }
        
        // Small canvas for blur effect
        canvas.width = 8;
        canvas.height = 8;
        
        // Draw scaled down image
        ctx.drawImage(img, 0, 0, 8, 8);
        
        // Apply blur filter
        ctx.filter = 'blur(1px)';
        ctx.drawImage(canvas, 0, 0);
        
        resolve(canvas.toDataURL('image/jpeg', 0.1));
      };
      
      img.onerror = () => {
        // Fallback to default blur placeholder
        resolve(this.generateBlurDataURL());
      };
      
      img.src = src;
    });
  }
}

/**
 * Image compression utilities
 */
export class ImageCompressor {
  /**
   * Compress image file
   */
  static async compressImage(
    file: File,
    quality = 0.8,
    maxWidth = 1920,
    maxHeight = 1080
  ): Promise<File> {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }
      
      img.onload = () => {
        // Calculate new dimensions
        let { width, height } = img;
        
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
        
        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }
        
        canvas.width = width;
        canvas.height = height;
        
        // Draw and compress
        ctx.drawImage(img, 0, 0, width, height);
        
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Compression failed'));
              return;
            }
            
            const compressedFile = new File([blob], file.name, {
              type: 'image/jpeg',
              lastModified: Date.now(),
            });
            
            resolve(compressedFile);
          },
          'image/jpeg',
          quality
        );
      };
      
      img.onerror = () => {
        reject(new Error('Failed to load image'));
      };
      
      img.src = URL.createObjectURL(file);
    });
  }
  
  /**
   * Get optimal compression settings based on image characteristics
   */
  static getOptimalSettings(
    width: number,
    height: number,
    fileSize: number
  ): { quality: number; maxWidth: number; maxHeight: number } {
    const megapixels = (width * height) / 1000000;
    const fileSizeMB = fileSize / (1024 * 1024);
    
    let quality = 0.85;
    let maxWidth = width;
    let maxHeight = height;
    
    // Adjust quality based on file size
    if (fileSizeMB > 5) {
      quality = 0.7;
    } else if (fileSizeMB > 2) {
      quality = 0.8;
    }
    
    // Adjust dimensions based on megapixels
    if (megapixels > 8) {
      maxWidth = 2560;
      maxHeight = 1440;
    } else if (megapixels > 4) {
      maxWidth = 1920;
      maxHeight = 1080;
    }
    
    return { quality, maxWidth, maxHeight };
  }
}

// Export singleton instances
export const imageOptimizer = ImageOptimizer.getInstance();
export const lazyImageLoader = LazyImageLoader;
export const blurPlaceholderGenerator = BlurPlaceholderGenerator;
export const imageCompressor = ImageCompressor;
