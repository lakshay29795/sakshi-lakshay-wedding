import * as React from 'react';
import { cn } from '@/lib/utils';
import { VariantProps, cva } from 'class-variance-authority';

const weddingCardVariants = cva(
  'rounded-lg border shadow-sm transition-all duration-300',
  {
    variants: {
      variant: {
        default: 'bg-card text-card-foreground border-border/50',
        elegant: 'bg-card text-card-foreground border-sage-green/20 shadow-sage-green/10',
        romantic: 'bg-blush-pink/30 text-charcoal border-blush-pink/50',
        cream: 'bg-cream text-charcoal border-cream-dark/50',
        glass: 'bg-white/70 backdrop-blur-sm border-white/20 shadow-lg',
        gradient: 'wedding-gradient text-charcoal border-transparent',
      },
      padding: {
        none: '',
        sm: 'p-4',
        md: 'p-6',
        lg: 'p-8',
        xl: 'p-10',
      },
      hover: {
        none: '',
        lift: 'hover:-translate-y-1 hover:shadow-lg',
        glow: 'hover:shadow-lg hover:shadow-primary/25',
        scale: 'hover:scale-[1.02]',
      },
    },
    defaultVariants: {
      variant: 'default',
      padding: 'md',
      hover: 'lift',
    },
  }
);

export interface WeddingCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof weddingCardVariants> {}

const WeddingCard = React.forwardRef<HTMLDivElement, WeddingCardProps>(
  ({ className, variant, padding, hover, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(weddingCardVariants({ variant, padding, hover, className }))}
      {...props}
    />
  )
);
WeddingCard.displayName = 'WeddingCard';

const WeddingCardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex flex-col space-y-1.5 pb-6', className)}
    {...props}
  />
));
WeddingCardHeader.displayName = 'WeddingCardHeader';

const WeddingCardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn('font-serif text-card-title font-semibold leading-none tracking-tight text-charcoal', className)}
    {...props}
  />
));
WeddingCardTitle.displayName = 'WeddingCardTitle';

const WeddingCardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-sm text-muted-foreground leading-relaxed', className)}
    {...props}
  />
));
WeddingCardDescription.displayName = 'WeddingCardDescription';

const WeddingCardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('', className)} {...props} />
));
WeddingCardContent.displayName = 'WeddingCardContent';

const WeddingCardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex items-center pt-6', className)}
    {...props}
  />
));
WeddingCardFooter.displayName = 'WeddingCardFooter';

export {
  WeddingCard,
  WeddingCardHeader,
  WeddingCardFooter,
  WeddingCardTitle,
  WeddingCardDescription,
  WeddingCardContent,
  weddingCardVariants,
};
