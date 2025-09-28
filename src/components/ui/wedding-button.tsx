import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const weddingButtonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-300 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*="size-"])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm hover:shadow-md transform hover:-translate-y-0.5',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border hover:border-primary/50',
        romantic: 'bg-blush-pink text-charcoal hover:bg-blush-pink/80 shadow-sm hover:shadow-md',
        elegant: 'bg-sage-green text-white hover:bg-sage-green/90 shadow-sm hover:shadow-lg',
        accent: 'bg-gold-accent text-white hover:bg-gold-accent/90 shadow-sm hover:shadow-lg',
        outline: 'border border-primary text-primary hover:bg-primary hover:text-primary-foreground',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-10 px-6 py-2',
        sm: 'h-8 px-4 text-xs',
        lg: 'h-12 px-8 text-base',
        xl: 'h-14 px-10 text-lg',
        icon: 'h-10 w-10',
      },
      animation: {
        none: '',
        lift: 'hover:-translate-y-1',
        glow: 'hover:shadow-lg hover:shadow-primary/25',
        scale: 'hover:scale-105 active:scale-95',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      animation: 'lift',
    },
  }
);

export interface WeddingButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof weddingButtonVariants> {
  asChild?: boolean;
}

const WeddingButton = React.forwardRef<HTMLButtonElement, WeddingButtonProps>(
  ({ className, variant, size, animation, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(weddingButtonVariants({ variant, size, animation, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
WeddingButton.displayName = 'WeddingButton';

export { WeddingButton, weddingButtonVariants };
