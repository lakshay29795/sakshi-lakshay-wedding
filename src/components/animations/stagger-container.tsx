'use client';

import * as React from 'react';
import { motion, MotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

interface StaggerContainerProps extends Omit<MotionProps, 'initial' | 'animate' | 'variants'> {
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number;
  as?: React.ElementType;
}

const StaggerContainer = React.forwardRef<HTMLDivElement, StaggerContainerProps>(
  ({
    children,
    className,
    staggerDelay = 0.1,
    as: Component = 'div',
    ...props
  }, ref) => {
    const MotionComponent = motion(Component);

    const containerVariants = {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: staggerDelay,
          delayChildren: 0.1,
        },
      },
    };

    return (
      <MotionComponent
        ref={ref}
        className={cn(className)}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        {...props}
      >
        {children}
      </MotionComponent>
    );
  }
);

StaggerContainer.displayName = 'StaggerContainer';

// Child component for stagger items
interface StaggerItemProps extends Omit<MotionProps, 'variants'> {
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
}

const StaggerItem = React.forwardRef<HTMLDivElement, StaggerItemProps>(
  ({ children, className, as: Component = 'div', ...props }, ref) => {
    const MotionComponent = motion(Component);

    const itemVariants = {
      hidden: { opacity: 0, y: 20 },
      visible: {
        opacity: 1,
        y: 0,
        transition: {
          duration: 0.6,
          ease: 'easeOut',
        },
      },
    };

    return (
      <MotionComponent
        ref={ref}
        className={cn(className)}
        variants={itemVariants}
        {...props}
      >
        {children}
      </MotionComponent>
    );
  }
);

StaggerItem.displayName = 'StaggerItem';

export { StaggerContainer, StaggerItem };
