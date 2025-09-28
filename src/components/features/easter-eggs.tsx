'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Sparkles, Star, Music, Camera, Gift, Crown, Zap } from 'lucide-react';
import confetti from 'canvas-confetti';

interface EasterEgg {
  id: string;
  name: string;
  description: string;
  trigger: 'click' | 'hover' | 'sequence' | 'time' | 'scroll';
  discovered: boolean;
  element?: string;
  sequence?: string[];
  timeDelay?: number;
  scrollTarget?: number;
}

const easterEggs: EasterEgg[] = [
  {
    id: 'heart-click',
    name: 'Love Explosion',
    description: 'Click any heart icon 5 times quickly',
    trigger: 'sequence',
    discovered: false,
    sequence: ['heart', 'heart', 'heart', 'heart', 'heart']
  },
  {
    id: 'konami-code',
    name: 'Secret Love Code',
    description: 'Enter the classic sequence: ↑↑↓↓←→←→BA',
    trigger: 'sequence',
    discovered: false,
    sequence: ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA']
  },
  {
    id: 'couple-names',
    name: 'Name Magic',
    description: 'Type "Sakshi" followed by "Lakshay" anywhere on the site',
    trigger: 'sequence',
    discovered: false,
    sequence: ['s', 'a', 'k', 's', 'h', 'i', 'l', 'a', 'k', 's', 'h', 'a', 'y']
  },
  {
    id: 'midnight-surprise',
    name: 'Midnight Love',
    description: 'Visit the site at exactly midnight',
    trigger: 'time',
    discovered: false,
    timeDelay: 0
  },
  {
    id: 'scroll-master',
    name: 'Scroll Explorer',
    description: 'Scroll to the very bottom of every page',
    trigger: 'scroll',
    discovered: false,
    scrollTarget: 100
  }
];

const surpriseMessages = [
  "💕 You found a secret! Sakshi & Lakshay's love is full of surprises!",
  "✨ Amazing discovery! Your curiosity is rewarded with extra love!",
  "🎉 Secret unlocked! You're now part of our inner circle of love!",
  "💖 Wow! You're as adventurous as our love story!",
  "🌟 Congratulations! You've discovered one of our hidden treasures!",
  "💫 Secret found! May your life be full of beautiful surprises too!",
  "🎊 You're a true explorer! This love story has many hidden gems!",
  "💝 Special discovery! You deserve all the love in the world!"
];

