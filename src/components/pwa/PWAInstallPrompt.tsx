'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X, Smartphone, Heart, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { usePWA } from '@/hooks/usePWA';

interface PWAInstallPromptProps {
  onInstall?: () => void;
  onDismiss?: () => void;
}

export function PWAInstallPrompt({ onInstall, onDismiss }: PWAInstallPromptProps) {
  const { isInstallable, isInstalled, installPWA } = usePWA();
  const [isDismissed, setIsDismissed] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    // Check if user has previously dismissed the prompt
    const dismissed = localStorage.getItem('pwa-install-dismissed');
    const dismissedTime = dismissed ? parseInt(dismissed) : 0;
    const daysSinceDismissed = (Date.now() - dismissedTime) / (1000 * 60 * 60 * 24);
    
    // Show prompt if installable, not installed, not recently dismissed
    if (isInstallable && !isInstalled && (daysSinceDismissed > 7 || !dismissed)) {
      // Delay showing the prompt to avoid being intrusive
      const timer = setTimeout(() => {
        setShowPrompt(true);
      }, 5000); // Show after 5 seconds
      
      return () => clearTimeout(timer);
    }
  }, [isInstallable, isInstalled]);

  const handleInstall = async () => {
    const success = await installPWA();
    if (success) {
      setShowPrompt(false);
      onInstall?.();
    }
  };

  const handleDismiss = () => {
    setIsDismissed(true);
    setShowPrompt(false);
    localStorage.setItem('pwa-install-dismissed', Date.now().toString());
    onDismiss?.();
  };

  if (!showPrompt || isDismissed || isInstalled) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 100 }}
        className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:max-w-sm"
      >
        <Card className="wedding-card border-sage-green/20 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              {/* Icon */}
              <div className="flex-shrink-0">
                <div className="relative">
                  <Smartphone className="w-8 h-8 text-sage-green" />
                  <motion.div
                    className="absolute -top-1 -right-1"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Heart className="w-4 h-4 text-blush-pink fill-current" />
                  </motion.div>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-sage-green mb-1">
                  Install Our Wedding App
                </h3>
                <p className="text-xs text-muted-foreground mb-3">
                  Get quick access to our love story, RSVP, and updates right from your home screen!
                </p>

                {/* Features */}
                <div className="space-y-1 mb-3">
                  <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                    <Star className="w-3 h-3 text-amber-500" />
                    <span>Works offline</span>
                  </div>
                  <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                    <Star className="w-3 h-3 text-amber-500" />
                    <span>Push notifications</span>
                  </div>
                  <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                    <Star className="w-3 h-3 text-amber-500" />
                    <span>Fast & lightweight</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2">
                  <Button
                    onClick={handleInstall}
                    size="sm"
                    className="flex-1 wedding-button text-xs"
                  >
                    <Download className="w-3 h-3 mr-1" />
                    Install
                  </Button>
                  <Button
                    onClick={handleDismiss}
                    variant="ghost"
                    size="sm"
                    className="text-xs"
                  >
                    Later
                  </Button>
                </div>
              </div>

              {/* Close button */}
              <button
                onClick={handleDismiss}
                className="flex-shrink-0 p-1 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}

// Floating install button for persistent access
export function PWAInstallButton() {
  const { isInstallable, isInstalled, installPWA } = usePWA();
  const [isHovered, setIsHovered] = useState(false);

  if (!isInstallable || isInstalled) {
    return null;
  }

  const handleInstall = async () => {
    await installPWA();
  };

  return (
    <motion.div
      className="fixed bottom-20 right-4 z-40"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      <Button
        onClick={handleInstall}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="rounded-full w-12 h-12 wedding-button shadow-lg"
        size="sm"
      >
        <Download className="w-5 h-5" />
      </Button>
      
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="absolute right-14 top-1/2 transform -translate-y-1/2 bg-sage-green text-white px-2 py-1 rounded text-xs whitespace-nowrap"
          >
            Install App
            <div className="absolute left-full top-1/2 transform -translate-y-1/2 border-4 border-transparent border-l-sage-green" />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
