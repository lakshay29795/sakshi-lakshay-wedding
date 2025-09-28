'use client';

import * as React from 'react';
import { motion, MotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

interface FadeInProps extends Omit<MotionProps, 'initial' | 'animate' | 'transition'> {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  distance?: number;
  as?: React.ElementType;
}

const FadeIn = React.forwardRef<HTMLDivElement, FadeInProps>(
  ({
    children,
    className,
    delay = 0,
    duration = 0.6,
    direction = 'up',
    distance = 20,
    as: Component = 'div',
    ...props
  }, ref) => {
    const directions = {
      up: { y: distance },
      down: { y: -distance },
      left: { x: distance },
      right: { x: -distance },
      none: {},
    };

    const MotionComponent = motion(Component);

    return (
      <MotionComponent
        ref={ref}
        className={cn(className)}
        initial={{
          opacity: 0,
          ...directions[direction],
        }}
        animate={{
          opacity: 1,
          x: 0,
          y: 0,
        }}
        transition={{
          duration,
          delay,
          ease: 'easeOut',
        }}
        {...props}
      >
        {children}
      </MotionComponent>
    );
  }
);

FadeIn.displayName = 'FadeIn';

export { FadeIn };
