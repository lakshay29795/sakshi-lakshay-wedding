/**
 * CDN and Caching Strategy Implementation
 * 
 * This module provides comprehensive caching strategies including:
 * - CDN configuration and optimization
 * - Browser caching policies
 * - Service worker caching
 * - API response caching
 * - Static asset optimization
 */

// Types for caching configuration
export interface CacheConfig {
  name: string;
  strategy: 'cache-first' | 'network-first' | 'stale-while-revalidate' | 'network-only' | 'cache-only';
  maxAge: number;
  maxEntries?: number;
  networkTimeoutSeconds?: number;
  patterns: string[];
}

export interface CDNConfig {
  provider: 'cloudflare' | 'aws-cloudfront' | 'vercel' | 'netlify' | 'custom';
  domain: string;
  zones: {
    static: string;
    images: string;
    api: string;
  };
  settings: {
    compression: boolean;
    minification: boolean;
    imageOptimization: boolean;
    caching: boolean;
  };
}

export interface CacheMetrics {
  hitRate: number;
  missRate: number;
  totalRequests: number;
  averageResponseTime: number;
  cacheSize: number;
  evictions: number;
}

/**
 * CDN Configuration Manager
 */
export class CDNManager {
  private static instance: CDNManager;
  private config: CDNConfig;
  private metrics: Map<string, CacheMetrics> = new Map();
  
  static getInstance(): CDNManager {
    if (!CDNManager.instance) {
      CDNManager.instance = new CDNManager();
    }
    return CDNManager.instance;
  }
  
  /**
   * Initialize CDN configuration
   */
  initialize(config: CDNConfig): void {
    this.config = config;
    this.setupCDNHeaders();
    this.configureImageOptimization();
  }
  
  /**
   * Get optimized CDN URL for assets
   */
  getCDNUrl(path: string, type: 'static' | 'images' | 'api' = 'static'): string {
    if (!this.config) {
      return path;
    }
    
    const zone = this.config.zones[type];
    if (!zone) {
      return path;
    }
    
    // Remove leading slash if present
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;
    
    return `${zone}/${cleanPath}`;
  }
  
  /**
   * Get optimized image URL with CDN transformations
   */
  getOptimizedImageUrl(
    src: string,
    options: {
      width?: number;
      height?: number;
      quality?: number;
      format?: 'auto' | 'webp' | 'avif' | 'jpeg' | 'png';
      fit?: 'cover' | 'contain' | 'fill' | 'inside' | 'outside';
    } = {}
  ): string {
    const {
      width,
      height,
      quality = 85,
      format = 'auto',
      fit = 'cover',
    } = options;
    
    if (!this.config || !this.config.settings.imageOptimization) {
      return src;
    }
    
    const params = new URLSearchParams();
    
    if (width) params.set('w', width.toString());
    if (height) params.set('h', height.toString());
    if (quality !== 85) params.set('q', quality.toString());
    if (format !== 'auto') params.set('f', format);
    if (fit !== 'cover') params.set('fit', fit);
    
    const baseUrl = this.getCDNUrl(src, 'images');
    return `${baseUrl}?${params.toString()}`;
  }
  
  /**
   * Setup CDN headers for optimal caching
   */
  private setupCDNHeaders(): void {
    if (typeof window !== 'undefined') {
      // Client-side CDN optimization
      this.preconnectToCDN();
      this.setupResourceHints();
    }
  }
  
  /**
   * Preconnect to CDN domains
   */
  private preconnectToCDN(): void {
    const domains = Object.values(this.config.zones);
    
    domains.forEach(domain => {
      const link = document.createElement('link');
      link.rel = 'preconnect';
      link.href = domain;
      link.crossOrigin = 'anonymous';
      document.head.appendChild(link);
    });
  }
  
  /**
   * Setup resource hints for better performance
   */
  private setupResourceHints(): void {
    // DNS prefetch for CDN domains
    Object.values(this.config.zones).forEach(domain => {
      const link = document.createElement('link');
      link.rel = 'dns-prefetch';
      link.href = domain;
      document.head.appendChild(link);
    });
  }
  
  /**
   * Configure image optimization settings
   */
  private configureImageOptimization(): void {
    if (!this.config.settings.imageOptimization) {
      return;
    }
    
    // Set up image optimization based on CDN provider
    switch (this.config.provider) {
      case 'cloudflare':
        this.setupCloudflareImageOptimization();
        break;
      case 'aws-cloudfront':
        this.setupCloudFrontImageOptimization();
        break;
      case 'vercel':
        this.setupVercelImageOptimization();
        break;
      default:
        this.setupGenericImageOptimization();
    }
  }
  
  /**
   * Setup Cloudflare-specific optimizations
   */
  private setupCloudflareImageOptimization(): void {
    // Cloudflare Image Resizing and Polish
    console.log('Configuring Cloudflare image optimization');
  }
  
