'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Loader2, Camera } from 'lucide-react';
import type { PhotoGalleryItem } from '@/types';
import { usePhotoGallery } from '@/hooks/usePhotoGallery';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { PhotoGridItem } from './PhotoGridItem';
import { PhotoLightbox } from './PhotoLightbox';
import { cn } from '@/lib/utils';

interface PhotoGalleryProps {
  photos: PhotoGalleryItem[];
  itemsPerPage?: number;
  className?: string;
}

export function PhotoGallery({ photos, itemsPerPage = 12, className }: PhotoGalleryProps) {
  const {
    filteredPhotos,
    displayedPhotos,
    hasMore,
    isLoading,
    loadMore,
    selectedPhoto,
    selectedPhotoIndex,
    openLightbox,
    closeLightbox,
    goToNext,
    goToPrevious,
  } = usePhotoGallery({ photos, itemsPerPage });

  // Intersection observer for infinite scroll
  const { ref: loadMoreRef } = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: '100px',
  });

  // Auto-load more when load more trigger comes into view
  React.useEffect(() => {
    const loadMoreElement = loadMoreRef.current;
    if (!loadMoreElement) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          loadMore();
        }
      },
      { threshold: 0.1, rootMargin: '100px' }
    );

    observer.observe(loadMoreElement);
    return () => observer.disconnect();
  }, [hasMore, isLoading, loadMore, loadMoreRef]);

  const hasNext = selectedPhotoIndex < filteredPhotos.length - 1;
  const hasPrevious = selectedPhotoIndex > 0;

  return (
    <div className={cn('w-full', className)}>
      {/* Category Filter */}
      {/* <div className="mb-12">
        <CategoryFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />
      </div> */}

      {/* Photo Count Indicator */}
      {displayedPhotos.length > 0 && (
        <div className="mb-6 flex items-center justify-between">
          {/* <p className="text-sm text-muted-foreground">
            Showing <span className="font-semibold text-gray-700">{displayedPhotos.length}</span> of{' '}
            <span className="font-semibold text-gray-700">{filteredPhotos.length}</span> photos
          </p> */}
          {isLoading && (
            <div className="flex items-center gap-2 text-sage-green">
              <Loader2 size={16} className="animate-spin" />
              <span className="text-sm">Loading...</span>
            </div>
          )}
        </div>
      )}

      {/* Photo Grid */}
      {displayedPhotos.length > 0 ? (
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {displayedPhotos.map((photo, index) => (
            <PhotoGridItem
              key={photo.id}
              photo={photo}
              index={index}
              onClick={openLightbox}
            />
          ))}
        </motion.div>
      ) : (
        // Empty State
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16"
        >
          <Camera size={64} className="mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-xl font-serif text-charcoal mb-2">No Photos Found</h3>
          <p className="text-muted-foreground">
            No photos available in this category yet. Check back soon!
          </p>
        </motion.div>
      )}

      {/* Load More Trigger */}
      {hasMore && (
        <div ref={loadMoreRef} className="mt-12 text-center">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center gap-4 py-8">
              {/* Enhanced Loader */}
              <div className="relative">
                <div className="w-16 h-16 border-4 border-sage-green/20 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-sage-green border-t-transparent rounded-full animate-spin"></div>
              </div>
              <div className="text-center">
                <p className="text-lg font-medium text-gray-700 mb-1">Loading more memories...</p>
                <p className="text-sm text-muted-foreground">Fetching beautiful moments 📸</p>
              </div>
            </div>
          ) : (
            <button
              onClick={loadMore}
              className="wedding-button"
            >
              Load More Photos
            </button>
          )}
        </div>
      )}

      {/* Photo Stats */}
      {/* Photo count moved to top - removed duplicate */}

      {/* Lightbox */}
      <PhotoLightbox
        photo={selectedPhoto}
        isOpen={!!selectedPhoto}
        onClose={closeLightbox}
        onNext={goToNext}
        onPrevious={goToPrevious}
        hasNext={hasNext}
        hasPrevious={hasPrevious}
        currentIndex={selectedPhotoIndex}
        totalCount={filteredPhotos.length}
      />
    </div>
  );
}
