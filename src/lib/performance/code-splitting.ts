/**
 * Code Splitting and Dynamic Import Utilities
 * 
 * This module provides utilities for implementing code splitting and dynamic imports
 * to improve performance by loading code only when needed.
 */

import React, { lazy, ComponentType, LazyExoticComponent } from 'react';
import dynamic from 'next/dynamic';

// Types for dynamic imports
export interface DynamicImportOptions {
  loading?: ComponentType;
  ssr?: boolean;
  suspense?: boolean;
}

export interface LazyComponentOptions {
  fallback?: React.ReactNode;
  retryCount?: number;
  retryDelay?: number;
}

/**
 * Enhanced dynamic import with error handling and retry logic
 */
export function createDynamicImport<T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  options: DynamicImportOptions = {}
): LazyExoticComponent<T> {
  const {
    loading: LoadingComponent,
    ssr = false,
    suspense = false,
  } = options;

  return dynamic(importFn, {
    loading: LoadingComponent ? () => React.createElement(LoadingComponent) : undefined,
    ssr,
    suspense,
  }) as LazyExoticComponent<T>;
}

/**
 * Create a lazy component with retry logic
 */
export function createLazyComponent<T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  options: LazyComponentOptions = {}
): LazyExoticComponent<T> {
  const {
    retryCount = 3,
    retryDelay = 1000,
  } = options;

  const retryImport = async (attempt = 1): Promise<{ default: T }> => {
    try {
      return await importFn();
    } catch (error) {
      if (attempt < retryCount) {
        console.warn(`Import failed, retrying (${attempt}/${retryCount})...`);
        await new Promise(resolve => setTimeout(resolve, retryDelay * attempt));
        return retryImport(attempt + 1);
      }
      throw error;
    }
  };

  return lazy(retryImport);
}

/**
 * Preload a dynamic component
 */
export function preloadComponent(importFn: () => Promise<any>): Promise<any> {
  return importFn();
}

/**
 * Create a component that loads on interaction (hover, click, etc.)
 */
export function createInteractionComponent<T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  triggerEvent: 'hover' | 'click' | 'focus' = 'hover'
): ComponentType<any> {
  return dynamic(importFn, {
    loading: () => React.createElement('div', { 
      className: 'animate-pulse bg-gray-200 rounded h-8 w-full' 
    }),
    ssr: false,
  });
}

/**
 * Route-based code splitting helper
 */
export const RouteComponents = {
  // Main pages
  HomePage: createDynamicImport(
    () => import('@/app/page'),
    { ssr: true }
  ),
  
  StoryPage: createDynamicImport(
    () => import('@/app/story/page'),
    { ssr: true }
  ),
  
  GalleryPage: createDynamicImport(
    () => import('@/app/gallery/page'),
    { ssr: false } // Gallery can be client-side only for better performance
  ),
  
  RSVPPage: createDynamicImport(
    () => import('@/app/rsvp/page'),
    { ssr: false } // RSVP is interactive, no need for SSR
  ),
  
  GuestBookPage: createDynamicImport(
    () => import('@/app/guestbook/page'),
    { ssr: false }
  ),
  
  NotificationsPage: createDynamicImport(
    () => import('@/app/notifications/page'),
    { ssr: false }
  ),
  
  // Admin pages (lazy loaded)
  AdminDashboard: createDynamicImport(
    () => import('@/app/admin/page'),
    { ssr: false }
  ),
  
  AdminLogin: createDynamicImport(
    () => import('@/app/admin/login/page'),
    { ssr: false }
  ),
};

/**
 * Component-based code splitting
 */
export const LazyComponents = {
  // Heavy components that can be lazy loaded
  PhotoGallery: createLazyComponent(
    () => import('@/components/gallery/PhotoGallery')
  ),
  
  PhotoLightbox: createLazyComponent(
    () => import('@/components/gallery/PhotoLightbox')
  ),
  
  RSVPForm: createLazyComponent(
    () => import('@/components/rsvp/RSVPForm')
  ),
  
  GuestBookFilters: createLazyComponent(
    () => import('@/components/guestbook/GuestBookFilters')
  ),
  
  NotificationPreferences: createLazyComponent(
    () => import('@/components/notifications/NotificationPreferences')
  ),
  
  PWAInstallPrompt: createLazyComponent(
    () => import('@/components/pwa/PWAInstallPrompt')
  ),
  
  // Admin components (heavily lazy loaded)
  AdminProvider: createLazyComponent(
    () => import('@/components/admin/AdminProvider')
  ),
  
  AdminSidebar: createLazyComponent(
    () => import('@/components/admin/AdminSidebar')
  ),
  
  AdminLoginForm: createLazyComponent(
    () => import('@/components/admin/AdminLoginForm')
  ),
};

/**
 * Feature-based code splitting
 */