export function EasterEggs() {
  const [discoveredEggs, setDiscoveredEggs] = useState<string[]>([]);
  const [currentSequence, setCurrentSequence] = useState<string[]>([]);
  const [showSurprise, setShowSurprise] = useState(false);
  const [surpriseMessage, setSurpriseMessage] = useState('');
  const [heartClickCount, setHeartClickCount] = useState(0);
  const [lastHeartClick, setLastHeartClick] = useState(0);

  // Load discovered eggs from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('wedding-easter-eggs');
    if (saved) {
      setDiscoveredEggs(JSON.parse(saved));
    }
  }, []);

  // Save discovered eggs to localStorage
  const saveDiscoveredEggs = useCallback((eggs: string[]) => {
    localStorage.setItem('wedding-easter-eggs', JSON.stringify(eggs));
    setDiscoveredEggs(eggs);
  }, []);

  // Trigger surprise animation
  const triggerSurprise = useCallback((eggId: string) => {
    if (discoveredEggs.includes(eggId)) return;

    const newDiscovered = [...discoveredEggs, eggId];
    saveDiscoveredEggs(newDiscovered);

    // Show surprise message
    const randomMessage = surpriseMessages[Math.floor(Math.random() * surpriseMessages.length)];
    setSurpriseMessage(randomMessage);
    setShowSurprise(true);

    // Confetti explosion
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#f43f5e', '#a8b5a0', '#fbbf24', '#f472b6', '#c084fc']
    });

    // Special effects for different eggs
    switch (eggId) {
      case 'heart-click':
        // Heart rain effect
        for (let i = 0; i < 50; i++) {
          setTimeout(() => {
            confetti({
              particleCount: 2,
              angle: 60,
              spread: 55,
              origin: { x: 0, y: 0 },
              colors: ['#f43f5e', '#f472b6'],
              shapes: ['heart']
            });
          }, i * 50);
        }
        break;
      case 'konami-code':
        // Rainbow confetti
        const colors = ['#ff0000', '#ff8000', '#ffff00', '#80ff00', '#00ff00', '#00ff80', '#00ffff', '#0080ff', '#0000ff', '#8000ff', '#ff00ff', '#ff0080'];
        confetti({
          particleCount: 200,
          spread: 180,
          origin: { y: 0.5 },
          colors: colors
        });
        break;
      case 'couple-names':
        // Golden sparkles
        confetti({
          particleCount: 150,
          spread: 120,
          origin: { y: 0.4 },
          colors: ['#ffd700', '#ffed4e', '#fbbf24'],
          shapes: ['star']
        });
        break;
    }

    // Hide surprise after 4 seconds
    setTimeout(() => setShowSurprise(false), 4000);
  }, [discoveredEggs, saveDiscoveredEggs]);

  // Keyboard sequence handler
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      const newSequence = [...currentSequence, e.code.toLowerCase()];
      
      // Keep only last 20 keys to prevent memory issues
      if (newSequence.length > 20) {
        newSequence.shift();
      }
      
      setCurrentSequence(newSequence);

      // Check for Konami code
      const konamiSequence = easterEggs.find(egg => egg.id === 'konami-code')?.sequence || [];
      if (newSequence.slice(-konamiSequence.length).join('') === konamiSequence.join('').toLowerCase()) {
        triggerSurprise('konami-code');
        setCurrentSequence([]);
      }

      // Check for couple names
      const coupleSequence = easterEggs.find(egg => egg.id === 'couple-names')?.sequence || [];
      if (newSequence.slice(-coupleSequence.length).join('') === coupleSequence.join('')) {
        triggerSurprise('couple-names');
        setCurrentSequence([]);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentSequence, triggerSurprise]);

  // Heart click handler
  const handleHeartClick = useCallback(() => {
    const now = Date.now();
    
    // Reset count if more than 2 seconds since last click
    if (now - lastHeartClick > 2000) {
      setHeartClickCount(1);
    } else {
      setHeartClickCount(prev => prev + 1);
    }
    
    setLastHeartClick(now);

    // Trigger surprise on 5th click
    if (heartClickCount >= 4) {
      triggerSurprise('heart-click');
      setHeartClickCount(0);
    }
  }, [heartClickCount, lastHeartClick, triggerSurprise]);

  // Midnight check
  useEffect(() => {
    const checkMidnight = () => {
      const now = new Date();
      if (now.getHours() === 0 && now.getMinutes() === 0) {
        triggerSurprise('midnight-surprise');
      }
    };

    const interval = setInterval(checkMidnight, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [triggerSurprise]);

  // Scroll handler
  useEffect(() => {
    const handleScroll = () => {
      const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
      if (scrollPercent >= 95) {
        triggerSurprise('scroll-master');
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [triggerSurprise]);

  // Global heart click listener
  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      // Check if clicked element contains heart icon or has heart-related classes
      if (target.closest('[data-heart]') || 
          target.closest('.lucide-heart') || 
          target.innerHTML.includes('♥') || 
          target.innerHTML.includes('❤') || 
          target.innerHTML.includes('💕') ||
          target.innerHTML.includes('💖') ||
          target.innerHTML.includes('💗') ||
          target.innerHTML.includes('💝')) {
        handleHeartClick();
      }
    };

    document.addEventListener('click', handleGlobalClick);
    return () => document.removeEventListener('click', handleGlobalClick);
  }, [handleHeartClick]);

  return (
    <>
      {/* Surprise Message Overlay */}
      <AnimatePresence>
        {showSurprise && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: -50 }}
            className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
          >
            <motion.div
              initial={{ rotate: -10 }}
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 0.5, repeat: 3 }}
              className="bg-gradient-to-r from-rose-500 to-pink-500 text-white px-8 py-4 rounded-2xl shadow-2xl max-w-md mx-4 text-center"
            >
              <div className="flex items-center justify-center mb-2">
                <Sparkles className="w-6 h-6 mr-2" />
                <span className="font-bold text-lg">Easter Egg Found!</span>
                <Sparkles className="w-6 h-6 ml-2" />
              </div>
              <p className="text-sm opacity-90">{surpriseMessage}</p>
              <div className="mt-2 text-xs opacity-75">
                {discoveredEggs.length} of {easterEggs.length} secrets discovered
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hidden Easter Egg Tracker (for development) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 right-4 z-40 bg-black/80 text-white p-3 rounded-lg text-xs max-w-xs">
          <div className="font-bold mb-1">Easter Eggs ({discoveredEggs.length}/{easterEggs.length})</div>
          {easterEggs.map(egg => (
            <div key={egg.id} className={`flex items-center gap-1 ${discoveredEggs.includes(egg.id) ? 'text-green-400' : 'text-gray-400'}`}>
              {discoveredEggs.includes(egg.id) ? '✅' : '⭕'} {egg.name}
            </div>
          ))}
          <div className="mt-2 text-xs opacity-75">
            Heart clicks: {heartClickCount}/5
          </div>
        </div>
      )}

      {/* Floating Hearts Animation (triggered randomly) */}
      <AnimatePresence>
        {discoveredEggs.includes('heart-click') && (
          <div className="fixed inset-0 pointer-events-none z-30">
            {[...Array(10)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ 
                  opacity: 0, 
                  x: Math.random() * window.innerWidth, 
                  y: window.innerHeight + 50 
                }}
                animate={{ 
                  opacity: [0, 1, 0], 
                  y: -50,
                  rotate: [0, 360]
                }}
                transition={{ 
                  duration: 3 + Math.random() * 2,
                  delay: Math.random() * 2,
                  repeat: Infinity,
                  repeatDelay: 5 + Math.random() * 10
                }}
                className="absolute"
              >
                <Heart className="w-4 h-4 text-rose-400 fill-current" />
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* Achievement Badge */}
      {discoveredEggs.length === easterEggs.length && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="fixed top-4 right-4 z-40 bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-3 rounded-full shadow-lg"
        >
          <Crown className="w-6 h-6" />
        </motion.div>
      )}
    </>
  );
}

// Hook for components to trigger custom easter eggs
export function useEasterEgg() {
  const triggerCustomEgg = useCallback((message: string, effect?: 'hearts' | 'stars' | 'rainbow') => {
    // Show custom message
    const event = new CustomEvent('easter-egg-found', { 
      detail: { message, effect } 
    });
    window.dispatchEvent(event);

    // Trigger confetti based on effect type
    switch (effect) {
      case 'hearts':
        confetti({
          particleCount: 50,
          spread: 60,
          colors: ['#f43f5e', '#f472b6'],
          shapes: ['heart']
        });
        break;
      case 'stars':
        confetti({
          particleCount: 100,
          spread: 80,
          colors: ['#ffd700', '#ffed4e'],
          shapes: ['star']
        });
        break;
      case 'rainbow':
        confetti({
          particleCount: 150,
          spread: 120,
          colors: ['#ff0000', '#ff8000', '#ffff00', '#80ff00', '#00ff00', '#00ffff', '#0080ff', '#8000ff']
        });
        break;
      default:
        confetti({
          particleCount: 80,
          spread: 70,
          colors: ['#f43f5e', '#a8b5a0', '#fbbf24']
        });
    }
  }, []);

  return { triggerCustomEgg };
}
