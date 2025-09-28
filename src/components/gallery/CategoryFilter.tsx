'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface Category {
  id: string;
  label: string;
  count: number;
}

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory: string;
  onCategoryChange: (categoryId: string) => void;
  className?: string;
}

export function CategoryFilter({
  categories,
  selectedCategory,
  onCategoryChange,
  className,
}: CategoryFilterProps) {
  return (
    <div className={cn('flex flex-wrap gap-2 justify-center', className)}>
      {categories.map((category, index) => {
        const isSelected = selectedCategory === category.id;
        
        return (
          <motion.button
            key={category.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            onClick={() => onCategoryChange(category.id)}
            className={cn(
              'relative px-6 py-3 rounded-full font-medium transition-all duration-300',
              'hover:shadow-lg hover:-translate-y-0.5',
              isSelected
                ? 'bg-sage-green text-white shadow-md'
                : 'bg-white text-charcoal border border-border hover:border-sage-green/50'
            )}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {/* Background animation */}
            {isSelected && (
              <motion.div
                layoutId="categoryBackground"
                className="absolute inset-0 bg-sage-green rounded-full"
                transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
              />
            )}
            
            {/* Content */}
            <span className="relative z-10 flex items-center gap-2">
              {category.label}
              <span
                className={cn(
                  'px-2 py-0.5 rounded-full text-xs font-semibold',
                  isSelected
                    ? 'bg-white/20 text-white'
                    : 'bg-sage-green/10 text-sage-green'
                )}
              >
                {category.count}
              </span>
            </span>
          </motion.button>
        );
      })}
    </div>
  );
}
