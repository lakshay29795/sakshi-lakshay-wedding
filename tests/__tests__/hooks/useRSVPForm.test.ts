import { renderHook, act } from '@testing-library/react';
import { useRSVPForm } from '@/hooks/useRSVPForm';
import { RSVPFormInput } from '@/lib/validations/rsvp';

// Mock the generateId function
jest.mock('@/lib/utils', () => ({
  ...jest.requireActual('@/lib/utils'),
  generateId: jest.fn(() => 'mock-id-123'),
}));

describe('useRSVPForm', () => {
  it('initializes with default values', () => {
    const { result } = renderHook(() => useRSVPForm());

    expect(result.current.currentStep).toBe(1);
    expect(result.current.totalSteps).toBe(4);
    expect(result.current.canProceed).toBe(true);
    expect(result.current.form).toBeDefined();
    expect(result.current.formState).toBeDefined();
  });

  it('initializes with provided initial data', () => {
    const initialData: Partial<RSVPFormInput> = {
      primaryGuestName: 'John Doe',
      primaryGuestEmail: 'john@example.com',
      isAttending: false,
    };

    const { result } = renderHook(() => useRSVPForm(initialData));

    const formValues = result.current.form.getValues();
    expect(formValues.primaryGuestName).toBe('John Doe');
    expect(formValues.primaryGuestEmail).toBe('john@example.com');
    expect(formValues.isAttending).toBe(false);
  });

  it('navigates between steps correctly', () => {
    const { result } = renderHook(() => useRSVPForm());

    // Start at step 1
    expect(result.current.currentStep).toBe(1);

    // Go to next step
    act(() => {
      result.current.nextStep();
    });
    expect(result.current.currentStep).toBe(2);

    // Go to previous step
    act(() => {
      result.current.prevStep();
    });
    expect(result.current.currentStep).toBe(1);
  });

  it('skips guest details step when not attending', () => {
    const { result } = renderHook(() => useRSVPForm());

    // Set not attending
    act(() => {
      result.current.form.setValue('isAttending', false);
    });

    // Navigate to step 2
    act(() => {
      result.current.nextStep();
    });
    expect(result.current.currentStep).toBe(2);

    // Navigate to next step should skip step 3 (guest details)
    act(() => {
      result.current.nextStep();
    });
    expect(result.current.currentStep).toBe(4); // Should skip to step 4
  });

  it('manages guests correctly', () => {
    const { result } = renderHook(() => useRSVPForm());

    // Initially no guests
    expect(result.current.form.getValues().guests).toEqual([]);

    // Add a guest
    act(() => {
      result.current.addGuest();
    });

    const guests = result.current.form.getValues().guests;
    expect(guests).toHaveLength(1);
    expect(guests[0]).toEqual({
      id: 'mock-id-123',
      fullName: '',
      isAttending: true,
      mealPreference: 'regular',
    });

    // Remove the guest
    act(() => {
      result.current.removeGuest('mock-id-123');
    });

    expect(result.current.form.getValues().guests).toHaveLength(0);
  });

  it('prevents adding more than 10 guests', () => {
    const { result } = renderHook(() => useRSVPForm());

    // Add 10 guests
    act(() => {
      for (let i = 0; i < 10; i++) {
        result.current.addGuest();
      }
    });

    expect(result.current.form.getValues().guests).toHaveLength(10);

    // Try to add 11th guest - should not be added
    act(() => {
      result.current.addGuest();
    });

    expect(result.current.form.getValues().guests).toHaveLength(10);
  });

  it('updates guest information correctly', () => {
    const { result } = renderHook(() => useRSVPForm());

    // Add a guest
    act(() => {
      result.current.addGuest();
    });

    const guestId = result.current.form.getValues().guests[0].id;

    // Update guest
    act(() => {
      result.current.updateGuest(guestId, {
        fullName: 'Jane Doe',
        mealPreference: 'vegetarian',
        dietaryRestrictions: 'No nuts',
      });
    });

    const updatedGuest = result.current.form.getValues().guests[0];
    expect(updatedGuest.fullName).toBe('Jane Doe');
    expect(updatedGuest.mealPreference).toBe('vegetarian');
    expect(updatedGuest.dietaryRestrictions).toBe('No nuts');
  });

  it('validates form data correctly', async () => {
    const { result } = renderHook(() => useRSVPForm());

    // Test with invalid data
    act(() => {
      result.current.form.setValue('primaryGuestName', '');
      result.current.form.setValue('primaryGuestEmail', 'invalid-email');
    });

    const isValid = await act(async () => {
      return await result.current.form.trigger();
    });

    expect(isValid).toBe(false);
    expect(result.current.form.formState.errors.primaryGuestName).toBeDefined();
    expect(result.current.form.formState.errors.primaryGuestEmail).toBeDefined();
  });

  it('handles form submission', async () => {
    const mockSubmit = jest.fn().mockResolvedValue(undefined);
    const { result } = renderHook(() => useRSVPForm());

    // Set valid form data
    act(() => {
      result.current.form.setValue('primaryGuestName', 'John Doe');
      result.current.form.setValue('primaryGuestEmail', 'john@example.com');
      result.current.form.setValue('isAttending', true);
    });

    // Submit form
    await act(async () => {
      await result.current.handleSubmit(mockSubmit)();
    });

    expect(mockSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        primaryGuestName: 'John Doe',
        primaryGuestEmail: 'john@example.com',
        isAttending: true,
      })
    );
  });
});
