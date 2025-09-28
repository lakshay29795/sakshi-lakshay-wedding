import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RSVPForm } from '@/components/rsvp/RSVPForm';
import { RSVPFormData } from '@/types/rsvp';

// Mock the generateId function
jest.mock('@/lib/utils', () => ({
  ...jest.requireActual('@/lib/utils'),
  generateId: jest.fn(() => 'mock-id-' + Math.random().toString(36).substring(7)),
}));

// Mock Framer Motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    section: ({ children, ...props }: any) => <section {...props}>{children}</section>,
    button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
    img: ({ children, ...props }: any) => <img {...props}>{children}</img>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
  useInView: () => true,
  useScroll: () => ({ scrollY: { get: () => 0 } }),
  useTransform: () => 0,
  useAnimation: () => ({
    start: jest.fn(),
    stop: jest.fn(),
    set: jest.fn(),
  }),
}));

describe('RSVPForm', () => {
  const mockOnSubmit = jest.fn((data: RSVPFormData) => Promise.resolve());
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    jest.clearAllMocks();
    user = userEvent.setup();
  });

  it('renders the RSVP form with initial step', async () => {
    render(<RSVPForm onSubmit={mockOnSubmit} />);

    // Wait for form to render
    await waitFor(() => {
      expect(screen.getByText('Your Information')).toBeInTheDocument();
    });
    
    expect(screen.getByLabelText(/Full Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /continue/i })).toBeInTheDocument();
  });

  it('validates required fields in step 1', async () => {
    render(<RSVPForm onSubmit={mockOnSubmit} />);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /continue/i })).toBeInTheDocument();
    });

    const continueButton = screen.getByRole('button', { name: /continue/i });
    await user.click(continueButton);

    await waitFor(() => {
      expect(screen.getByText(/full name is required/i)).toBeInTheDocument();
    });
    
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('progresses through steps with valid data', async () => {
    render(<RSVPForm onSubmit={mockOnSubmit} />);

    // Wait for form to load
    await waitFor(() => {
      expect(screen.getByLabelText(/Full Name/i)).toBeInTheDocument();
    });

    // Step 1: Fill basic info
    await user.type(screen.getByLabelText(/Full Name/i), 'John Doe');
    await user.type(screen.getByLabelText(/Email/i), 'john.doe@example.com');
    
    const continueButton = screen.getByRole('button', { name: /continue/i });
    await user.click(continueButton);

    // Step 2: Should show attendance step
    await waitFor(() => {
      expect(screen.getByText(/Will you be joining us/i)).toBeInTheDocument();
    });
  });

  it('handles form submission', async () => {
    render(<RSVPForm onSubmit={mockOnSubmit} />);

    // Fill out the form completely
    await waitFor(() => {
      expect(screen.getByLabelText(/Full Name/i)).toBeInTheDocument();
    });

    // Step 1: Basic info
    await user.type(screen.getByLabelText(/Full Name/i), 'John Doe');
    await user.type(screen.getByLabelText(/Email/i), 'john.doe@example.com');
    await user.click(screen.getByRole('button', { name: /continue/i }));

    // Step 2: Attendance (default is attending)
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /continue/i })).toBeInTheDocument();
    });
    await user.click(screen.getByRole('button', { name: /continue/i }));

    // Step 3: Guest details
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /continue/i })).toBeInTheDocument();
    });
    await user.click(screen.getByRole('button', { name: /continue/i }));

    // Step 4: Final step with submit
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /submit rsvp/i })).toBeInTheDocument();
    });
    
    const submitButton = screen.getByRole('button', { name: /submit rsvp/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          primaryGuestName: 'John Doe',
          primaryGuestEmail: 'john.doe@example.com',
          isAttending: true,
        })
      );
    });
  });

  it('skips guest details when not attending', async () => {
    render(<RSVPForm onSubmit={mockOnSubmit} />);

    await waitFor(() => {
      expect(screen.getByLabelText(/Full Name/i)).toBeInTheDocument();
    });

    // Step 1: Fill basic info
    await user.type(screen.getByLabelText(/Full Name/i), 'John Doe');
    await user.type(screen.getByLabelText(/Email/i), 'john.doe@example.com');
    await user.click(screen.getByRole('button', { name: /continue/i }));

    // Step 2: Select "No" for attendance
    await waitFor(() => {
      expect(screen.getByText(/Will you be joining us/i)).toBeInTheDocument();
    });
    
    const noButton = screen.getByRole('button', { name: /can't make it/i });
    await user.click(noButton);
    await user.click(screen.getByRole('button', { name: /continue/i }));

    // Should skip to final step
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /submit rsvp/i })).toBeInTheDocument();
    });
    
    expect(screen.queryByText(/Who is attending/i)).not.toBeInTheDocument();
  });
});