'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Heading, Text, Script } from '@/components/ui/typography';
import { TimelineItem } from './timeline-item';
import { ScrollReveal } from '@/components/animations/scroll-reveal';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Heart } from 'lucide-react';
import type { TimelineEvent } from '@/types';

interface InteractiveTimelineProps {
  events: TimelineEvent[];
  className?: string;
}

export function InteractiveTimeline({ events, className }: InteractiveTimelineProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start']
  });

  // Parallax effect for background elements
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 50]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.3, 1, 1, 0.3]);

  return (
    <Section 
      ref={containerRef}
      className={cn('relative overflow-hidden', className)} 
      padding="sm"
      background="pattern"
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          style={{ y: y1, opacity }}
          className="absolute top-20 left-10 text-blush-pink/20"
        >
          <Heart className="h-16 w-16 fill-current" />
        </motion.div>
        <motion.div
          style={{ y: y2, opacity }}
          className="absolute top-40 right-10 text-sage-green/20"
        >
          <Heart className="h-12 w-12 fill-current" />
        </motion.div>
        <motion.div
          style={{ y: y1, opacity }}
          className="absolute bottom-40 left-20 text-gold-accent/20"
        >
          <Heart className="h-8 w-8 fill-current" />
        </motion.div>
        <motion.div
          style={{ y: y2, opacity }}
          className="absolute bottom-20 right-20 text-blush-pink/20"
        >
          <Heart className="h-14 w-14 fill-current" />
        </motion.div>
      </div>

      <Container size="xl">
        {/* Header */}
        <ScrollReveal className="text-center mb-16 w-full">
          <div className="flex flex-col items-center justify-center w-full">
            <Script size="xl" className="mb-4 text-center">
              Our Love Story
            </Script>
            <Heading size="h2" variant="romantic" className="mb-6 text-center">
              The Journey of Our Hearts
            </Heading>
            <Text size="lg" variant="muted" className="max-w-3xl mx-auto leading-relaxed text-center">
              From our first meeting to this magical day, every moment has been a step towards forever. 
              Scroll through the milestones that brought us together and shaped our love story.
            </Text>
          </div>
        </ScrollReveal>

        {/* Timeline Progress Indicator */}
        <div className="relative mb-12">
          <div className="flex justify-center">
            <div className="relative w-64 h-2 bg-sage-green/20 rounded-full overflow-hidden">
              <motion.div
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-sage-green to-blush-pink rounded-full"
                style={{
                  scaleX: scrollYProgress,
                  transformOrigin: '0%'
                }}
              />
            </div>
          </div>
          <Text size="sm" variant="muted" className="text-center mt-2">
            Scroll to explore our journey
          </Text>
        </div>

        {/* Timeline Events */}
        <div className="relative space-y-24">
          {events.map((event, index) => (
            <TimelineItem
              key={event.id}
              event={event}
              index={index}
              isReversed={index % 2 === 1}
              className="relative"
            />
          ))}
        </div>

        {/* Timeline End */}
        <ScrollReveal delay={0.5} className="text-center mt-24">
          <div className="relative">
            {/* Final timeline dot */}
            <div className="flex justify-center mb-8">
              <motion.div
                className="w-8 h-8 rounded-full bg-gradient-to-r from-sage-green to-blush-pink border-4 border-white shadow-lg flex items-center justify-center"
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                viewport={{ once: true }}
              >
                <Heart className="h-4 w-4 text-white fill-current" />
              </motion.div>
            </div>

            <Script size="lg" className="mb-4">
              And this is just the beginning...
            </Script>
            <Text size="lg" variant="elegant" className="max-w-2xl mx-auto">
              Our love story continues to unfold with each passing day. Thank you for being part of our journey 
              and for celebrating this special milestone with us.
            </Text>
          </div>
        </ScrollReveal>
      </Container>
    </Section>
  );
}
