'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Play, X, Lock, Unlock } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Heading, Script, Text } from '@/components/ui/typography';
import { ScrollReveal } from '@/components/animations/scroll-reveal';
import { cn } from '@/lib/utils';
import { videoMessagesData, type VideoMessage } from '@/data/video-messages-data';

export function VideoMessages() {
  const [selectedVideo, setSelectedVideo] = React.useState<VideoMessage | null>(null);
  const [revealedVideos, setRevealedVideos] = React.useState<Set<string>>(new Set());
  const videoRef = React.useRef<HTMLVideoElement>(null);

  // Load revealed videos from localStorage
  React.useEffect(() => {
    const revealed = localStorage.getItem('revealedVideoMessages');
    if (revealed) {
      setRevealedVideos(new Set(JSON.parse(revealed)));
    }
  }, []);

  // Save revealed videos to localStorage
  const markAsRevealed = (videoId: string) => {
    const newRevealed = new Set(revealedVideos);
    newRevealed.add(videoId);
    setRevealedVideos(newRevealed);
    localStorage.setItem('revealedVideoMessages', JSON.stringify([...newRevealed]));
  };

  const handleThumbnailClick = (video: VideoMessage) => {
    if (video.isLocked) return;
    setSelectedVideo(video);
    markAsRevealed(video.id);
  };

  const handleCloseVideo = () => {
    if (videoRef.current) {
      videoRef.current.pause();
    }
    setSelectedVideo(null);
  };

  const isRevealed = (videoId: string) => revealedVideos.has(videoId);

  return (
    <>
      <Container size="xl" className="py-20">
        {/* Header */}
        <ScrollReveal className="text-center mb-16">
          <Script size="xl" className="mb-4 text-sage-green">
            Messages of Love
          </Script>
          <Heading size="h1" variant="romantic" className="mb-6">
            Special Video Messages
          </Heading>
          <Text size="lg" variant="muted" className="max-w-2xl mx-auto">
            Your loved ones have recorded heartfelt messages just for you. Click on each thumbnail to reveal their beautiful words.
          </Text>
        </ScrollReveal>

        {/* Video Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {videoMessagesData.map((video, index) => (
            <ScrollReveal
              key={video.id}
              delay={index * 0.1}
              direction="up"
            >
              <VideoThumbnail
                video={video}
                isRevealed={isRevealed(video.id)}
                onClick={() => handleThumbnailClick(video)}
              />
            </ScrollReveal>
          ))}
        </div>
      </Container>

      {/* Video Modal */}
      <AnimatePresence>
        {selectedVideo && (
          <VideoModal
            video={selectedVideo}
            videoRef={videoRef}
            onClose={handleCloseVideo}
          />
        )}
      </AnimatePresence>
    </>
  );
}

interface VideoThumbnailProps {
  video: VideoMessage;
  isRevealed: boolean;
  onClick: () => void;
}

function VideoThumbnail({ video, isRevealed, onClick }: VideoThumbnailProps) {
  return (
    <motion.div
      className={cn(
        'group relative rounded-2xl overflow-hidden shadow-lg cursor-pointer',
        'transition-all duration-300',
        video.isLocked
          ? 'cursor-not-allowed opacity-60'
          : 'hover:shadow-2xl hover:-translate-y-2'
      )}
      onClick={onClick}
      whileHover={video.isLocked ? {} : { scale: 1.02 }}
      whileTap={video.isLocked ? {} : { scale: 0.98 }}
    >
      {/* Thumbnail Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-sage-green/20 to-blush-pink/20">
        <img
          src={video.thumbnail}
          alt={`${video.name} - ${video.relationship}`}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          onError={(e) => {
            e.currentTarget.src = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect fill='%23f0f0f0' width='400' height='300'/%3E%3Ctext fill='%23999' font-family='Arial' font-size='18' text-anchor='middle' x='200' y='150'%3E${video.name}%3C/text%3E%3C/svg%3E`;
          }}
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        {/* Play Button Overlay */}
        {!video.isLocked && (
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <motion.div
              className="w-16 h-16 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-xl"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Play className="h-8 w-8 text-sage-green ml-1" fill="currentColor" />
            </motion.div>
          </div>
        )}

        {/* Lock Icon */}
        {video.isLocked && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-xl">
              <Lock className="h-8 w-8 text-gray-400" />
            </div>
          </div>
        )}

        {/* Revealed Badge */}
        {isRevealed && !video.isLocked && (
          <motion.div
            className="absolute top-4 right-4 px-3 py-1 bg-sage-green text-white text-xs font-medium rounded-full shadow-lg flex items-center gap-1"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 200 }}
          >
            <Unlock className="h-3 w-3" />
            Watched
          </motion.div>
        )}
      </div>

      {/* Content */}
      <div className="p-6 bg-white">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xl font-semibold text-sage-green font-serif">
            {video.name}
          </h3>
          <Heart className="h-5 w-5 text-blush-pink fill-current" />
        </div>
        <p className="text-sm text-muted-foreground mb-2">
          {video.relationship}
        </p>
        <p className="text-sm text-gray-700 leading-relaxed">
          {video.message}
        </p>
      </div>
    </motion.div>
  );
}

interface VideoModalProps {
  video: VideoMessage;
  videoRef: React.RefObject<HTMLVideoElement>;
  onClose: () => void;
}

function VideoModal({ video, videoRef, onClose }: VideoModalProps) {
  React.useEffect(() => {
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  // Close on Escape key
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden"
        initial={{ scale: 0.9, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 50 }}
        transition={{ type: 'spring', stiffness: 200, damping: 25 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg hover:bg-white transition-colors"
          aria-label="Close video"
        >
          <X className="h-5 w-5 text-gray-700" />
        </button>

        {/* Video Player */}
        <div className="relative aspect-video bg-black">
          <video
            ref={videoRef}
            className="w-full h-full"
            controls
            autoPlay
            onError={(e) => {
              console.error('Video failed to load:', video.videoUrl);
            }}
          >
            <source src={video.videoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>

        {/* Video Info */}
        <div className="p-6 bg-gradient-to-br from-blush-pink/10 to-sage-green/10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-full bg-sage-green/20 flex items-center justify-center">
              <Heart className="h-6 w-6 text-sage-green fill-current" />
            </div>
            <div>
              <h3 className="text-2xl font-serif font-semibold text-sage-green">
                {video.name}
              </h3>
              <p className="text-sm text-muted-foreground">
                {video.relationship}
              </p>
            </div>
          </div>
          <p className="text-gray-700 leading-relaxed">
            {video.message}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}

