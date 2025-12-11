'use client';

import * as React from 'react';
import { GiftReveal } from './gift-reveal';
import { motion, AnimatePresence } from 'framer-motion';

interface FirstVisitWrapperProps {
  children: React.ReactNode;
}

export function FirstVisitWrapper({ children }: FirstVisitWrapperProps) {
  // Always show gift video on every page load
  const [showGiftVideo, setShowGiftVideo] = React.useState(true);
  const [showContent, setShowContent] = React.useState(false);

  const handleReveal = () => {
    // Hide gift video
    setShowGiftVideo(false);
    
    // Small delay before showing content for smooth transition
    setTimeout(() => {
      setShowContent(true);
    }, 500);
  };

  return (
    <>
      <AnimatePresence mode="wait">
        {showGiftVideo && (
          <motion.div
            key="gift-reveal"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5 }}
          >
            <GiftReveal onReveal={handleReveal} />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showContent && (
          <motion.div
            key="main-content"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

