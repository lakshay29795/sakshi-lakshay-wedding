'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, Star } from 'lucide-react';

interface RomanticCountdownProps {
  weddingDate: Date;
  className?: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export function RomanticCountdown({ weddingDate, className }: RomanticCountdownProps) {
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
      const difference = +new Date(weddingDate) - +new Date();
      
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
  }, [weddingDate]);

  if (!isClient) {
    return (
      <div className={`py-20 ${className}`}>
        <div className="max-w-4xl mx-auto px-4">
          <div className="romantic-glass p-8 text-center">
            <div className="animate-pulse">
              <div className="h-8 bg-romantic-rose/20 rounded mb-4"></div>
              <div className="grid grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-20 bg-romantic-rose/20 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const timeUnits = [
    { label: 'Days', value: timeLeft.days, icon: '💕' },
    { label: 'Hours', value: timeLeft.hours, icon: '⏰' },
    { label: 'Minutes', value: timeLeft.minutes, icon: '💫' },
    { label: 'Seconds', value: timeLeft.seconds, icon: '✨' },
  ];

  return (
    <section className={`py-20 relative ${className}`}>
      {/* Romantic Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-romantic-blush-light via-romantic-cream-light to-romantic-lavender-light opacity-60" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center"
        >
          {/* Header */}
          <div className="mb-12">
            <div className="romantic-glass inline-block px-8 py-4 mb-6">
              <span className="romantic-script text-lg text-romantic-charcoal">
                ⏳ Counting Down to Forever ⏳
              </span>
            </div>
            
            <h2 className="romantic-cursive text-4xl md:text-6xl text-romantic-charcoal mb-6 animate-romantic-shimmer">
              Until We Say "I Do"
            </h2>
            
            <p className="romantic-body-text text-lg text-romantic-charcoal-light max-w-2xl mx-auto leading-relaxed">
              Every heartbeat brings us closer to the moment when two hearts become one soul, 
              forever intertwined in love's eternal dance.
            </p>
          </div>

          {/* Countdown Display */}
          <div className="romantic-glass p-8 md:p-12 max-w-4xl mx-auto mb-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
              {timeUnits.map((unit, index) => (
                <motion.div
                  key={unit.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.05 }}
                  className="text-center group"
                >
                  {/* Icon */}
                  <motion.div
                    animate={{ 
                      rotate: [0, 10, -10, 0],
                      scale: [1, 1.1, 1],
                    }}
                    transition={{ 
                      duration: 3,
                      repeat: Infinity,
                      ease: 'easeInOut',
                      delay: index * 0.5,
                    }}
                    className="text-3xl mb-4"
                  >
                    {unit.icon}
                  </motion.div>

                  {/* Value */}
                  <motion.div
                    key={unit.value} // This will trigger animation on value change
                    initial={{ scale: 1.2, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="romantic-card p-6 mb-4 group-hover:shadow-romantic-strong transition-all duration-300"
                  >
                    <div className="romantic-cursive text-4xl md:text-5xl text-romantic-charcoal animate-romantic-glow">
                      {unit.value.toString().padStart(2, '0')}
                    </div>
                  </motion.div>

                  {/* Label */}
                  <div className="romantic-script text-lg font-medium text-romantic-charcoal-light">
                    {unit.label}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Romantic Message */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              viewport={{ once: true }}
              className="mt-8 pt-8 border-t border-romantic-rose/20"
            >
              <div className="flex items-center justify-center gap-3 mb-4">
                <Heart className="w-6 h-6 text-romantic-rose fill-current animate-romantic-pulse" />
                <span className="romantic-script text-xl text-romantic-charcoal">
                  Love is in the air
                </span>
                <Heart className="w-6 h-6 text-romantic-rose fill-current animate-romantic-pulse" />
              </div>
              
              <p className="romantic-body-text text-romantic-charcoal-light max-w-2xl mx-auto leading-relaxed italic">
                "Being deeply loved by someone gives you strength, while loving someone deeply gives you courage. 
                Soon, we'll have both in abundance as we begin our forever together."
              </p>
            </motion.div>
          </div>

          {/* Call to Action */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            viewport={{ once: true }}
          >
            <button className="romantic-button-primary animate-romantic-glow">
              Save Our Date 💕
            </button>
          </motion.div>
        </motion.div>
      </div>

      {/* Floating Romantic Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={`countdown-float-${i}`}
            className="absolute"
            style={{
              left: `${10 + i * 8}%`,
              top: `${20 + (i % 4) * 20}%`,
            }}
            animate={{
              y: [-15, 15, -15],
              rotate: [0, 180, 360],
              opacity: [0.3, 0.7, 0.3],
            }}
            transition={{
              duration: 5 + i,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 0.4,
            }}
          >
            {i % 3 === 0 ? (
              <Heart className="w-4 h-4 text-romantic-rose fill-current" />
            ) : i % 3 === 1 ? (
              <Star className="w-3 h-3 text-romantic-gold fill-current" />
            ) : (
              <div className="w-2 h-2 bg-romantic-lavender rounded-full" />
            )}
          </motion.div>
        ))}
      </div>
    </section>
  );
}
