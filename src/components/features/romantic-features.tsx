'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Camera, Calendar, Users, MapPin, Gift, Sparkles, BookOpen } from 'lucide-react';
import Link from 'next/link';

interface RomanticFeaturesProps {
  className?: string;
}

const romanticFeatures = [
  {
    icon: Heart,
    title: 'Our Love Story',
    description: 'Journey through the beautiful moments that brought our hearts together',
    href: '/story',
    gradient: 'bg-gradient-to-br from-romantic-blush to-romantic-rose-light',
    delay: 0.1,
  },
  {
    icon: Camera,
    title: 'Photo Gallery',
    description: 'Captured memories of our most precious and magical moments',
    href: '/gallery',
    gradient: 'bg-gradient-to-br from-romantic-lavender-light to-romantic-lavender',
    delay: 0.2,
  },
  {
    icon: Sparkles,
    title: 'Interactive Love',
    description: 'Explore our relationship through fun and romantic experiences',
    href: '/interactive',
    gradient: 'bg-gradient-to-br from-romantic-gold-light to-romantic-gold',
    delay: 0.3,
  },
  {
    icon: Users,
    title: 'RSVP',
    description: 'Join us in celebrating our special day filled with love and joy',
    href: '/rsvp',
    gradient: 'bg-gradient-to-br from-romantic-sage-light to-romantic-sage',
    delay: 0.4,
  },
  {
    icon: BookOpen,
    title: 'Daily Surprises',
    description: 'Discover new romantic surprises as we countdown to our big day',
    href: '/daily-reveals',
    gradient: 'bg-gradient-to-br from-romantic-cream to-romantic-cream-dark',
    delay: 0.5,
  },
  {
    icon: Gift,
    title: 'Wedding Details',
    description: 'All the beautiful details about our romantic celebration',
    href: '/details',
    gradient: 'bg-gradient-to-br from-romantic-rose-light to-romantic-blush',
    delay: 0.6,
  },
];

export function RomanticFeatures({ className }: RomanticFeaturesProps) {
  return (
    <section id="romantic-features" className={`py-20 relative ${className}`}>
      {/* Romantic Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-romantic-cream-light via-romantic-pearl to-romantic-blush-light opacity-50" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="romantic-glass inline-block px-8 py-4 mb-6">
            <span className="romantic-script text-lg text-romantic-charcoal">
              ✨ Explore Our World ✨
            </span>
          </div>
          
          <h2 className="romantic-cursive text-5xl md:text-7xl text-romantic-charcoal mb-6 animate-romantic-shimmer">
            A Digital Love Album
          </h2>
          
          <p className="romantic-body-text text-lg md:text-xl max-w-3xl mx-auto leading-relaxed text-romantic-charcoal-light">
            Every page tells a story, every moment captures our love. 
            Step into our romantic world and be part of our beautiful journey together.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {romanticFeatures.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: feature.delay }}
              viewport={{ once: true }}
              whileHover={{ y: -8 }}
              className="group"
            >
              <Link href={feature.href} className="block h-full">
                <div className="romantic-card h-full relative overflow-hidden group-hover:shadow-romantic-strong">
                  {/* Gradient Background */}
                  <div className={`absolute inset-0 ${feature.gradient} opacity-20 group-hover:opacity-30 transition-opacity duration-300`} />
                  
                  {/* Content */}
                  <div className="relative z-10">
                    {/* Icon with Romantic Glow */}
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className="mb-6"
                    >
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-romantic-rose to-romantic-rose-dark flex items-center justify-center group-hover:animate-romantic-glow romantic-glow-hover">
                        <feature.icon className="w-8 h-8 text-white" />
                      </div>
                    </motion.div>

                    {/* Title */}
                    <h3 className="romantic-script text-2xl font-semibold mb-4 text-romantic-charcoal group-hover:text-romantic-charcoal-light transition-colors">
                      {feature.title}
                    </h3>

                    {/* Description */}
                    <p className="romantic-body-text text-romantic-charcoal-light leading-relaxed mb-6">
                      {feature.description}
                    </p>

                    {/* Hover Indicator */}
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      whileHover={{ opacity: 1, x: 0 }}
                      className="flex items-center gap-2 text-romantic-rose-dark"
                    >
                      <span className="romantic-script font-medium">Discover More</span>
                      <motion.div
                        animate={{ x: [0, 5, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        →
                      </motion.div>
                    </motion.div>
                  </div>

                  {/* Floating Heart */}
                  <div className="absolute top-4 right-4 opacity-30 group-hover:opacity-60 transition-opacity">
                    <Heart className="w-5 h-5 text-romantic-rose fill-current animate-romantic-pulse" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Romantic Call to Action */}
        {/* <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className="romantic-glass px-12 py-8 max-w-2xl mx-auto">
            <h3 className="romantic-cursive text-3xl text-romantic-charcoal mb-4">
              Join Our Love Story
            </h3>
            <p className="romantic-body-text text-romantic-charcoal-light mb-6 leading-relaxed">
              Be part of our magical journey as we celebrate love, laughter, and happily ever after.
            </p>
            <button className="romantic-button-primary animate-romantic-glow">
              Celebrate With Us 💕
            </button>
          </div>
        </motion.div> */}
      </div>

      {/* Floating Romantic Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={`romantic-float-${i}`}
            className="absolute"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [-20, 20, -20],
              opacity: [0.2, 0.6, 0.2],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 6 + Math.random() * 4,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: Math.random() * 2,
            }}
          >
            <div className="w-2 h-2 bg-romantic-rose rounded-full animate-romantic-pulse" />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
