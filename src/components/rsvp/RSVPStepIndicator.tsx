import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { CheckCircle2 } from 'lucide-react';

interface RSVPStepIndicatorProps {
  currentStep: number;
  steps: { id: number; title: string }[];
}

export function RSVPStepIndicator({ currentStep, steps }: RSVPStepIndicatorProps) {
  return (
    <div className="flex justify-center items-center space-x-2 md:space-x-4 py-4" data-testid="step-indicator">
      {steps.map((step, index) => (
        <React.Fragment key={step.id}>
          <motion.div
            className={cn(
              'flex items-center space-x-2 transition-all duration-300',
              currentStep >= step.id ? 'text-sage-green' : 'text-muted-foreground'
            )}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            data-testid={`step-${step.id}`}
          >
            <div
              className={cn(
                'w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm',
                currentStep > step.id
                  ? 'bg-sage-green text-primary-foreground completed'
                  : currentStep === step.id
                    ? 'bg-blush-pink text-charcoal border-2 border-sage-green'
                    : 'bg-soft-gray text-muted-foreground border border-border'
              )}
            >
              {currentStep > step.id ? <CheckCircle2 size={16} /> : step.id}
            </div>
            <span className="hidden sm:inline-block text-sm md:text-base">{step.title}</span>
          </motion.div>
          {index < steps.length - 1 && (
            <div
              className={cn(
                'h-0.5 w-8 md:w-12 transition-all duration-300',
                currentStep > step.id ? 'bg-sage-green' : 'bg-border'
              )}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}