'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useRSVPForm } from '@/hooks/useRSVPForm';
import { RSVPStepIndicator } from './RSVPStepIndicator';
import { BasicInfoStep } from './steps/BasicInfoStep';
import { AttendanceStep } from './steps/AttendanceStep';
import { GuestDetailsStep } from './steps/GuestDetailsStep';
import { AdditionalInfoStep } from './steps/AdditionalInfoStep';
import { RSVPNavigation } from './RSVPNavigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Container } from '@/components/ui/container';
import { Form } from '@/components/ui/form';
import type { RSVPFormData } from '@/types/rsvp';

interface RSVPFormProps {
  onSubmit?: (data: RSVPFormData) => Promise<void>;
  initialData?: Partial<RSVPFormData>;
  className?: string;
}

const stepComponents = {
  1: BasicInfoStep,
  2: AttendanceStep,
  3: GuestDetailsStep,
  4: AdditionalInfoStep,
};

export function RSVPForm({ onSubmit, initialData, className }: RSVPFormProps) {
  const rsvpForm = useRSVPForm({
    onSubmit,
    initialData,
    onStepChange: (step) => {
      // Scroll to top when step changes
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
  });

  const {
    form,
    currentStep,
    totalSteps,
    steps,
    nextStep,
    prevStep,
    canProceed,
    handleSubmit,
    isSubmitting,
    submitError,
    watch,
  } = rsvpForm;

  const watchedValues = watch();
  const CurrentStepComponent = stepComponents[currentStep as keyof typeof stepComponents];

  // Animation variants
  const stepVariants = {
    enter: {
      x: 300,
      opacity: 0,
    },
    center: {
      x: 0,
      opacity: 1,
    },
    exit: {
      x: -300,
      opacity: 0,
    },
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <Container className={className}>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-2xl mx-auto"
      >
        {/* Header */}
        <motion.div
          variants={containerVariants}
          className="text-center mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-serif text-sage-green mb-4">
            RSVP
          </h1>
          <p className="text-lg text-muted-foreground max-w-md mx-auto">
            We can't wait to celebrate with you! Please let us know if you'll be joining us.
          </p>
        </motion.div>

        {/* Step Indicator */}
        <motion.div variants={containerVariants} className="mb-8">
          <RSVPStepIndicator
            steps={steps}
            currentStep={currentStep}
            isAttending={watchedValues.isAttending}
          />
        </motion.div>

        {/* Form Card */}
        <motion.div variants={containerVariants}>
          <Card className="wedding-card">
            <CardHeader>
              <CardTitle className="text-center">
                {steps[currentStep - 1]?.title}
              </CardTitle>
              <p className="text-center text-muted-foreground">
                {steps[currentStep - 1]?.description}
              </p>
            </CardHeader>

            <CardContent>
              <Form {...form}>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Debug: Check if form context is available */}
                  {console.log('Form object:', form)}
                  {console.log('Form context available:', !!form)}
                  {/* Step Content */}
                  <div className="min-h-[400px] relative overflow-hidden">
                    <div className="absolute inset-0">
                      <CurrentStepComponent
                        form={form}
                        rsvpForm={rsvpForm}
                        isAttending={watchedValues.isAttending}
                      />
                    </div>
                  </div>

                {/* Error Display */}
                {submitError && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg"
                  >
                    <p className="text-destructive text-sm font-medium">
                      {submitError}
                    </p>
                  </motion.div>
                )}

                {/* Navigation */}
                <RSVPNavigation
                  currentStep={currentStep}
                  totalSteps={totalSteps}
                  canProceed={canProceed}
                  isSubmitting={isSubmitting}
                  isAttending={watchedValues.isAttending}
                  onNext={nextStep}
                  onPrev={prevStep}
                />
                </form>
              </Form>
            </CardContent>
          </Card>
        </motion.div>

        {/* Progress Summary */}
        <motion.div
          variants={containerVariants}
          className="mt-8 text-center text-sm text-muted-foreground"
        >
          Step {currentStep} of {totalSteps}
          {!watchedValues.isAttending && currentStep === 3 && (
            <span className="ml-2">(Skipped - Not Attending)</span>
          )}
        </motion.div>
      </motion.div>
    </Container>
  );
}
