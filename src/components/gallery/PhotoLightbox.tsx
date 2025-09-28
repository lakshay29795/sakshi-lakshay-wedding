'use client';

import React, { useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Download, Share2, Heart } from 'lucide-react';
import type { PhotoGalleryItem } from '@/types';
import { formatDate } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface PhotoLightboxProps {
  photo: PhotoGalleryItem | null;
  isOpen: boolean;
  onClose: () => void;
  onNext: () => void;
  onPrevious: () => void;
  hasNext: boolean;
  hasPrevious: boolean;
  currentIndex: number;
  totalCount: number;
}

export function PhotoLightbox({
  photo,
  isOpen,
  onClose,
  onNext,
  onPrevious,
  hasNext,
  hasPrevious,
  currentIndex,
  totalCount,
}: PhotoLightboxProps) {
  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, onClose]);

  if (!photo) return null;

  const handleDownload = async () => {
    try {
      const response = await fetch(photo.src);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `wedding-photo-${photo.id}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to download image:', error);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: photo.caption || photo.alt,
          text: `Check out this beautiful photo from Sakshi & Lakshay's wedding!`,
          url: window.location.href,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      // Fallback: copy URL to clipboard
      try {
        await navigator.clipboard.writeText(window.location.href);
        // You could show a toast notification here
      } catch (error) {
        console.error('Failed to copy URL:', error);
      }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
          onClick={onClose}
        >
          {/* Main Content */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="relative max-h-[90vh] max-w-[90vw] w-full"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute -top-12 right-0 z-10 p-2 text-white hover:text-blush-pink transition-colors"
              aria-label="Close lightbox"
            >
              <X size={24} />
            </button>

            {/* Navigation Buttons */}
            {hasPrevious && (
              <button
                onClick={onPrevious}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-3 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
                aria-label="Previous photo"
              >
                <ChevronLeft size={24} />
              </button>
            )}

            {hasNext && (
              <button
                onClick={onNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-3 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
                aria-label="Next photo"
              >
                <ChevronRight size={24} />
              </button>
            )}

            {/* Image Container */}
            <div className="relative bg-black rounded-lg overflow-hidden">
              <Image
                src={photo.src}
                alt={photo.alt}
                width={photo.width}
                height={photo.height}
                className="w-full h-auto max-h-[80vh] object-contain"
                priority
                placeholder={photo.blurDataURL ? 'blur' : 'empty'}
                blurDataURL={photo.blurDataURL}
              />

              {/* Image Info Overlay */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 text-white">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    {photo.caption && (
                      <h3 className="text-lg font-medium mb-2">{photo.caption}</h3>
                    )}
                    <div className="flex items-center gap-4 text-sm text-white/80">
                      <span>{formatDate(photo.date, 'long')}</span>
                      {photo.photographer && (
                        <span>Photo by {photo.photographer}</span>
                      )}
                      <span>
                        {currentIndex + 1} of {totalCount}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleShare}
                      className="p-2 hover:bg-white/20 rounded-full transition-colors"
                      aria-label="Share photo"
                    >
                      <Share2 size={18} />
                    </button>
                    <button
                      onClick={handleDownload}
                      className="p-2 hover:bg-white/20 rounded-full transition-colors"
                      aria-label="Download photo"
                    >
                      <Download size={18} />
                    </button>
                    <button
                      className="p-2 hover:bg-white/20 rounded-full transition-colors"
                      aria-label="Like photo"
                    >
                      <Heart size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Counter */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full text-sm">
            {currentIndex + 1} / {totalCount}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
