import { useState, useEffect, useCallback, useMemo } from 'react';
import type { PhotoGalleryItem } from '@/types';

interface UsePhotoGalleryOptions {
  photos: PhotoGalleryItem[];
  itemsPerPage?: number;
  defaultCategory?: string;
}

interface UsePhotoGalleryReturn {
  // Data
  filteredPhotos: PhotoGalleryItem[];
  displayedPhotos: PhotoGalleryItem[];
  categories: Array<{ id: string; label: string; count: number }>;
  
  // State
  selectedCategory: string;
  currentPage: number;
  hasMore: boolean;
  isLoading: boolean;
  
  // Actions
  setSelectedCategory: (category: string) => void;
  loadMore: () => void;
  reset: () => void;
  
  // Lightbox
  selectedPhoto: PhotoGalleryItem | null;
  selectedPhotoIndex: number;
  openLightbox: (photo: PhotoGalleryItem) => void;
  closeLightbox: () => void;
  goToNext: () => void;
  goToPrevious: () => void;
}

export function usePhotoGallery({
  photos,
  itemsPerPage = 12,
  defaultCategory = 'all'
}: UsePhotoGalleryOptions): UsePhotoGalleryReturn {
  const [selectedCategory, setSelectedCategory] = useState(defaultCategory);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoGalleryItem | null>(null);

  // Calculate categories with counts
  const categories = useMemo(() => {
    const categoryMap = new Map<string, number>();
    
    // Count photos in each category
    photos.forEach(photo => {
      categoryMap.set(photo.category, (categoryMap.get(photo.category) || 0) + 1);
    });

    const result = [
      { id: 'all', label: 'All Photos', count: photos.length }
    ];

    // Add other categories
    const categoryLabels: Record<string, string> = {
      engagement: 'Engagement',
      couple: 'Couple',
      family: 'Family',
      friends: 'Friends',
      misc: 'Memories'
    };

    Object.entries(categoryLabels).forEach(([id, label]) => {
      const count = categoryMap.get(id) || 0;
      if (count > 0) {
        result.push({ id, label, count });
      }
    });

    return result;
  }, [photos]);

  // Filter photos by category
  const filteredPhotos = useMemo(() => {
    if (selectedCategory === 'all') {
      return [...photos].sort((a, b) => b.date.getTime() - a.date.getTime());
    }
    return photos
      .filter(photo => photo.category === selectedCategory)
      .sort((a, b) => b.date.getTime() - a.date.getTime());
  }, [photos, selectedCategory]);

  // Calculate displayed photos based on pagination
  const displayedPhotos = useMemo(() => {
    return filteredPhotos.slice(0, currentPage * itemsPerPage);
  }, [filteredPhotos, currentPage, itemsPerPage]);

  // Check if there are more photos to load
  const hasMore = useMemo(() => {
    return displayedPhotos.length < filteredPhotos.length;
  }, [displayedPhotos.length, filteredPhotos.length]);

  // Get selected photo index in filtered photos
  const selectedPhotoIndex = useMemo(() => {
    if (!selectedPhoto) return -1;
    return filteredPhotos.findIndex(photo => photo.id === selectedPhoto.id);
  }, [selectedPhoto, filteredPhotos]);

  // Handle category change
  const handleCategoryChange = useCallback((category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  }, []);

  // Load more photos
  const loadMore = useCallback(() => {
    if (hasMore && !isLoading) {
      setIsLoading(true);
      // Simulate loading delay for better UX
      setTimeout(() => {
        setCurrentPage(prev => prev + 1);
        setIsLoading(false);
      }, 300);
    }
  }, [hasMore, isLoading]);

  // Reset to initial state
  const reset = useCallback(() => {
    setSelectedCategory(defaultCategory);
    setCurrentPage(1);
    setSelectedPhoto(null);
  }, [defaultCategory]);

  // Lightbox functions
  const openLightbox = useCallback((photo: PhotoGalleryItem) => {
    setSelectedPhoto(photo);
  }, []);

  const closeLightbox = useCallback(() => {
    setSelectedPhoto(null);
  }, []);

  const goToNext = useCallback(() => {
    if (selectedPhotoIndex >= 0 && selectedPhotoIndex < filteredPhotos.length - 1) {
      setSelectedPhoto(filteredPhotos[selectedPhotoIndex + 1]);
    }
  }, [selectedPhotoIndex, filteredPhotos]);

  const goToPrevious = useCallback(() => {
    if (selectedPhotoIndex > 0) {
      setSelectedPhoto(filteredPhotos[selectedPhotoIndex - 1]);
    }
  }, [selectedPhotoIndex, filteredPhotos]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!selectedPhoto) return;

      switch (event.key) {
        case 'Escape':
          closeLightbox();
          break;
        case 'ArrowLeft':
          goToPrevious();
          break;
        case 'ArrowRight':
          goToNext();
          break;
      }
    };

    if (selectedPhoto) {
      document.addEventListener('keydown', handleKeyDown);
      // Prevent body scroll when lightbox is open
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [selectedPhoto, closeLightbox, goToNext, goToPrevious]);

  return {
    // Data
    filteredPhotos,
    displayedPhotos,
    categories,
    
    // State
    selectedCategory,
    currentPage,
    hasMore,
    isLoading,
    
    // Actions
    setSelectedCategory: handleCategoryChange,
    loadMore,
    reset,
    
    // Lightbox
    selectedPhoto,
    selectedPhotoIndex,
    openLightbox,
    closeLightbox,
    goToNext,
    goToPrevious,
  };
}
