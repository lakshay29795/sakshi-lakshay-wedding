'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface GiftRevealProps {
  onReveal: () => void;
}

export function GiftReveal({ onReveal }: GiftRevealProps) {
  const [videoStarted, setVideoStarted] = React.useState(false);
  const [videoEnded, setVideoEnded] = React.useState(false);
  const [showPrompt, setShowPrompt] = React.useState(true);
  const videoRef = React.useRef<HTMLVideoElement>(null);

  const handleClick = () => {
    if (!videoStarted && videoRef.current) {
      setVideoStarted(true);
      setShowPrompt(false);
      videoRef.current.play().catch(error => {
        console.error('Video playback failed:', error);
        // If video fails, proceed to reveal
        handleVideoEnd();
      });
    }
  };

  const handleVideoEnd = () => {
    setVideoEnded(true);
    // Wait for fade transition then reveal website
    setTimeout(() => {
      onReveal();
    }, 1500);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden cursor-pointer"
      onClick={handleClick}
    >
      {/* Video container */}
      <div className="absolute inset-0 bg-black flex items-center justify-center">
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          playsInline
          preload="auto"
          onEnded={handleVideoEnd}
          onError={handleVideoEnd}
        >
          <source src="/videos/gift-reveal.mp4" type="video/mp4" />
          <source src="/videos/gift-reveal.webm" type="video/webm" />
          Your browser does not support the video tag.
        </video>
      </div>

      {/* Click prompt overlay */}
      <AnimatePresence>
        {showPrompt && !videoStarted && (
          <motion.div
            className="absolute inset-0 flex flex-col items-center justify-center bg-black/30 backdrop-blur-sm pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Elegant text prompt */}
            <motion.div
              className="text-center space-y-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              {/* Main heading */}
              <motion.h1
                className="text-4xl md:text-6xl tracking-widest"
                style={{
                  fontFamily: 'Georgia, serif',
                  color: '#D4AF37',
                  textShadow: '0 4px 30px rgba(212, 175, 55, 0.5), 0 0 60px rgba(0, 0, 0, 0.9)',
                  letterSpacing: '0.3em',
                }}
                animate={{
                  opacity: [0.7, 1, 0.7],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                A GIFT FOR YOU
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                className="text-sm md:text-base tracking-wider"
                style={{
                  fontFamily: 'Georgia, serif',
                  color: '#C9A961',
                  textShadow: '0 2px 20px rgba(0, 0, 0, 0.8)',
                  letterSpacing: '0.2em',
                }}
              >
                Click anywhere to unwrap
              </motion.p>

              {/* Animated cursor hint */}
              {/* <motion.div
                className="flex justify-center mt-8"
                animate={{
                  y: [0, 10, 0],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                <div className="text-5xl md:text-6xl">👆</div>
              </motion.div> */}
            </motion.div>

            {/* Subtle shimmer particles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {[...Array(15)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute rounded-full"
                  style={{
                    width: 2 + Math.random() * 2,
                    height: 2 + Math.random() * 2,
                    background: `rgba(${220 + Math.random() * 35}, ${180 + Math.random() * 35}, ${100 + Math.random() * 40}, ${0.3 + Math.random() * 0.3})`,
                    boxShadow: `0 0 ${6 + Math.random() * 6}px rgba(212, 175, 55, 0.4)`,
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                  animate={{
                    y: [-30, -80, -130],
                    opacity: [0, 0.8, 0],
                    scale: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 4 + Math.random() * 2,
                    repeat: Infinity,
                    delay: Math.random() * 3,
                    ease: 'easeOut',
                  }}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Elegant gradient transition overlay */}
      <AnimatePresence>
        {videoEnded && (
          <motion.div
            className="absolute inset-0"
            style={{
              background: 'radial-gradient(ellipse at center, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 1) 100%)',
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5, ease: 'easeInOut' }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
