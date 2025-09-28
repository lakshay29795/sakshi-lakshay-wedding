'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { getTimeUntilWedding } from '@/lib/utils';
import { WeddingCard } from '@/components/ui/wedding-card';
import { Text, Script } from '@/components/ui/typography';
import { motion } from 'framer-motion';

interface CountdownTimerProps {
  weddingDate: Date;
  className?: string;
}

interface TimeUnit {
  value: number;
  label: string;
  shortLabel: string;
}

export function CountdownTimer({ weddingDate, className }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = React.useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
    
    const updateTimer = () => {
      const time = getTimeUntilWedding(weddingDate);
      setTimeLeft(time);
    };

    // Update immediately
    updateTimer();

    // Update every second
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [weddingDate]);

  // Don't render on server to avoid hydration mismatch
  if (!isClient) {
    return (
      <div className={cn('grid grid-cols-2 md:grid-cols-4 gap-4', className)}>
        {[...Array(4)].map((_, i) => (
          <WeddingCard key={i} variant="glass" padding="md" className="text-center">
            <div className="animate-pulse">
              <div className="h-8 bg-sage-green/20 rounded mb-2"></div>
              <div className="h-4 bg-sage-green/20 rounded"></div>
            </div>
          </WeddingCard>
        ))}
      </div>
    );
  }

  const timeUnits: TimeUnit[] = [
    { value: timeLeft.days, label: 'Days', shortLabel: 'Days' },
    { value: timeLeft.hours, label: 'Hours', shortLabel: 'Hrs' },
    { value: timeLeft.minutes, label: 'Minutes', shortLabel: 'Min' },
    { value: timeLeft.seconds, label: 'Seconds', shortLabel: 'Sec' },
  ];

  // Check if wedding has passed
  const isWeddingDay = timeLeft.days === 0 && timeLeft.hours === 0 && timeLeft.minutes === 0 && timeLeft.seconds === 0;

  if (isWeddingDay) {
    return (
      <motion.div
        className={cn('text-center', className)}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        <WeddingCard variant="gradient" padding="xl" className="max-w-md mx-auto">
          <Script size="2xl" variant="accent" className="mb-4">
            We&apos;re Married! 💕
          </Script>
          <Text size="lg" className="text-charcoal">
            Thank you for celebrating with us!
          </Text>
        </WeddingCard>
      </motion.div>
    );
  }

  return (
    <div className={cn('grid grid-cols-2 md:grid-cols-4 gap-4', className)}>
      {timeUnits.map((unit, index) => (
        <motion.div
          key={unit.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1, duration: 0.6 }}
        >
          <WeddingCard 
            variant="glass" 
            padding="md" 
            hover="glow"
            className="text-center relative overflow-hidden"
          >
            {/* Background decoration */}
            <div className="absolute inset-0 bg-gradient-to-br from-sage-green/5 to-blush-pink/5 opacity-50" />
            
            {/* Content */}
            <div className="relative z-10">
              <motion.div
                key={unit.value}
                initial={{ scale: 1.2, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="mb-2"
              >
                <Text 
                  size="2xl" 
                  weight="bold" 
                  className="text-sage-green font-serif text-3xl md:text-4xl"
                >
                  {unit.value.toString().padStart(2, '0')}
                </Text>
              </motion.div>
              
              <Text 
                size="sm" 
                variant="muted" 
                weight="medium"
                className="uppercase tracking-wider"
              >
                <span className="hidden sm:inline">{unit.label}</span>
                <span className="sm:hidden">{unit.shortLabel}</span>
              </Text>
            </div>

            {/* Subtle animation for seconds */}
            {unit.label === 'Seconds' && (
              <motion.div
                className="absolute inset-0 bg-sage-green/10 rounded-lg"
                animate={{ opacity: [0, 0.3, 0] }}
                transition={{ duration: 1, repeat: Infinity }}
              />
            )}
          </WeddingCard>
        </motion.div>
      ))}
    </div>
  );
}
