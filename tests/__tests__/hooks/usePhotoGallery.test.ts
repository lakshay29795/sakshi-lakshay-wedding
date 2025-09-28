import { renderHook, act } from '@testing-library/react';
import { usePhotoGallery } from '@/hooks/usePhotoGallery';
import type { PhotoGalleryItem } from '@/types';

const mockPhotos: PhotoGalleryItem[] = [
  {
    id: '1',
    src: '/test-1.jpg',
    alt: 'Test 1',
    category: 'engagement',
    date: new Date('2023-04-01'), // Latest date - will be index 0 after sorting
    width: 800,
    height: 600,
  },
  {
    id: '2',
    src: '/test-2.jpg',
    alt: 'Test 2',
    category: 'couple',
    date: new Date('2023-03-01'), // Second latest - will be index 1
    width: 800,
    height: 600,
  },
  {
    id: '3',
    src: '/test-3.jpg',
    alt: 'Test 3',
    category: 'engagement',
    date: new Date('2023-02-01'), // Third latest - will be index 2
    width: 800,
    height: 600,
  },
  {
    id: '4',
    src: '/test-4.jpg',
    alt: 'Test 4',
    category: 'family',
    date: new Date('2023-01-01'), // Oldest - will be index 3
    width: 800,
    height: 600,
  },
];

