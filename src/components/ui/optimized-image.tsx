'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import {
  imageOptimizer,
  lazyImageLoader,
  blurPlaceholderGenerator,
  type OptimizedImageProps,
} from '@/lib/performance/image-optimization';

/**
 * Optimized Image Component
 * 
 * This component provides advanced image optimization features including:
 * - Modern format detection (AVIF, WebP)
 * - Responsive images with srcSet
 * - Lazy loading with intersection observer
 * - Blur placeholders
 * - Performance monitoring
 * - Error handling with fallbacks
 */

interface OptimizedImageComponentProps extends OptimizedImageProps {
  className?: string;
  containerClassName?: string;
  showLoadingState?: boolean;
  fallbackSrc?: string;
  aspectRatio?: number;
  fill?: boolean;
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  priority = false,
  lazy = true,
  responsive = true,
  formats = ['avif', 'webp', 'jpeg'],
  quality = 85,
  blur = true,
  placeholder = 'blur',
  className,
  containerClassName,
  showLoadingState = true,
  fallbackSrc,
  aspectRatio,
  fill = false,
  onLoad,
  onError,
  ...props
}: OptimizedImageComponentProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(src);
  const [blurDataURL, setBlurDataURL] = useState<string>('');
  const imgRef = useRef<HTMLImageElement>(null);
  
  // Generate blur placeholder
  useEffect(() => {
    if (blur && placeholder === 'blur') {
      blurPlaceholderGenerator
        .generateFromImage(src)
        .then(setBlurDataURL)
        .catch(() => {
          // Fallback to default blur
          setBlurDataURL(blurPlaceholderGenerator.generateBlurDataURL());
        });
    }
  }, [src, blur, placeholder]);
  
  // Initialize lazy loading
  useEffect(() => {
    if (lazy && !priority && imgRef.current) {
      lazyImageLoader.observe(imgRef.current);
    }
    
    return () => {
      if (imgRef.current) {
        lazyImageLoader.cleanup();
      }
    };
  }, [lazy, priority]);
  
  // Preload critical images
  useEffect(() => {
    if (priority) {
      imageOptimizer.preloadImage(src, true).catch(console.error);
    }
  }, [src, priority]);
  
  // Handle image load
  const handleLoad = () => {
    setIsLoading(false);
    onLoad?.();
  };
  
  // Handle image error
  const handleError = (error: any) => {
    setHasError(true);
    setIsLoading(false);
    
    // Try fallback source
    if (fallbackSrc && currentSrc !== fallbackSrc) {
      setCurrentSrc(fallbackSrc);
      setHasError(false);
      setIsLoading(true);
      return;
    }
    
    onError?.(error);
  };
  
  // Generate responsive configuration
  const responsiveConfig = responsive && width && height && !fill
    ? imageOptimizer.generateResponsiveConfig(Number(width), Number(height))
    : null;
  
  // Generate optimized image props
  const imageProps = {
    src: currentSrc,
    alt,
    ...(fill 
      ? { fill: true } 
      : { 
          width: width ? Number(width) : undefined,
          height: height ? Number(height) : undefined,
        }
    ),
    quality,
    priority,
    placeholder: blur && blurDataURL ? 'blur' as const : 'empty' as const,
    blurDataURL: blur ? blurDataURL : undefined,
    sizes: responsiveConfig?.sizes || (fill ? '100vw' : undefined),
    onLoad: handleLoad,
    onError: handleError,
    ...props,
  };
  
  // Calculate container styles
  const containerStyles: React.CSSProperties = {};
  
  if (fill) {
    // For fill mode, container should be positioned relative
    containerStyles.position = 'relative';
  } else if (aspectRatio) {
    containerStyles.aspectRatio = aspectRatio.toString();
  } else if (width && height) {
    containerStyles.aspectRatio = `${width} / ${height}`;
  }
  
  return (
    <div
      className={cn(
        'relative overflow-hidden',
        containerClassName
      )}
      style={containerStyles}
    >
      {/* Loading State */}
      {isLoading && showLoadingState && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 animate-pulse">
          <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
        </div>
      )}
      
      {/* Error State */}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-500">
          <div className="text-center">
            <svg
              className="w-12 h-12 mx-auto mb-2 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <p className="text-sm">Failed to load image</p>
          </div>
        </div>
      )}
      
      {/* Optimized Image */}
      {!hasError && (
        <Image
          ref={imgRef}
          {...imageProps}
          className={cn(
            'transition-opacity duration-300',
            isLoading ? 'opacity-0' : 'opacity-100',
            className
          )}
          style={fill ? {
            objectFit: 'cover',
          } : {
            objectFit: 'cover',
            width: '100%',
            height: '100%',
          }}
        />
      )}
    </div>
  );
}

