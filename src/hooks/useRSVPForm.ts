import { useState, useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { RSVPFormData, RSVPFormState, RSVPFormStep, Guest } from '@/types/rsvp';
import { 
  rsvpFormSchema, 
  validateStep, 
  type RSVPFormInput 
} from '@/lib/validations/rsvp';
import { generateId } from '@/lib/utils';

const FORM_STEPS: Omit<RSVPFormStep, 'isComplete' | 'isValid'>[] = [
  {
    id: 'basic-info',
    title: 'Your Information',
    description: 'Tell us who you are',
  },
  {
    id: 'attendance',
    title: 'Will you attend?',
    description: 'Let us know if you can make it',
  },
  {
    id: 'guest-details',
    title: 'Guest Details',
    description: 'Information about your party',
  },
  {
    id: 'additional-info',
    title: 'Final Details',
    description: 'Any special requests or messages',
  },
];

interface UseRSVPFormOptions {
  onSubmit?: (data: RSVPFormData) => Promise<void>;
  onStepChange?: (step: number) => void;
  initialData?: Partial<RSVPFormData>;
}

export function useRSVPForm(options: UseRSVPFormOptions = {}) {
  const { onSubmit, onStepChange, initialData } = options;

  // Form state
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // React Hook Form setup
  const form = useForm<RSVPFormInput>({
    resolver: zodResolver(rsvpFormSchema),
    defaultValues: {
      primaryGuestName: '',
      primaryGuestEmail: '',
      phone: '',
      isAttending: true,
      guests: [],
      totalGuests: 1,
      message: '',
      songRequest: '',
      accommodationNeeded: false,
      transportationNeeded: false,
      ...initialData,
    },
    mode: 'onChange',
  });

  const { watch, getValues, setValue, trigger, formState: { errors } } = form;
  const watchedValues = watch();

  // Calculate step completion and validity
  const getStepStatus = useCallback((stepNumber: number) => {
    const currentData = getValues();
    
    try {
      const validation = validateStep(stepNumber, currentData);
      return {
        isValid: validation.success,
        isComplete: validation.success,
      };
    } catch {
      return {
        isValid: false,
        isComplete: false,
      };
    }
  }, [getValues]);

  // Generate steps with status
  const steps: RSVPFormStep[] = FORM_STEPS.map((step, index) => {
    const stepNumber = index + 1;
    const status = getStepStatus(stepNumber);
    
    return {
      ...step,
      ...status,
    };
  });

  // Navigation functions
  const goToStep = useCallback(async (step: number) => {
    if (step < 1 || step > FORM_STEPS.length) return false;

    // Validate current step before moving forward
    if (step > currentStep) {
      const isCurrentStepValid = await trigger();
      if (!isCurrentStepValid) return false;
    }

    setCurrentStep(step);
    onStepChange?.(step);
    return true;
  }, [currentStep, trigger, onStepChange]);

  const nextStep = useCallback(async () => {
    const success = await goToStep(currentStep + 1);
    return success;
  }, [currentStep, goToStep]);

  const prevStep = useCallback(() => {
    return goToStep(currentStep - 1);
  }, [currentStep, goToStep]);

  // Guest management functions
  const addGuest = useCallback(() => {
    const currentGuests = getValues('guests') || [];
    const newGuest: Guest = {
      id: generateId(),
      name: '',
      mealPreference: 'regular',
      dietaryRestrictions: '',
    };
    
    const updatedGuests = [...currentGuests, newGuest];
    setValue('guests', updatedGuests);
    setValue('totalGuests', updatedGuests.length);
  }, [getValues, setValue]);

  const removeGuest = useCallback((guestId: string) => {
    const currentGuests = getValues('guests') || [];
    const updatedGuests = currentGuests.filter(guest => guest.id !== guestId);
    
    setValue('guests', updatedGuests);
    setValue('totalGuests', Math.max(1, updatedGuests.length));
  }, [getValues, setValue]);

  const updateGuest = useCallback((guestId: string, updates: Partial<Guest>) => {
    const currentGuests = getValues('guests') || [];
    const updatedGuests = currentGuests.map(guest =>
      guest.id === guestId ? { ...guest, ...updates } : guest
    );
    
    setValue('guests', updatedGuests);
  }, [getValues, setValue]);

  // Initialize primary guest
  useEffect(() => {
    const currentGuests = getValues('guests');
    if (currentGuests.length === 0) {
      const primaryGuest: Guest = {
        id: generateId(),
        name: watchedValues.primaryGuestName || '',
        email: watchedValues.primaryGuestEmail || '',
        mealPreference: 'regular',
      };
      setValue('guests', [primaryGuest]);
    }
  }, [getValues, setValue, watchedValues.primaryGuestName, watchedValues.primaryGuestEmail]);

  // Update primary guest when basic info changes
  useEffect(() => {
    const currentGuests = getValues('guests');
    if (currentGuests.length > 0) {
      const updatedGuests = [...currentGuests];
      updatedGuests[0] = {
        ...updatedGuests[0],
        name: watchedValues.primaryGuestName || '',
        email: watchedValues.primaryGuestEmail || '',
      };
      setValue('guests', updatedGuests);
    }
  }, [watchedValues.primaryGuestName, watchedValues.primaryGuestEmail, getValues, setValue]);

  // Form submission
  const handleSubmit = useCallback(async (data: RSVPFormInput) => {
    if (!onSubmit) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      await onSubmit(data as RSVPFormData);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  }, [onSubmit]);

  // Form state summary
  const formState: RSVPFormState = {
    currentStep,
    totalSteps: FORM_STEPS.length,
    steps,
    formData: watchedValues,
    isLoading: false,
    isSubmitting,
    errors: Object.keys(errors).reduce((acc, key) => {
      acc[key] = errors[key as keyof typeof errors]?.message || '';
      return acc;
    }, {} as Record<string, string>),
  };

  // Skip guest details step if not attending
  const effectiveCurrentStep = !watchedValues.isAttending && currentStep === 3 ? 4 : currentStep;
  const canProceed = currentStep < FORM_STEPS.length && 
    (currentStep !== 3 || watchedValues.isAttending);

  return {
    // Form methods
    form,
    formState,
    
    // Navigation
    currentStep: effectiveCurrentStep,
    totalSteps: FORM_STEPS.length,
    steps,
    goToStep,
    nextStep,
    prevStep,
    canProceed,
    
    // Guest management
    addGuest,
    removeGuest,
    updateGuest,
    
    // Submission
    handleSubmit: form.handleSubmit(handleSubmit),
    isSubmitting,
    submitError,
    
    // Utilities
    watch,
    getValues,
    setValue,
    trigger,
    errors,
  };
}
