'use client';

import * as React from 'react';
import { GiftReveal } from './gift-reveal';
import { motion, AnimatePresence } from 'framer-motion';

interface FirstVisitWrapperProps {
  children: React.ReactNode;
}

const STORAGE_KEY = 'sakshi-lakshay-wedding-visited';

export function FirstVisitWrapper({ children }: FirstVisitWrapperProps) {
  const [hasVisited, setHasVisited] = React.useState<boolean | null>(null);
  const [showContent, setShowContent] = React.useState(false);

  // Check if user has visited before
  React.useEffect(() => {
    const visited = localStorage.getItem(STORAGE_KEY);
    setHasVisited(visited === 'true');
    
    if (visited === 'true') {
      setShowContent(true);
    }
  }, []);

  const handleReveal = () => {
    // Mark as visited
    localStorage.setItem(STORAGE_KEY, 'true');
    setHasVisited(true);
    
    // Small delay before showing content for smooth transition
    setTimeout(() => {
      setShowContent(true);
    }, 500);
  };

  // Show nothing while checking localStorage (prevents flash)
  if (hasVisited === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blush-pink/10 via-white to-sage-green/10">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-sage-green/20 border-t-sage-green rounded-full animate-spin" />
          <p className="text-gray-500 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <AnimatePresence mode="wait">
        {!hasVisited && (
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

