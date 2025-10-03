'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Loader2, Camera } from 'lucide-react';
import type { PhotoGalleryItem } from '@/types';
import { usePhotoGallery } from '@/hooks/usePhotoGallery';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { PhotoGridItem } from './PhotoGridItem';
import { CategoryFilter } from './CategoryFilter';
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
    categories,
    selectedCategory,
    hasMore,
    isLoading,
    setSelectedCategory,
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
            <div className="flex items-center justify-center gap-2 text-muted-foreground">
              <Loader2 size={20} className="animate-spin" />
              <span>Loading more photos...</span>
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
      <div className="mt-8 text-center text-sm text-muted-foreground">
        Showing {displayedPhotos.length} of {filteredPhotos.length} photos
        {selectedCategory !== 'all' && (
          <span> in {categories.find(c => c.id === selectedCategory)?.label}</span>
        )}
      </div>

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
