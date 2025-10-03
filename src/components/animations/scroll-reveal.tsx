'use client';

import * as React from 'react';
import { motion, useInView, MotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ScrollRevealProps extends Omit<MotionProps, 'initial' | 'animate' | 'transition'> {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'scale';
  distance?: number;
  threshold?: number;
  triggerOnce?: boolean;
  as?: React.ElementType;
  onInView?: () => void;
}

const ScrollReveal = React.forwardRef<HTMLDivElement, ScrollRevealProps>(
  ({
    children,
    className,
    delay = 0,
    duration = 0.8,
    direction = 'up',
    distance = 30,
    threshold = 0.1,
    triggerOnce = true,
    as: Component = 'div',
    onInView,
    ...props
  }, ref) => {
    const localRef = React.useRef<HTMLDivElement>(null);
    const isInView = useInView(localRef, { 
      once: triggerOnce, 
      amount: threshold,
      margin: "0px 0px -100px 0px" // Trigger earlier when scrolling
    });

    // Combine refs
    React.useImperativeHandle(ref, () => localRef.current as HTMLDivElement);

    // Call onInView callback when element comes into view
    React.useEffect(() => {
      if (isInView && onInView) {
        onInView();
      }
    }, [isInView, onInView]);

    const directions = {
      up: { y: distance },
      down: { y: -distance },
      left: { x: distance },
      right: { x: -distance },
      scale: { scale: 0.8 },
    };

    const MotionComponent = motion(Component);

    return (
      <MotionComponent
        ref={localRef}
        className={cn(className)}
        initial={{
          opacity: 0,
          ...directions[direction],
        }}
        animate={{
          opacity: isInView ? 1 : 0,
          x: isInView ? 0 : directions[direction].x || 0,
          y: isInView ? 0 : directions[direction].y || 0,
          scale: isInView ? 1 : directions[direction].scale || 1,
        }}
        transition={{
          duration,
          delay: isInView ? delay : 0,
          ease: 'easeOut',
        }}
        {...props}
      >
        {children}
      </MotionComponent>
    );
  }
);

ScrollReveal.displayName = 'ScrollReveal';

export { ScrollReveal };
