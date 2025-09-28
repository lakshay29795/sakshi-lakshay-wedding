import * as React from 'react';
import { cn } from '@/lib/utils';
import { VariantProps, cva } from 'class-variance-authority';

const sectionVariants = cva(
  'relative',
  {
    variants: {
      padding: {
        none: '',
        sm: 'py-8 md:py-12',
        md: 'py-12 md:py-16 lg:py-20',
        lg: 'py-16 md:py-24 lg:py-32',
        xl: 'py-20 md:py-32 lg:py-40',
      },
      background: {
        none: '',
        default: 'bg-background',
        muted: 'bg-muted/30',
        card: 'bg-card',
        gradient: 'wedding-gradient',
        pattern: 'bg-romantic-pattern',
        dots: 'bg-subtle-dots',
      },
      border: {
        none: '',
        top: 'border-t border-border/50',
        bottom: 'border-b border-border/50',
        both: 'border-y border-border/50',
      },
    },
    defaultVariants: {
      padding: 'lg',
      background: 'none',
      border: 'none',
    },
  }
);

export interface SectionProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof sectionVariants> {
  as?: 'section' | 'div' | 'article' | 'main';
}

const Section = React.forwardRef<HTMLDivElement, SectionProps>(
  ({ className, padding, background, border, as: Comp = 'section', ...props }, ref) => {
    return (
      <Comp
        className={cn(sectionVariants({ padding, background, border, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Section.displayName = 'Section';

export { Section, sectionVariants };
