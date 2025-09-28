'use client';

import * as React from 'react';
import { HeroImage } from '@/components/ui/optimized-image';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Heading, Text, Script } from '@/components/ui/typography';
import { WeddingButton } from '@/components/ui/wedding-button';
import { CountdownTimer } from './countdown-timer';
import { FadeIn } from '@/components/animations/fade-in';
import { motion } from 'framer-motion';
import { Heart, Calendar, MapPin, ChevronDown } from 'lucide-react';
import { weddingInfo } from '@/data/wedding-info';

interface HeroSectionProps {
  className?: string;
}

export function HeroSection({ className }: HeroSectionProps) {
  const scrollToNextSection = () => {
    const nextSection = document.querySelector('#about-section');
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <Section 
      className={cn('relative min-h-screen flex items-center justify-center overflow-hidden', className)}
      padding="none"
    >
      {/* Background with parallax effect */}
      <div className="absolute inset-0 z-0">
        {/* Gradient background fallback */}
        <div className="absolute inset-0 bg-gradient-to-br from-rose-100 via-sage-green/20 to-rose-50" />
        
        {/* Background image with error handling */}
        <div className="absolute inset-0">
          <HeroImage
            src="/images/couple/hero-bg.jpg"
            alt="Sakshi and Lakshay"
            priority={true}
            overlay={true}
            overlayOpacity={0.2}
            className="object-cover object-center"
            containerClassName="absolute inset-0"
            fallbackSrc="/images/couple/hero-placeholder.svg"
            fallback={
              <div className="absolute inset-0">
                <img 
                  src="/images/couple/hero-placeholder.svg" 
                  alt="Sakshi and Lakshay" 
                  className="w-full h-full object-cover"
                />
              </div>
            }
          />
        </div>

        {/* Floating elements */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Floating hearts */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-blush-pink/20"
              style={{
                left: `${10 + i * 15}%`,
                top: `${20 + (i % 3) * 20}%`,
              }}
              animate={{
                y: [-10, 10, -10],
                rotate: [0, 5, -5, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 4 + i,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: i * 0.5,
              }}
            >
              <Heart className="h-6 w-6 fill-current" />
            </motion.div>
          ))}
        </div>

        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 bg-subtle-dots opacity-30" />
      </div>

      {/* Content */}
      <Container size="lg" className="relative z-10 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Main heading */}
          <FadeIn delay={0.2}>
            <div className="space-y-4">
              <Script size="xl" className="text-white/90 mb-2">
                We&apos;re Getting Married!
              </Script>
              
              <Heading 
                variant="default" 
                size="hero" 
                className="text-white drop-shadow-lg"
              >
                {weddingInfo.bride.name} & {weddingInfo.groom.name}
              </Heading>
              
              <div className="flex items-center justify-center space-x-6 text-white/90">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5" />
                  <Text size="lg" weight="medium">
                    November 12, 2025
                  </Text>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="h-5 w-5" />
                  <Text size="lg" weight="medium">
                    Rosewood Manor
                  </Text>
                </div>
              </div>
            </div>
          </FadeIn>

          {/* Countdown Timer */}
          <FadeIn delay={0.4}>
            <div className="max-w-2xl mx-auto">
              <CountdownTimer weddingDate={weddingInfo.weddingDate} />
            </div>
          </FadeIn>

          {/* Call to action */}
          <FadeIn delay={0.6}>
            <div className="space-y-4">
              <Text size="lg" className="text-white/80 max-w-2xl mx-auto leading-relaxed">
                Join us as we celebrate our love story and begin our journey as husband and wife
              </Text>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <WeddingButton variant="elegant" size="lg" asChild>
                  <Link href="/rsvp">
                    RSVP Now
                  </Link>
                </WeddingButton>
                
                <WeddingButton variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-charcoal" asChild>
                  <Link href="/story">
                    Our Story
                  </Link>
                </WeddingButton>
              </div>
            </div>
          </FadeIn>
        </div>
      </Container>

      {/* Scroll indicator */}
      <motion.button
        onClick={scrollToNextSection}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/70 hover:text-white transition-colors"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        aria-label="Scroll to next section"
      >
        <ChevronDown className="h-8 w-8" />
      </motion.button>
    </Section>
  );
}