/**
 * Gallery Image Component
 * Optimized for photo galleries with lazy loading and lightbox support
 */
interface GalleryImageProps extends OptimizedImageComponentProps {
  onClick?: () => void;
  caption?: string;
  category?: string;
}

export function GalleryImage({
  onClick,
  caption,
  category,
  className,
  containerClassName,
  ...props
}: GalleryImageProps) {
  return (
    <div
      className={cn(
        'group cursor-pointer transition-transform duration-300 hover:scale-105',
        containerClassName
      )}
      onClick={onClick}
    >
      <OptimizedImage
        {...props}
        lazy={true}
        responsive={true}
        blur={true}
        className={cn(
          'rounded-lg shadow-md group-hover:shadow-lg transition-shadow duration-300',
          className
        )}
      />
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity duration-300 rounded-lg flex items-end">
        {caption && (
          <div className="p-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {category && (
              <span className="text-xs uppercase tracking-wide opacity-75">
                {category}
              </span>
            )}
            <p className="text-sm font-medium">{caption}</p>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Hero Image Component
 * Optimized for large hero sections with priority loading
 */
interface HeroImageProps extends OptimizedImageComponentProps {
  overlay?: boolean;
  overlayOpacity?: number;
  children?: React.ReactNode;
  fallback?: React.ReactNode;
}

export function HeroImage({
  overlay = false,
  overlayOpacity = 0.4,
  children,
  fallback,
  className,
  containerClassName,
  width,
  height,
  ...props
}: HeroImageProps) {
  // For hero images, we typically want them to fill the container
  // If no width/height provided, we'll use fill mode
  const imageProps = width && height 
    ? { width: Number(width), height: Number(height) }
    : { fill: true };

  const [hasError, setHasError] = useState(false);

  return (
    <div className={cn('relative', containerClassName)}>
      {hasError && fallback ? (
        fallback
      ) : (
        <OptimizedImage
          {...props}
          {...imageProps}
          priority={true}
          lazy={false}
          responsive={true}
          className={cn('w-full h-full object-cover', className)}
          onError={() => setHasError(true)}
        />
      )}
      
      {/* Overlay */}
      {overlay && (
        <div
          className="absolute inset-0 bg-black"
          style={{ opacity: overlayOpacity }}
        />
      )}
      
      {/* Content */}
      {children && (
        <div className="absolute inset-0 flex items-center justify-center">
          {children}
        </div>
      )}
    </div>
  );
}

/**
 * Avatar Image Component
 * Optimized for profile pictures and avatars
 */
interface AvatarImageProps extends Omit<OptimizedImageComponentProps, 'width' | 'height'> {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  rounded?: boolean;
  border?: boolean;
}

export function AvatarImage({
  size = 'md',
  rounded = true,
  border = false,
  className,
  ...props
}: AvatarImageProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24',
  };
  
  const dimensions = {
    sm: { width: 32, height: 32 },
    md: { width: 48, height: 48 },
    lg: { width: 64, height: 64 },
    xl: { width: 96, height: 96 },
  };
  
  return (
    <OptimizedImage
      {...props}
      width={dimensions[size].width}
      height={dimensions[size].height}
      priority={false}
      lazy={true}
      responsive={false}
      className={cn(
        sizeClasses[size],
        rounded && 'rounded-full',
        border && 'ring-2 ring-white shadow-lg',
        className
      )}
    />
  );
}

/**
 * Background Image Component
 * Optimized for background images with CSS background-image
 */
interface BackgroundImageProps {
  src: string;
  alt?: string;
  className?: string;
  children?: React.ReactNode;
  overlay?: boolean;
  overlayOpacity?: number;
  priority?: boolean;
}

export function BackgroundImage({
  src,
  alt = '',
  className,
  children,
  overlay = false,
  overlayOpacity = 0.5,
  priority = false,
}: BackgroundImageProps) {
  const [optimizedSrc, setOptimizedSrc] = useState('');
  
  useEffect(() => {
    const format = imageOptimizer.detectOptimalFormat();
    const optimized = imageOptimizer.optimizeImageUrl(src, 1920, 1080, format, 85);
    setOptimizedSrc(optimized);
    
    if (priority) {
      imageOptimizer.preloadImage(optimized, true);
    }
  }, [src, priority]);
  
  return (
    <div
      className={cn('relative bg-cover bg-center bg-no-repeat', className)}
      style={{
        backgroundImage: optimizedSrc ? `url(${optimizedSrc})` : undefined,
      }}
      role="img"
      aria-label={alt}
    >
      {overlay && (
        <div
          className="absolute inset-0 bg-black"
          style={{ opacity: overlayOpacity }}
        />
      )}
      
      {children && (
        <div className="relative z-10">
          {children}
        </div>
      )}
    </div>
  );
}
