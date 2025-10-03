'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, Sparkles, Calendar, MapPin } from 'lucide-react';
import { weddingInfo } from '@/data/wedding-info';

interface PersonalizedHeroProps {
  className?: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export function PersonalizedHero({ className }: PersonalizedHeroProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    
    const calculateTimeLeft = () => {
      const difference = +new Date(weddingInfo.weddingDate) - +new Date();
      
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, []);

  const scrollToFeatures = () => {
    const featuresSection = document.querySelector('#romantic-features');
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className={`relative min-h-screen flex items-center justify-center overflow-hidden ${className}`}>
      {/* Large Couple's Photo Background */}
      <motion.div 
        className="absolute inset-0 z-0"
        initial={{ scale: 1.1, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 2, ease: 'easeOut' }}
      >
        {/* Background Image */}
        <div className="absolute inset-0 bg-gradient-to-br from-romantic-blush-light via-romantic-lavender-light to-romantic-cream">
          <img 
            src="/images/couple/celestial-hero.jpg"
            alt="Sakshi and Lakshay"
            className="w-full h-full object-cover opacity-30 mix-blend-multiply"
            onError={(e) => {
              console.log('Image failed to load');
              e.currentTarget.style.display = 'none';
            }}
          />
        </div>
        
        {/* Romantic Gradient Overlay */}
        <motion.div 
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
          style={{
            background: `
              radial-gradient(circle at 50% 50%, rgba(248, 232, 232, 0.7) 0%, rgba(232, 224, 245, 0.65) 50%, rgba(255, 248, 240, 0.7) 100%),
              linear-gradient(135deg, rgba(248, 232, 232, 0.75) 0%, rgba(232, 224, 245, 0.7) 50%, rgba(255, 248, 240, 0.75) 100%)
            `
          }}
        />

        {/* Soft Glowing Effect */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-romantic-rose/15 rounded-full blur-3xl animate-romantic-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-romantic-lavender/15 rounded-full blur-3xl animate-romantic-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-romantic-gold/8 rounded-full blur-3xl animate-romantic-pulse" style={{ animationDelay: '2s' }} />
        </div>
      </motion.div>

      {/* Floating Sparkles & Hearts */}
      <div className="absolute inset-0 pointer-events-none z-10">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={`sparkle-${i}`}
            className="absolute"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.3, 1, 0.3],
              scale: [0.8, 1.2, 0.8],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 4 + Math.random() * 3,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: Math.random() * 2,
            }}
          >
            {i % 3 === 0 ? (
              <Heart className="w-3 h-3 text-romantic-rose-dark fill-current" />
            ) : i % 3 === 1 ? (
              <Sparkles className="w-3 h-3 text-romantic-gold" />
            ) : (
              <div className="w-2 h-2 bg-romantic-lavender-dark rounded-full" />
            )}
          </motion.div>
        ))}
      </div>

      {/* Hero Content */}
      <div className="relative z-20 max-w-5xl mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          {/* Elegant Title */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="mb-8"
          >
            {/* <h1 className="romantic-hero-title mb-4">
              Forever Begins With Us
            </h1> */}
            <div className="flex items-center justify-center gap-3 mb-2">
              <Heart className="w-6 h-6 text-romantic-rose-dark fill-current animate-romantic-pulse" />
              <h2 className="romantic-cursive text-4xl md:text-6xl text-romantic-charcoal">
                {weddingInfo.bride.name} & {weddingInfo.groom.name}
              </h2>
              <Heart className="w-6 h-6 text-romantic-rose-dark fill-current animate-romantic-pulse" />
            </div>
            <p className="romantic-script text-xl md:text-2xl text-romantic-charcoal-light">
              Our Journey Together
            </p>
          </motion.div>

          {/* Live Countdown Timer - Centerpiece */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.2 }}
            className="mb-12"
          >
            {/* Countdown Title */}
            <div className="mb-6">
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="inline-block"
              >
                <div className="romantic-glass px-8 py-3 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-romantic-rose/20 via-romantic-lavender/20 to-romantic-gold/20 animate-gradient-shift" />
                  <span className="romantic-script text-2xl text-romantic-charcoal relative z-10">
                    ✨ Counting Down to Forever ✨
                  </span>
                </div>
              </motion.div>
            </div>

            {/* Countdown Numbers - Romantic & Glowing */}
            <div className="relative">
              {/* Decorative Floral Background */}
              <div className="absolute -top-8 -left-8 text-6xl opacity-10 text-romantic-rose">
                🌸
              </div>
              <div className="absolute -top-8 -right-8 text-6xl opacity-10 text-romantic-lavender-dark">
                🌸
              </div>
              <div className="absolute -bottom-8 -left-8 text-6xl opacity-10 text-romantic-gold">
                💐
              </div>
              <div className="absolute -bottom-8 -right-8 text-6xl opacity-10 text-romantic-rose-dark">
                💐
              </div>

              <div className="bg-white/70 backdrop-blur-xl p-8 md:p-12 relative overflow-hidden rounded-3xl shadow-2xl border border-white/50">
                {/* Glowing Background Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-romantic-rose/5 via-romantic-lavender/5 to-romantic-gold/5" />
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 relative z-10">
                  {[
                    { label: 'Days', value: timeLeft.days, emoji: '💕', color: 'from-pink-100 to-rose-100' },
                    { label: 'Hours', value: timeLeft.hours, emoji: '⏰', color: 'from-purple-100 to-pink-100' },
                    { label: 'Minutes', value: timeLeft.minutes, emoji: '💫', color: 'from-blue-100 to-purple-100' },
                    { label: 'Seconds', value: timeLeft.seconds, emoji: '✨', color: 'from-amber-100 to-yellow-100' },
                  ].map((unit, index) => (
                    <motion.div
                      key={unit.label}
                      initial={{ opacity: 0, scale: 0.8, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 1.4 + index * 0.1 }}
                      className="text-center"
                    >
                      {/* Emoji Icon */}
                      <motion.div
                        animate={{
                          rotate: [0, 10, -10, 0],
                          scale: [1, 1.2, 1],
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          ease: 'easeInOut',
                          delay: index * 0.5,
                        }}
                        className="text-3xl md:text-4xl mb-3"
                      >
                        {unit.emoji}
                      </motion.div>

                      {/* Number Card */}
                      <motion.div
                        key={unit.value}
                        initial={{ scale: 1.2, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.3 }}
                        className="relative mb-3"
                      >
                        <div className={`bg-gradient-to-br ${unit.color} p-4 md:p-6 rounded-2xl shadow-lg relative overflow-hidden group hover:shadow-xl hover:scale-105 transition-all duration-300`}>
                          {/* Shimmer effect */}
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                          
                          <motion.div
                            animate={{
                              textShadow: [
                                '0 2px 4px rgba(0, 0, 0, 0.1)',
                                '0 4px 8px rgba(0, 0, 0, 0.15)',
                                '0 2px 4px rgba(0, 0, 0, 0.1)',
                              ],
                            }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="text-4xl md:text-5xl font-bold text-gray-800 relative z-10"
                            style={{ fontFamily: 'Georgia, serif' }}
                          >
                            {unit.value.toString().padStart(2, '0')}
                          </motion.div>
                        </div>
                      </motion.div>

                      {/* Label */}
                      <div className="text-base md:text-lg font-medium text-gray-700" style={{ fontFamily: 'Georgia, serif' }}>
                        {unit.label}
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Romantic Message */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1, delay: 2 }}
                  className="mt-8 pt-8 border-t border-romantic-rose/20"
                >
                  <div className="flex items-center justify-center gap-2 mb-3">
                    <Heart className="w-5 h-5 text-romantic-rose fill-current animate-romantic-pulse" />
                    <span className="romantic-script text-lg text-romantic-charcoal">
                      Until we become one
                    </span>
                    <Heart className="w-5 h-5 text-romantic-rose fill-current animate-romantic-pulse" />
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Wedding Details */}
          {/* <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.8 }}
            className="flex flex-col md:flex-row items-center justify-center gap-4 mb-8"
          >
            <div className="bg-white/80 backdrop-blur-sm px-6 py-3 flex items-center gap-3 rounded-full shadow-md border border-pink-100 hover:shadow-lg hover:scale-105 transition-all duration-300">
              <Calendar className="w-5 h-5 text-pink-500" />
              <span className="font-medium text-gray-800">November 12, 2025</span>
            </div>
            <div className="bg-white/80 backdrop-blur-sm px-6 py-3 flex items-center gap-3 rounded-full shadow-md border border-pink-100 hover:shadow-lg hover:scale-105 transition-all duration-300">
              <MapPin className="w-5 h-5 text-pink-500" />
              <span className="font-medium text-gray-800">Rosewood Manor</span>
            </div>
          </motion.div> */}

          {/* Call to Action Buttons */}
          {/* <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6"
          >
            <motion.a
              href="/rsvp"
              whileHover={{ scale: 1.05, boxShadow: '0 15px 40px rgba(244, 194, 194, 0.5)' }}
              whileTap={{ scale: 0.95 }}
              className="group relative px-10 py-4 bg-gradient-to-r from-pink-400 via-rose-400 to-pink-500 text-white font-semibold rounded-full shadow-xl overflow-hidden transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-rose-500 via-pink-500 to-rose-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <span className="relative z-10 flex items-center gap-2 text-lg">
                <span>Join Our Celebration</span>
                <span className="text-xl">💕</span>
              </span>
            </motion.a>
            
            <motion.button
              onClick={scrollToFeatures}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group relative px-10 py-4 bg-white/80 backdrop-blur-sm text-gray-800 font-semibold rounded-full shadow-lg border-2 border-pink-200 hover:border-pink-300 transition-all duration-300"
            >
              <span className="flex items-center gap-2 text-lg">
                <span>Explore Our Story</span>
                <span className="text-xl group-hover:rotate-12 transition-transform duration-300">💫</span>
              </span>
            </motion.button>
          </motion.div> */}

          {/* Romantic Quote */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 2.2 }}
            className="mt-12"
          >
            <div className="bg-white/60 backdrop-blur-sm px-8 py-6 max-w-2xl mx-auto rounded-2xl shadow-lg border border-pink-100">
              <p className="text-xl text-gray-700 italic leading-relaxed text-center" style={{ fontFamily: 'Georgia, serif' }}>
                "Two souls with but a single thought, two hearts that beat as one."
              </p>
              <p className="text-sm mt-3 text-gray-600 text-center font-medium">
                — Our Love Story
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.button
        onClick={scrollToFeatures}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <div className="romantic-glass p-4 rounded-full romantic-glow-hover">
          <motion.div
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            ↓
          </motion.div>
        </div>
      </motion.button>
    </div>
  );
}
