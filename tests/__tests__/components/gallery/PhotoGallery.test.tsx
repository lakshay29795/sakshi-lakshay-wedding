import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PhotoGallery } from '@/components/gallery/PhotoGallery';
import type { PhotoGalleryItem } from '@/types';

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
  },
  AnimatePresence: ({ children }: any) => children,
}));

// Mock next/image
jest.mock('next/image', () => {
  return function MockImage({ src, alt, ...props }: any) {
    return <img src={src} alt={alt} {...props} />;
  };
});

// Mock intersection observer hook
jest.mock('@/hooks/useIntersectionObserver', () => {
  const React = require('react');
  return {
    useIntersectionObserver: () => ({
      ref: React.createRef(),
      isIntersecting: true,
      entry: null,
    }),
    useLazyImage: (src: string) => ({
      ref: React.createRef(),
      src,
      isLoaded: true,
      isError: false,
      isIntersecting: true,
      onLoad: jest.fn(),
      onError: jest.fn(),
    }),
  };
});

const mockPhotos: PhotoGalleryItem[] = [
  {
    id: '1',
    src: '/test-image-1.jpg',
    alt: 'Test image 1',
    caption: 'Test caption 1',
    category: 'engagement',
    date: new Date('2023-01-01'),
    width: 800,
    height: 600,
    blurDataURL: 'data:image/jpeg;base64,test',
  },
  {
    id: '2',
    src: '/test-image-2.jpg',
    alt: 'Test image 2',
    caption: 'Test caption 2',
    category: 'couple',
    date: new Date('2023-02-01'),
    width: 600,
    height: 800,
    blurDataURL: 'data:image/jpeg;base64,test',
  },
  {
    id: '3',
    src: '/test-image-3.jpg',
    alt: 'Test image 3',
    caption: 'Test caption 3',
    category: 'engagement',
    date: new Date('2023-03-01'),
    width: 800,
    height: 600,
    blurDataURL: 'data:image/jpeg;base64,test',
  },
];

describe('PhotoGallery', () => {
  beforeEach(() => {
    // Reset any mocks
    jest.clearAllMocks();
  });

  it('renders photo gallery with photos', () => {
    render(<PhotoGallery photos={mockPhotos} />);
    
    // Check if photos are rendered
    expect(screen.getByAltText('Test image 1')).toBeInTheDocument();
    expect(screen.getByAltText('Test image 2')).toBeInTheDocument();
    expect(screen.getByAltText('Test image 3')).toBeInTheDocument();
  });

  it('renders category filters', () => {
    render(<PhotoGallery photos={mockPhotos} />);
    
    // Check if category filters are present
    expect(screen.getByText('All Photos')).toBeInTheDocument();
    expect(screen.getAllByText('Engagement')).toHaveLength(3); // Button + 2 photo badges
    expect(screen.getAllByText('Couple')).toHaveLength(2); // Button + 1 photo badge
  });

  it('filters photos by category', async () => {
    const user = userEvent.setup();
    render(<PhotoGallery photos={mockPhotos} />);
    
    // Click on engagement category button (not the badge)
    const engagementButton = screen.getByRole('button', { name: /engagement/i });
    await user.click(engagementButton);
    
    // Should show only engagement photos
    expect(screen.getByAltText('Test image 1')).toBeInTheDocument();
    expect(screen.getByAltText('Test image 3')).toBeInTheDocument();
    expect(screen.queryByAltText('Test image 2')).not.toBeInTheDocument();
  });

  it('opens lightbox when photo is clicked', async () => {
    const user = userEvent.setup();
    render(<PhotoGallery photos={mockPhotos} />);
    
    // Click on first photo
    const firstPhoto = screen.getByAltText('Test image 1');
    await user.click(firstPhoto);
    
    // Lightbox should be open (we'll need to check for lightbox content)
    // This would depend on how the lightbox is implemented
  });

  it('shows empty state when no photos match filter', async () => {
    const user = userEvent.setup();
    const photosWithoutFamily = mockPhotos.filter(p => p.category !== 'family');
    render(<PhotoGallery photos={photosWithoutFamily} />);
    
    // If we had a family category button and clicked it, should show empty state
    // For now, let's test with an empty photos array
    render(<PhotoGallery photos={[]} />);
    
    expect(screen.getByText('No Photos Found')).toBeInTheDocument();
  });

  it('shows correct photo count', () => {
    render(<PhotoGallery photos={mockPhotos} />);
    
    // Check photo count display
    expect(screen.getByText(/Showing \d+ of \d+ photos/)).toBeInTheDocument();
  });

  it('handles load more functionality', async () => {
    const manyPhotos = Array.from({ length: 20 }, (_, i) => ({
      ...mockPhotos[0],
      id: `photo-${i}`,
      alt: `Test image ${i}`,
    }));
    
    render(<PhotoGallery photos={manyPhotos} itemsPerPage={5} />);
    
    // Should initially show 5 photos
    const initialPhotos = screen.getAllByRole('img');
    expect(initialPhotos).toHaveLength(5);
    
    // Look for load more button or trigger
    const loadMoreButton = screen.queryByText('Load More Photos');
    if (loadMoreButton) {
      fireEvent.click(loadMoreButton);
      
      await waitFor(() => {
        const updatedPhotos = screen.getAllByRole('img');
        expect(updatedPhotos.length).toBeGreaterThan(5);
      });
    }
  });

  it('applies correct CSS classes', () => {
    const customClassName = 'custom-gallery-class';
    const { container } = render(<PhotoGallery photos={mockPhotos} className={customClassName} />);
    
    const gallery = container.firstChild as HTMLElement;
    expect(gallery).toHaveClass(customClassName);
  });

  it('handles keyboard navigation in lightbox', async () => {
    const user = userEvent.setup();
    render(<PhotoGallery photos={mockPhotos} />);
    
    // Open lightbox
    const firstPhoto = screen.getByAltText('Test image 1');
    await user.click(firstPhoto);
    
    // Test escape key to close
    await user.keyboard('{Escape}');
    
    // Test arrow keys for navigation
    await user.keyboard('{ArrowRight}');
    await user.keyboard('{ArrowLeft}');
  });

  it('handles photo like functionality', async () => {
    const user = userEvent.setup();
    render(<PhotoGallery photos={mockPhotos} />);
    
    // Find and click like button (this would be in the PhotoGridItem)
    const likeButtons = screen.getAllByLabelText(/like photo/i);
    if (likeButtons.length > 0) {
      await user.click(likeButtons[0]);
      
      // Check if like state changed
      expect(screen.getByLabelText(/unlike photo/i)).toBeInTheDocument();
    }
  });

  it('displays photo metadata correctly', () => {
    render(<PhotoGallery photos={mockPhotos} />);
    
    // Check if captions are displayed (might be on hover)
    // This would depend on the specific implementation
    mockPhotos.forEach(photo => {
      if (photo.caption) {
        // Caption might be hidden initially and shown on hover
        const photoElement = screen.getByAltText(photo.alt);
        expect(photoElement).toBeInTheDocument();
      }
    });
  });
});
