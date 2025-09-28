import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface RSVPNavigationProps {
  currentStep: number;
  totalSteps: number;
  onNext: () => void;
  onPrevious: () => void;
  isSubmitting: boolean;
  isSubmitted: boolean;
  isAttending: boolean;
  canProceed: boolean;
}

export function RSVPNavigation({
  currentStep,
  totalSteps,
  onNext,
  onPrevious,
  isSubmitting,
  isSubmitted,
  isAttending,
  canProceed,
}: RSVPNavigationProps) {
  const isLastStep = currentStep === totalSteps || (currentStep === 2 && !isAttending);

  if (isSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center text-sage-green font-serif text-xl mt-8"
      >
        Thank you for your RSVP!
      </motion.div>
    );
  }

  return (
    <div className="flex justify-between mt-8">
      <Button
        type="button"
        onClick={onPrevious}
        disabled={currentStep === 1 || isSubmitting}
        className="wedding-button-secondary"
      >
        Previous
      </Button>
      <Button
        type={isLastStep ? 'submit' : 'button'}
        onClick={isLastStep ? undefined : onNext}
        disabled={isSubmitting || !canProceed}
        className="wedding-button"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Submitting...
          </>
        ) : isLastStep ? (
          'Submit RSVP'
        ) : (
          'Continue'
        )}
      </Button>
    </div>
  );
}