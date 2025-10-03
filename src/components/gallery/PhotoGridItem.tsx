'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Heart, Eye } from 'lucide-react';
import type { PhotoGalleryItem } from '@/types';
import { useLazyImage } from '@/hooks/useIntersectionObserver';
import { cn } from '@/lib/utils';

interface PhotoGridItemProps {
  photo: PhotoGalleryItem;
  index: number;
  onClick: (photo: PhotoGalleryItem) => void;
  className?: string;
}

export function PhotoGridItem({ photo, index, onClick, className }: PhotoGridItemProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  const {
    ref,
    src,
    isLoaded,
    isError,
    isIntersecting,
    onLoad,
    onError,
  } = useLazyImage(photo.src, {
    rootMargin: '100px',
  });

  const handleClick = () => {
    onClick(photo);
  };

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLiked(!isLiked);
  };

  // Calculate aspect ratio for consistent grid
  const aspectRatio = photo.width / photo.height;
  const gridSpan = aspectRatio > 1.5 ? 'md:col-span-2' : '';

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.3) }}
      className={cn(
        'group relative cursor-pointer overflow-hidden rounded-lg bg-gradient-to-br from-blush-pink/5 to-sage-green/5',
        'hover-lift hover-glow',
        gridSpan,
        className
      )}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Main Image Container with fixed aspect ratio */}
      <div className="relative aspect-[3/4] overflow-hidden bg-gradient-to-br from-blush-pink/10 to-sage-green/10">
        {/* Loading Placeholder - Always visible until loaded */}
        {!isLoaded && !isError && (
          <div className="absolute inset-0 bg-gradient-to-br from-blush-pink/20 to-sage-green/20 animate-pulse" />
        )}

        {/* Error State */}
        {isError && (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blush-pink/10 to-sage-green/10 text-muted-foreground">
            <div className="text-center">
              <div className="text-2xl mb-2">📷</div>
              <p className="text-sm">Failed to load image</p>
            </div>
          </div>
        )}

        {/* Image */}
        {src && (
          <Image
            src={src}
            alt={photo.alt}
            fill
            priority={index < 6}
            className={cn(
              'object-cover transition-all duration-700',
              'group-hover:scale-110',
              isLoaded ? 'opacity-100' : 'opacity-0'
            )}
            onLoad={onLoad}
            onError={onError}
            placeholder={photo.blurDataURL ? 'blur' : 'empty'}
            blurDataURL={photo.blurDataURL}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            loading={index < 6 ? 'eager' : 'lazy'}
          />
        )}

        {/* Overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 bg-black/40 flex items-center justify-center"
        >
          <div className="text-white text-center">
            <Eye size={32} className="mx-auto mb-2" />
            <p className="text-sm font-medium">View Photo</p>
          </div>
        </motion.div>

        {/* Like Button */}
        <button
          onClick={handleLike}
          className={cn(
            'absolute top-3 right-3 p-2 rounded-full backdrop-blur-sm transition-all duration-300',
            'opacity-0 group-hover:opacity-100',
            isLiked
              ? 'bg-red-500 text-white'
              : 'bg-white/20 text-white hover:bg-white/30'
          )}
          aria-label={isLiked ? 'Unlike photo' : 'Like photo'}
        >
          <Heart
            size={16}
            className={cn(
              'transition-all duration-300',
              isLiked && 'fill-current'
            )}
          />
        </button>

        {/* Category Badge */}
        <div className="absolute bottom-3 left-3 px-2 py-1 bg-black/50 text-white text-xs rounded-full backdrop-blur-sm">
          {photo.category.charAt(0).toUpperCase() + photo.category.slice(1)}
        </div>

        {/* Caption (visible on hover) */}
        {photo.caption && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 10 }}
            transition={{ duration: 0.3 }}
            className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent text-white"
          >
            <p className="text-sm font-medium line-clamp-2">{photo.caption}</p>
          </motion.div>
        )}

        {/* Loading Indicator */}
        {isIntersecting && !isLoaded && !isError && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-sage-green border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>
    </motion.div>
  );
}
