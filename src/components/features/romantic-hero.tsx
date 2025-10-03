'use client';

import React, { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Heart, Calendar, MapPin, ArrowDown } from 'lucide-react';
import { weddingInfo } from '@/data/wedding-info';

interface RomanticHeroProps {
  className?: string;
}

export function RomanticHero({ className }: RomanticHeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start']
  });

  const y = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.8, 0.3]);

  const scrollToNext = () => {
    const nextSection = document.querySelector('#romantic-features');
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div ref={containerRef} className={`romantic-hero ${className}`}>
      {/* Background Image with Parallax */}
      <motion.div 
        className="romantic-hero-bg animate-gentle-zoom"
        style={{ y, opacity }}
      >
        <img 
          src="/images/couple/celestial-hero.jpg"
          alt="Sakshi and Lakshay - Forever & Always"
          className="w-full h-full object-cover"
        />
      </motion.div>

      {/* Romantic Overlay */}
      <div className="romantic-hero-overlay" />

      {/* Bokeh Lights */}
      <div className="bokeh-lights">
        <div className="bokeh-light"></div>
        <div className="bokeh-light"></div>
        <div className="bokeh-light"></div>
        <div className="bokeh-light"></div>
        <div className="bokeh-light"></div>
      </div>

      {/* Floating Hearts */}
      <div className="romantic-hearts-container">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="floating-heart"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 8}s`,
              fontSize: `${1 + Math.random() * 0.5}rem`,
            }}
          >
            ♥
          </div>
        ))}
      </div>

      {/* Hero Content */}
      <div className="romantic-hero-content">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          {/* Romantic Announcement */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="mb-8"
          >
            <div className="romantic-glass inline-block px-8 py-4 mb-6">
              <span className="romantic-script text-lg text-romantic-charcoal">
                ✨ Forever & Always ✨
              </span>
            </div>
          </motion.div>

          {/* Names in Beautiful Cursive */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1 }}
            className="romantic-hero-title mb-6 animate-romantic-shimmer"
          >
            {weddingInfo.bride.name}
            <span className="block text-6xl md:text-7xl lg:text-8xl mt-4 mb-4 opacity-80">
              &
            </span>
            {weddingInfo.groom.name}
          </motion.h1>

          {/* Romantic Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.3 }}
            className="romantic-subtitle mb-8 animate-romantic-pulse"
          >
            Our Love Story Begins Here
          </motion.p>

          {/* Wedding Details in Elegant Cards */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.5 }}
            className="flex flex-col md:flex-row items-center justify-center gap-6 mb-12"
          >
            <div className="romantic-glass px-6 py-4 flex items-center gap-3 romantic-hover">
              <Calendar className="w-5 h-5 text-romantic-rose-dark" />
              <span className="romantic-body-text font-medium">November 12, 2025</span>
            </div>
            <div className="romantic-glass px-6 py-4 flex items-center gap-3 romantic-hover">
              <MapPin className="w-5 h-5 text-romantic-rose-dark" />
              <span className="romantic-body-text font-medium">Rosewood Manor</span>
            </div>
          </motion.div>

          {/* Romantic Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.7 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6"
          >
            <button className="romantic-button-primary animate-romantic-glow">
              Join Our Celebration 💕
            </button>
            <button className="romantic-button-secondary">
              Read Our Story 📖
            </button>
          </motion.div>

          {/* Romantic Quote */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 2 }}
            className="mt-12"
          >
            <div className="romantic-glass px-8 py-6 max-w-2xl mx-auto">
              <p className="romantic-script text-lg text-romantic-charcoal italic">
                "In all the world, there is no heart for me like yours. 
                In all the world, there is no love for you like mine."
              </p>
              <p className="romantic-body-text text-sm mt-2 opacity-70">
                — Maya Angelou
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.button
        onClick={scrollToNext}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <div className="romantic-glass p-4 rounded-full romantic-glow-hover">
          <ArrowDown className="w-6 h-6 text-romantic-charcoal" />
        </div>
      </motion.button>

      {/* Floating Romantic Elements */}
      <div className="absolute inset-0 pointer-events-none z-5">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={`romantic-${i}`}
            className="absolute"
            style={{
              left: `${15 + i * 15}%`,
              top: `${25 + (i % 3) * 20}%`,
            }}
            animate={{
              y: [-15, 15, -15],
              rotate: [0, 5, -5, 0],
              scale: [1, 1.1, 1],
              opacity: [0.4, 0.8, 0.4],
            }}
            transition={{
              duration: 5 + i,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 0.8,
            }}
          >
            <Heart className="w-5 h-5 text-romantic-rose fill-current animate-romantic-pulse" />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