describe('usePhotoGallery', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('initializes with correct default values', () => {
    const { result } = renderHook(() =>
      usePhotoGallery({ photos: mockPhotos })
    );

    expect(result.current.selectedCategory).toBe('all');
    expect(result.current.currentPage).toBe(1);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.selectedPhoto).toBeNull();
    expect(result.current.filteredPhotos).toHaveLength(4);
    expect(result.current.displayedPhotos).toHaveLength(4);
  });

  it('filters photos by category', () => {
    const { result } = renderHook(() =>
      usePhotoGallery({ photos: mockPhotos })
    );

    act(() => {
      result.current.setSelectedCategory('engagement');
    });

    expect(result.current.selectedCategory).toBe('engagement');
    expect(result.current.filteredPhotos).toHaveLength(2);
    expect(result.current.filteredPhotos.every(p => p.category === 'engagement')).toBe(true);
  });

  it('handles pagination correctly', () => {
    const { result } = renderHook(() =>
      usePhotoGallery({ photos: mockPhotos, itemsPerPage: 2 })
    );

    // Initially should show 2 photos
    expect(result.current.displayedPhotos).toHaveLength(2);
    expect(result.current.hasMore).toBe(true);

    // Load more
    act(() => {
      result.current.loadMore();
    });

    // Fast forward timers to complete the loading delay
    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(result.current.displayedPhotos).toHaveLength(4);
    expect(result.current.hasMore).toBe(false);
  });

  it('generates categories with correct counts', () => {
    const { result } = renderHook(() =>
      usePhotoGallery({ photos: mockPhotos })
    );

    const categories = result.current.categories;
    
    expect(categories).toContainEqual({ id: 'all', label: 'All Photos', count: 4 });
    expect(categories).toContainEqual({ id: 'engagement', label: 'Engagement', count: 2 });
    expect(categories).toContainEqual({ id: 'couple', label: 'Couple', count: 1 });
    expect(categories).toContainEqual({ id: 'family', label: 'Family', count: 1 });
  });

  it('opens and closes lightbox', () => {
    const { result } = renderHook(() =>
      usePhotoGallery({ photos: mockPhotos })
    );

    // Use the first photo from the sorted array (latest date)
    const photoToOpen = result.current.filteredPhotos[0];

    act(() => {
      result.current.openLightbox(photoToOpen);
    });

    expect(result.current.selectedPhoto).toBe(photoToOpen);
    expect(result.current.selectedPhotoIndex).toBe(0);

    act(() => {
      result.current.closeLightbox();
    });

    expect(result.current.selectedPhoto).toBeNull();
    expect(result.current.selectedPhotoIndex).toBe(-1);
  });

  it('navigates through photos in lightbox', () => {
    const { result } = renderHook(() =>
      usePhotoGallery({ photos: mockPhotos })
    );

    // Open first photo from sorted array
    const sortedPhotos = result.current.filteredPhotos;
    
    act(() => {
      result.current.openLightbox(sortedPhotos[0]);
    });

    expect(result.current.selectedPhotoIndex).toBe(0);

    // Go to next photo
    act(() => {
      result.current.goToNext();
    });

    expect(result.current.selectedPhotoIndex).toBe(1);
    expect(result.current.selectedPhoto?.id).toBe(sortedPhotos[1].id);

    // Go to previous photo
    act(() => {
      result.current.goToPrevious();
    });

    expect(result.current.selectedPhotoIndex).toBe(0);
    expect(result.current.selectedPhoto?.id).toBe(sortedPhotos[0].id);
  });

  it('handles navigation boundaries correctly', () => {
    const { result } = renderHook(() =>
      usePhotoGallery({ photos: mockPhotos })
    );

    const sortedPhotos = result.current.filteredPhotos;

    // Open first photo
    act(() => {
      result.current.openLightbox(sortedPhotos[0]);
    });

    // Try to go to previous (should stay at first)
    act(() => {
      result.current.goToPrevious();
    });

    expect(result.current.selectedPhotoIndex).toBe(0);

    // Open last photo
    act(() => {
      result.current.openLightbox(sortedPhotos[sortedPhotos.length - 1]);
    });

    // Try to go to next (should stay at last)
    act(() => {
      result.current.goToNext();
    });

    expect(result.current.selectedPhotoIndex).toBe(sortedPhotos.length - 1);
  });

  it('resets state correctly', () => {
    const { result } = renderHook(() =>
      usePhotoGallery({ photos: mockPhotos, itemsPerPage: 2 })
    );

    // Change some state
    act(() => {
      result.current.setSelectedCategory('engagement');
      result.current.loadMore();
      result.current.openLightbox(mockPhotos[0]);
    });

    // Fast forward timers
    act(() => {
      jest.advanceTimersByTime(300);
    });

    // Reset
    act(() => {
      result.current.reset();
    });

    expect(result.current.selectedCategory).toBe('all');
    expect(result.current.currentPage).toBe(1);
    expect(result.current.selectedPhoto).toBeNull();
  });

  it('sorts photos by date correctly', () => {
    const { result } = renderHook(() =>
      usePhotoGallery({ photos: mockPhotos })
    );

    const filteredPhotos = result.current.filteredPhotos;
    
    // Should be sorted by date descending (newest first)
    for (let i = 0; i < filteredPhotos.length - 1; i++) {
      expect(filteredPhotos[i].date.getTime()).toBeGreaterThanOrEqual(
        filteredPhotos[i + 1].date.getTime()
      );
    }
  });

  it('handles loading state during pagination', () => {
    const { result } = renderHook(() =>
      usePhotoGallery({ photos: mockPhotos, itemsPerPage: 2 })
    );

    act(() => {
      result.current.loadMore();
    });

    expect(result.current.isLoading).toBe(true);

    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(result.current.isLoading).toBe(false);
  });

  it('prevents multiple simultaneous load operations', () => {
    const { result } = renderHook(() =>
      usePhotoGallery({ photos: mockPhotos, itemsPerPage: 2 })
    );

    const initialDisplayedCount = result.current.displayedPhotos.length;

    // Try to load more multiple times quickly
    act(() => {
      result.current.loadMore();
      result.current.loadMore();
      result.current.loadMore();
    });

    act(() => {
      jest.advanceTimersByTime(300);
    });

    // Should only increment by one page (2 more photos)
    expect(result.current.displayedPhotos.length).toBe(Math.min(initialDisplayedCount + 2, mockPhotos.length));
  });
});