  /**
   * Setup AWS CloudFront optimizations
   */
  private setupCloudFrontImageOptimization(): void {
    // CloudFront with Lambda@Edge for image optimization
    console.log('Configuring AWS CloudFront image optimization');
  }
  
  /**
   * Setup Vercel optimizations
   */
  private setupVercelImageOptimization(): void {
    // Vercel Image Optimization API
    console.log('Configuring Vercel image optimization');
  }
  
  /**
   * Setup generic optimizations
   */
  private setupGenericImageOptimization(): void {
    console.log('Configuring generic image optimization');
  }
  
  /**
   * Track cache metrics
   */
  trackMetrics(cacheName: string, hit: boolean, responseTime: number): void {
    const existing = this.metrics.get(cacheName) || {
      hitRate: 0,
      missRate: 0,
      totalRequests: 0,
      averageResponseTime: 0,
      cacheSize: 0,
      evictions: 0,
    };
    
    existing.totalRequests++;
    
    if (hit) {
      existing.hitRate = (existing.hitRate * (existing.totalRequests - 1) + 1) / existing.totalRequests;
    } else {
      existing.missRate = (existing.missRate * (existing.totalRequests - 1) + 1) / existing.totalRequests;
    }
    
    existing.averageResponseTime = 
      (existing.averageResponseTime * (existing.totalRequests - 1) + responseTime) / existing.totalRequests;
    
    this.metrics.set(cacheName, existing);
  }
  
  /**
   * Get cache performance metrics
   */
  getMetrics(): Record<string, CacheMetrics> {
    return Object.fromEntries(this.metrics.entries());
  }
}

/**
 * Browser Cache Manager
 */
export class BrowserCacheManager {
  private static cacheConfigs: CacheConfig[] = [
    {
      name: 'static-assets',
      strategy: 'cache-first',
      maxAge: 31536000, // 1 year
      maxEntries: 100,
      patterns: [
        '/_next/static/',
        '/images/',
        '/icons/',
        '/fonts/',
        '*.css',
        '*.js',
        '*.woff2',
        '*.woff',
      ],
    },
    {
      name: 'api-responses',
      strategy: 'network-first',
      maxAge: 300, // 5 minutes
      maxEntries: 50,
      networkTimeoutSeconds: 5,
      patterns: [
        '/api/rsvp',
        '/api/guestbook',
        '/api/analytics',
      ],
    },
    {
      name: 'pages',
      strategy: 'stale-while-revalidate',
      maxAge: 3600, // 1 hour
      maxEntries: 20,
      patterns: [
        '/',
        '/story',
        '/gallery',
        '/rsvp',
        '/guestbook',
      ],
    },
    {
      name: 'images',
      strategy: 'cache-first',
      maxAge: 2592000, // 30 days
      maxEntries: 200,
      patterns: [
        '*.jpg',
        '*.jpeg',
        '*.png',
        '*.webp',
        '*.avif',
        '*.gif',
        '*.svg',
      ],
    },
  ];
  
  /**
   * Get cache configuration for a URL
   */
  static getCacheConfig(url: string): CacheConfig | null {
    return this.cacheConfigs.find(config =>
      config.patterns.some(pattern => {
        if (pattern.includes('*')) {
          const regex = new RegExp(pattern.replace(/\*/g, '.*'));
          return regex.test(url);
        }
        return url.includes(pattern);
      })
    ) || null;
  }
  
  /**
   * Generate cache headers for responses
   */
  static generateCacheHeaders(url: string): Record<string, string> {
    const config = this.getCacheConfig(url);
    
    if (!config) {
      return {
        'Cache-Control': 'no-cache',
      };
    }
    
    const headers: Record<string, string> = {};
    
    switch (config.strategy) {
      case 'cache-first':
        headers['Cache-Control'] = `public, max-age=${config.maxAge}, immutable`;
        break;
      case 'network-first':
        headers['Cache-Control'] = `public, max-age=${config.maxAge}, must-revalidate`;
        break;
      case 'stale-while-revalidate':
        headers['Cache-Control'] = `public, max-age=${config.maxAge}, stale-while-revalidate=${config.maxAge * 2}`;
        break;
      case 'network-only':
        headers['Cache-Control'] = 'no-cache, no-store, must-revalidate';
        break;
      case 'cache-only':
        headers['Cache-Control'] = `public, max-age=${config.maxAge}, only-if-cached`;
        break;
    }
    
    // Add ETag for better cache validation
    headers['ETag'] = `"${Date.now()}"`;
    
    return headers;
  }
  
  /**
   * Setup browser caching policies
   */
  static setupBrowserCaching(): void {
    if (typeof window === 'undefined') return;
    
    // Setup service worker for advanced caching
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then(registration => {
          console.log('Service Worker registered for caching');
        })
        .catch(error => {
          console.error('Service Worker registration failed:', error);
        });
    }
  }
}

/**
 * Service Worker Cache Manager
 */
