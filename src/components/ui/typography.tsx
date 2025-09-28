import * as React from 'react';
import { cn } from '@/lib/utils';
import { VariantProps, cva } from 'class-variance-authority';

// Heading variants
const headingVariants = cva(
  'font-serif text-charcoal leading-tight tracking-tight',
  {
    variants: {
      variant: {
        default: 'text-charcoal',
        romantic: 'text-sage-green',
        accent: 'text-gold-accent',
        muted: 'text-muted-foreground',
      },
      size: {
        hero: 'text-hero font-bold',
        h1: 'text-4xl md:text-5xl lg:text-6xl font-bold',
        h2: 'text-section-title font-semibold',
        h3: 'text-card-title font-semibold',
        h4: 'text-xl md:text-2xl font-medium',
        h5: 'text-lg md:text-xl font-medium',
        h6: 'text-base md:text-lg font-medium',
      },
      align: {
        left: 'text-left',
        center: 'text-center',
        right: 'text-right',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'h2',
      align: 'left',
    },
  }
);

// Text variants
const textVariants = cva(
  'font-sans leading-relaxed',
  {
    variants: {
      variant: {
        default: 'text-foreground',
        muted: 'text-muted-foreground',
        accent: 'text-accent',
        romantic: 'text-sage-green',
        elegant: 'text-charcoal',
      },
      size: {
        xs: 'text-xs',
        sm: 'text-sm',
        base: 'text-base',
        lg: 'text-lg',
        xl: 'text-xl',
        '2xl': 'text-2xl',
      },
      weight: {
        light: 'font-light',
        normal: 'font-normal',
        medium: 'font-medium',
        semibold: 'font-semibold',
        bold: 'font-bold',
      },
      align: {
        left: 'text-left',
        center: 'text-center',
        right: 'text-right',
        justify: 'text-justify',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'base',
      weight: 'normal',
      align: 'left',
    },
  }
);

// Script text variants (for romantic touches)
const scriptVariants = cva(
  'font-script leading-relaxed',
  {
    variants: {
      variant: {
        default: 'text-sage-green',
        accent: 'text-gold-accent',
        muted: 'text-muted-foreground',
      },
      size: {
        sm: 'text-lg',
        base: 'text-xl',
        lg: 'text-2xl',
        xl: 'text-3xl',
        '2xl': 'text-4xl',
      },
      align: {
        left: 'text-left',
        center: 'text-center',
        right: 'text-right',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'base',
      align: 'center',
    },
  }
);

// Heading Component
export interface HeadingProps
  extends React.HTMLAttributes<HTMLHeadingElement>,
    VariantProps<typeof headingVariants> {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}

const Heading = React.forwardRef<HTMLDivElement, HeadingProps>(
  ({ className, variant, size, align, as: Comp = 'h2', ...props }, ref) => {
    return (
      <Comp
        className={cn(headingVariants({ variant, size, align, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Heading.displayName = 'Heading';

// Text Component
export interface TextProps
  extends React.HTMLAttributes<HTMLParagraphElement>,
    VariantProps<typeof textVariants> {
  as?: 'p' | 'span' | 'div';
}

const Text = React.forwardRef<HTMLDivElement, TextProps>(
  ({ className, variant, size, weight, align, as: Comp = 'p', ...props }, ref) => {
    return (
      <Comp
        className={cn(textVariants({ variant, size, weight, align, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Text.displayName = 'Text';

// Script Component (for romantic text)
export interface ScriptProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof scriptVariants> {
  as?: 'span' | 'div' | 'p';
}

const Script = React.forwardRef<HTMLDivElement, ScriptProps>(
  ({ className, variant, size, align, as: Comp = 'span', ...props }, ref) => {
    return (
      <Comp
        className={cn(scriptVariants({ variant, size, align, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Script.displayName = 'Script';

// Lead text component for introductions
const Lead = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => {
    return (
      <p
        ref={ref}
        className={cn(
          'text-xl text-muted-foreground leading-relaxed font-light',
          className
        )}
        {...props}
      />
    );
  }
);
Lead.displayName = 'Lead';

// Blockquote component
const Blockquote = React.forwardRef<HTMLQuoteElement, React.HTMLAttributes<HTMLQuoteElement>>(
  ({ className, ...props }, ref) => {
    return (
      <blockquote
        ref={ref}
        className={cn(
          'mt-6 border-l-4 border-sage-green pl-6 italic text-lg text-muted-foreground',
          className
        )}
        {...props}
      />
    );
  }
);
Blockquote.displayName = 'Blockquote';

// List components
const List = React.forwardRef<HTMLUListElement, React.HTMLAttributes<HTMLUListElement>>(
  ({ className, ...props }, ref) => {
    return (
      <ul
        ref={ref}
        className={cn('my-6 ml-6 list-disc [&>li]:mt-2', className)}
        {...props}
      />
    );
  }
);
List.displayName = 'List';

const ListItem = React.forwardRef<HTMLLIElement, React.HTMLAttributes<HTMLLIElement>>(
  ({ className, ...props }, ref) => {
    return (
      <li
        ref={ref}
        className={cn('text-muted-foreground', className)}
        {...props}
      />
    );
  }
);
ListItem.displayName = 'ListItem';

export {
  Heading,
  Text,
  Script,
  Lead,
  Blockquote,
  List,
  ListItem,
  headingVariants,
  textVariants,
  scriptVariants,
};
