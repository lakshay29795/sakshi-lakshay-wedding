'use client';

import * as React from 'react';
import Image from 'next/image';
import { cn, formatDate } from '@/lib/utils';
import { WeddingCard, WeddingCardContent, WeddingCardHeader, WeddingCardTitle, WeddingCardDescription } from '@/components/ui/wedding-card';
import { Text, Script } from '@/components/ui/typography';
import { ScrollReveal } from '@/components/animations/scroll-reveal';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, MapPin, Play, Pause, Volume2, VolumeX } from 'lucide-react';
import type { TimelineEvent } from '@/types';

interface TimelineItemProps {
  event: TimelineEvent;
  index: number;
  isReversed?: boolean;
  className?: string;
}

export function TimelineItem({ event, index, isReversed = false, className }: TimelineItemProps) {
  const [isImageRevealed, setIsImageRevealed] = React.useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = React.useState(false);
  const [isMuted, setIsMuted] = React.useState(false);
  const audioRef = React.useRef<HTMLAudioElement>(null);

  // Handle audio playback
  const toggleAudio = () => {
    if (!audioRef.current || !event.audioMessage) return;

    if (isAudioPlaying) {
      audioRef.current.pause();
      setIsAudioPlaying(false);
    } else {
      audioRef.current.play();
      setIsAudioPlaying(true);
    }
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    
    audioRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  // Handle audio events
  React.useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleEnded = () => setIsAudioPlaying(false);
    const handlePause = () => setIsAudioPlaying(false);
    const handlePlay = () => setIsAudioPlaying(true);

    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('play', handlePlay);

    return () => {
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('play', handlePlay);
    };
  }, []);

  // Reveal image on scroll
  const handleImageReveal = () => {
    setIsImageRevealed(true);
  };

  return (
    <div className={cn('relative', className)}>
      {/* Timeline connector line */}
      <div className="absolute left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-gradient-to-b from-sage-green/50 to-blush-pink/50" />
      
      {/* Timeline dot */}
      <div className="absolute left-1/2 top-8 transform -translate-x-1/2 z-10">
        <motion.div
          className="w-4 h-4 rounded-full bg-sage-green border-4 border-white shadow-lg"
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          transition={{ delay: index * 0.1, duration: 0.5 }}
          viewport={{ once: true }}
        />
      </div>

      {/* Content */}
      <div className={cn(
        'grid grid-cols-1 lg:grid-cols-2 gap-8 items-center',
        isReversed ? 'lg:grid-flow-col-dense' : ''
      )}>
        {/* Text Content */}
        <ScrollReveal 
          delay={index * 0.1} 
          direction={isReversed ? 'right' : 'left'}
          className={cn(isReversed ? 'lg:col-start-2' : '')}
        >
          <WeddingCard variant="elegant" padding="lg" hover="lift">
            <WeddingCardHeader>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(event.date, 'long')}</span>
                </div>
                {event.location && (
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{event.location.name}</span>
                  </div>
                )}
              </div>
              
              <WeddingCardTitle className="text-sage-green mb-2">
                {event.title}
              </WeddingCardTitle>
            </WeddingCardHeader>
            
            <WeddingCardContent>
              <WeddingCardDescription className="text-base leading-relaxed mb-4">
                {event.description}
              </WeddingCardDescription>

              {/* Audio Controls */}
              {event.audioMessage && (
                <div className="flex items-center space-x-3 p-3 bg-sage-green/10 rounded-lg">
                  <button
                    onClick={toggleAudio}
                    className="flex items-center justify-center w-10 h-10 rounded-full bg-sage-green text-white hover:bg-sage-green/90 transition-colors"
                    aria-label={isAudioPlaying ? 'Pause audio' : 'Play audio'}
                  >
                    {isAudioPlaying ? (
                      <Pause className="h-4 w-4" />
                    ) : (
                      <Play className="h-4 w-4 ml-0.5" />
                    )}
                  </button>
                  
                  <div className="flex-1">
                    <Text size="sm" weight="medium" className="text-sage-green">
                      Audio Message
                    </Text>
                    <Text size="xs" variant="muted">
                      {isAudioPlaying ? 'Playing...' : 'Click to listen'}
                    </Text>
                  </div>
                  
                  <button
                    onClick={toggleMute}
                    className="p-2 text-muted-foreground hover:text-sage-green transition-colors"
                    aria-label={isMuted ? 'Unmute' : 'Mute'}
                  >
                    {isMuted ? (
                      <VolumeX className="h-4 w-4" />
                    ) : (
                      <Volume2 className="h-4 w-4" />
                    )}
                  </button>
                  
                  <audio
                    ref={audioRef}
                    src={event.audioMessage}
                    preload="metadata"
                  />
                </div>
              )}
            </WeddingCardContent>
          </WeddingCard>
        </ScrollReveal>

        {/* Image Content */}
        <ScrollReveal 
          delay={index * 0.1 + 0.2} 
          direction={isReversed ? 'left' : 'right'}
          className={cn(isReversed ? 'lg:col-start-1' : '')}
          onInView={handleImageReveal}
        >
          <div className="relative group">
            {event.image && (
              <div className="relative aspect-[4/3] rounded-lg overflow-hidden shadow-lg">
                <AnimatePresence>
                  {!isImageRevealed && (
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-br from-sage-green/20 to-blush-pink/20 backdrop-blur-sm z-10 flex items-center justify-center"
                      initial={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.8 }}
                    >
                      <div className="text-center">
                        <Script size="lg" className="text-sage-green mb-2">
                          A Special Memory
                        </Script>
                        <Text size="sm" variant="muted">
                          Scroll to reveal
                        </Text>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                
                <Image
                  src={event.image}
                  alt={event.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                
                {/* Image overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            )}
            
            {/* Decorative elements */}
            <div className="absolute -top-2 -right-2 w-4 h-4 bg-gold-accent rounded-full opacity-70" />
            <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-blush-pink rounded-full opacity-70" />
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
}
