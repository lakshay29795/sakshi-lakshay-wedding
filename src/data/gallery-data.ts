import type { PhotoGalleryItem } from '@/types';
import { weddingInfo } from '@/data/wedding-info';
import { assetsConfig } from '@/config/assets.config';

// Helper function to generate alt text with couple names
const getAltText = (description: string) => 
  `${weddingInfo.bride.name} and ${weddingInfo.groom.name} - ${description}`;

// Use online images from config
const galleryImages = assetsConfig.gallery.photos;

// Photo descriptions for gallery
const photoDescriptions = [
  'Engagement photo',
  'Wedding venue',
  'Romantic moment',
  'First meeting',
  'Coffee shop date',
  'Casual together',
  'Beach vacation',
  'Travel adventure',
  'Home sweet home',
  'Birthday celebration',
  'Party time',
  'Having fun',
  'Getting ready',
  'Walking together',
  'Love note',
  'Sweet moment',
  'Wedding ceremony',
  'Dress shopping',
  'Dance lesson',
  'Reception',
  'Family dinner',
  'With friends',
  'Group photo',
  'Extended family',
  'Wedding details',
  'Portrait',
  'Happy together',
  'Smiling',
  'Sunset photo',
  'Ring shopping',
  'Honeymoon planning',
  'Celebration',
  'Venue visit',
  'Love',
  'Joy',
  'Happiness',
  'Forever together',
  'Best friends',
  'Perfect day',
  'Beautiful moments',
];

export const galleryPhotos: PhotoGalleryItem[] = galleryImages.map((src, index) => ({
  id: `${index + 1}`,
  src,
  alt: getAltText(photoDescriptions[index] || `Photo ${index + 1}`),
  caption: photoDescriptions[index] || 'Beautiful moment together',
  category: index < 20 ? 'couple' : index < 25 ? 'family' : index < 30 ? 'friends' : 'misc',
  date: new Date(2024, 0, index + 1), // Spread across the year
  width: 1200,
  height: 800,
  blurDataURL: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=='
}));

// Export for backward compatibility
export default galleryPhotos;