export const FeatureModules = {
  // Analytics and tracking
  analytics: () => import('@/lib/analytics'),
  
  // Firebase services
  firebaseAuth: () => import('@/lib/firebase/auth'),
  firebaseMessaging: () => import('@/lib/firebase/messaging'),
  
  // Email services
  emailService: () => import('@/lib/services/email'),
  
  // PWA utilities
  pwaUtils: () => import('@/hooks/usePWA'),
  
  // Admin utilities
  adminAuth: () => import('@/lib/admin-auth'),
  adminAnalytics: () => import('@/hooks/useAdminAnalytics'),
};

/**
 * Utility to measure and log bundle loading performance
 */
export function measureBundleLoad<T>(
  bundleName: string,
  importFn: () => Promise<T>
): () => Promise<T> {
  return async () => {
    const startTime = performance.now();
    
    try {
      const result = await importFn();
      const loadTime = performance.now() - startTime;
      
      console.log(`Bundle "${bundleName}" loaded in ${loadTime.toFixed(2)}ms`);
      
      // Report to analytics if available
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'bundle_load', {
          bundle_name: bundleName,
          load_time: Math.round(loadTime),
        });
      }
      
      return result;
    } catch (error) {
      const loadTime = performance.now() - startTime;
      console.error(`Bundle "${bundleName}" failed to load after ${loadTime.toFixed(2)}ms:`, error);
      throw error;
    }
  };
}

/**
 * Preload critical bundles based on user behavior
 */
export class BundlePreloader {
  private static instance: BundlePreloader;
  private preloadedBundles = new Set<string>();
  private preloadQueue: Array<{ name: string; importFn: () => Promise<any> }> = [];
  
  static getInstance(): BundlePreloader {
    if (!BundlePreloader.instance) {
      BundlePreloader.instance = new BundlePreloader();
    }
    return BundlePreloader.instance;
  }
  
  /**
   * Preload a bundle
   */
  async preload(name: string, importFn: () => Promise<any>): Promise<void> {
    if (this.preloadedBundles.has(name)) {
      return;
    }
    
    try {
      await measureBundleLoad(name, importFn)();
      this.preloadedBundles.add(name);
    } catch (error) {
      console.error(`Failed to preload bundle "${name}":`, error);
    }
  }
  
  /**
   * Queue bundle for preloading when idle
   */
  queuePreload(name: string, importFn: () => Promise<any>): void {
    if (this.preloadedBundles.has(name)) {
      return;
    }
    
    this.preloadQueue.push({ name, importFn });
    this.processQueueWhenIdle();
  }
  
  /**
   * Process preload queue when browser is idle
   */
  private processQueueWhenIdle(): void {
    if (typeof window === 'undefined' || this.preloadQueue.length === 0) {
      return;
    }
    
    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(() => {
        this.processQueue();
      });
    } else {
      // Fallback for browsers without requestIdleCallback
      setTimeout(() => {
        this.processQueue();
      }, 100);
    }
  }
  
  /**
   * Process the preload queue
   */
  private async processQueue(): Promise<void> {
    const batch = this.preloadQueue.splice(0, 3); // Process 3 at a time
    
    await Promise.allSettled(
      batch.map(({ name, importFn }) => this.preload(name, importFn))
    );
    
    if (this.preloadQueue.length > 0) {
      this.processQueueWhenIdle();
    }
  }
  
  /**
   * Preload bundles based on route
   */
  preloadForRoute(route: string): void {
    const routePreloadMap: Record<string, Array<() => Promise<any>>> = {
      '/': [
        FeatureModules.analytics,
        () => preloadComponent(() => import('@/components/features/hero-section')),
      ],
      '/gallery': [
        () => preloadComponent(() => import('@/components/gallery/PhotoGallery')),
        () => preloadComponent(() => import('@/components/gallery/PhotoLightbox')),
      ],
      '/rsvp': [
        () => preloadComponent(() => import('@/components/rsvp/RSVPForm')),
        FeatureModules.emailService,
      ],
      '/guestbook': [
        () => preloadComponent(() => import('@/components/guestbook/GuestBookFilters')),
      ],
      '/admin': [
        FeatureModules.adminAuth,
        FeatureModules.adminAnalytics,
        () => preloadComponent(() => import('@/components/admin/AdminProvider')),
      ],
    };
    
    const preloadFunctions = routePreloadMap[route] || [];
    preloadFunctions.forEach((importFn, index) => {
      this.queuePreload(`${route}-${index}`, importFn);
    });
  }
}

/**
 * Hook to use bundle preloader
 */
export function useBundlePreloader() {
  const preloader = BundlePreloader.getInstance();
  
  return {
    preload: preloader.preload.bind(preloader),
    queuePreload: preloader.queuePreload.bind(preloader),
    preloadForRoute: preloader.preloadForRoute.bind(preloader),
  };
}

/**
 * Higher-order component for route-based preloading
 */
export function withRoutePreloading<P extends object>(
  Component: ComponentType<P>,
  route: string
): ComponentType<P> {
  return function PreloadedComponent(props: P) {
    const { preloadForRoute } = useBundlePreloader();
    
    React.useEffect(() => {
      preloadForRoute(route);
    }, [preloadForRoute]);
    
    return <Component {...props} />;
  };
}

// Global preloader instance
export const bundlePreloader = BundlePreloader.getInstance();