export class ServiceWorkerCacheManager {
  /**
   * Generate service worker cache configuration
   */
  static generateServiceWorkerConfig(): string {
    const cacheConfigs = BrowserCacheManager['cacheConfigs'];
    
    return `
// Service Worker Cache Configuration
const CACHE_VERSION = 'v1';
const CACHE_CONFIGS = ${JSON.stringify(cacheConfigs, null, 2)};

// Cache names
const CACHE_NAMES = {
  ${cacheConfigs.map(config => `'${config.name}': '${config.name}-' + CACHE_VERSION`).join(',\n  ')}
};

// Install event
self.addEventListener('install', event => {
  event.waitUntil(
    Promise.all(
      Object.values(CACHE_NAMES).map(cacheName => 
        caches.open(cacheName)
      )
    ).then(() => self.skipWaiting())
  );
});

// Activate event
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (!Object.values(CACHE_NAMES).includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event
self.addEventListener('fetch', event => {
  const config = getCacheConfig(event.request.url);
  
  if (!config) {
    return;
  }
  
  const cacheName = CACHE_NAMES[config.name];
  
  switch (config.strategy) {
    case 'cache-first':
      event.respondWith(cacheFirst(event.request, cacheName, config));
      break;
    case 'network-first':
      event.respondWith(networkFirst(event.request, cacheName, config));
      break;
    case 'stale-while-revalidate':
      event.respondWith(staleWhileRevalidate(event.request, cacheName, config));
      break;
    default:
      event.respondWith(fetch(event.request));
  }
});

// Cache strategies
async function cacheFirst(request, cacheName, config) {
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }
  
  const networkResponse = await fetch(request);
  const cache = await caches.open(cacheName);
  cache.put(request, networkResponse.clone());
  
  return networkResponse;
}

async function networkFirst(request, cacheName, config) {
  try {
    const networkResponse = await Promise.race([
      fetch(request),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Network timeout')), 
        (config.networkTimeoutSeconds || 5) * 1000)
      )
    ]);
    
    const cache = await caches.open(cacheName);
    cache.put(request, networkResponse.clone());
    
    return networkResponse;
  } catch (error) {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    throw error;
  }
}

async function staleWhileRevalidate(request, cacheName, config) {
  const cachedResponse = await caches.match(request);
  
  const fetchPromise = fetch(request).then(networkResponse => {
    const cache = caches.open(cacheName);
    cache.then(c => c.put(request, networkResponse.clone()));
    return networkResponse;
  });
  
  return cachedResponse || fetchPromise;
}

function getCacheConfig(url) {
  return CACHE_CONFIGS.find(config =>
    config.patterns.some(pattern => {
      if (pattern.includes('*')) {
        const regex = new RegExp(pattern.replace(/\\*/g, '.*'));
        return regex.test(url);
      }
      return url.includes(pattern);
    })
  );
}
`;
  }
}

/**
 * API Response Cache Manager
 */
export class APIResponseCacheManager {
  private static cache = new Map<string, { data: any; timestamp: number; maxAge: number }>();
  
  /**
   * Cache API response
   */
  static set(key: string, data: any, maxAge: number = 300000): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      maxAge,
    });
  }
  
  /**
   * Get cached API response
   */
  static get(key: string): any | null {
    const cached = this.cache.get(key);
    
    if (!cached) {
      return null;
    }
    
    if (Date.now() - cached.timestamp > cached.maxAge) {
      this.cache.delete(key);
      return null;
    }
    
    return cached.data;
  }
  
  /**
   * Clear expired cache entries
   */
  static cleanup(): void {
    const now = Date.now();
    
    for (const [key, cached] of this.cache.entries()) {
      if (now - cached.timestamp > cached.maxAge) {
        this.cache.delete(key);
      }
    }
  }
  
  /**
   * Clear all cache
   */
  static clear(): void {
    this.cache.clear();
  }
  
  /**
   * Get cache statistics
   */
  static getStats(): {
    size: number;
    entries: number;
    hitRate: number;
  } {
    return {
      size: this.cache.size,
      entries: this.cache.size,
      hitRate: 0, // Would need to track hits/misses
    };
  }
}

// Default CDN configuration
export const defaultCDNConfig: CDNConfig = {
  provider: 'vercel',
  domain: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  zones: {
    static: process.env.NEXT_PUBLIC_CDN_STATIC || '',
    images: process.env.NEXT_PUBLIC_CDN_IMAGES || '',
    api: process.env.NEXT_PUBLIC_CDN_API || '',
  },
  settings: {
    compression: true,
    minification: true,
    imageOptimization: true,
    caching: true,
  },
};

// Export singleton instances
export const cdnManager = CDNManager.getInstance();
export const browserCacheManager = BrowserCacheManager;
export const serviceWorkerCacheManager = ServiceWorkerCacheManager;
export const apiResponseCacheManager = APIResponseCacheManager;
