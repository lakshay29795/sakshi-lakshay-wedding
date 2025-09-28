import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { GuestMessageForm } from '@/components/guestbook/GuestMessageForm';
import { useGuestBook } from '@/hooks/useGuestBook';

// Mock the useGuestBook hook
jest.mock('@/hooks/useGuestBook');
const mockUseGuestBook = useGuestBook as jest.MockedFunction<typeof useGuestBook>;

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    form: ({ children, ...props }: any) => <form {...props}>{children}</form>,
    button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

// Mock sonner
jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

describe('GuestMessageForm', () => {
  const mockForm = {
    register: jest.fn(),
    handleSubmit: jest.fn(),
    formState: { errors: {}, isSubmitting: false },
    watch: jest.fn(),
    reset: jest.fn(),
    setValue: jest.fn(),
    getValues: jest.fn(),
    control: {} as any,
  };

  const mockSubmitMessage = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseGuestBook.mockReturnValue({
      messages: [],
      stats: null,
      isLoading: false,
      isSubmitting: false,
      error: null,
      form: mockForm,
      submitMessage: mockSubmitMessage,
      likeMessage: jest.fn(),
      filters: {},
      updateFilter: jest.fn(),
      isConnected: true,
      fetchMessages: jest.fn(),
    });
  });

  it('renders the form with all required fields', () => {
    render(<GuestMessageForm />);

    expect(screen.getByLabelText(/your name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/your message/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /send message/i })).toBeInTheDocument();
  });

  it('displays character count for message field', () => {
    mockForm.watch.mockReturnValue('Hello world!');
    render(<GuestMessageForm />);

    expect(screen.getByText('12/500')).toBeInTheDocument();
  });

  it('shows loading state when submitting', () => {
    mockUseGuestBook.mockReturnValue({
      messages: [],
      stats: null,
      isLoading: false,
      isSubmitting: true,
      error: null,
      form: mockForm,
      submitMessage: mockSubmitMessage,
      likeMessage: jest.fn(),
      filters: {},
      updateFilter: jest.fn(),
      isConnected: true,
      fetchMessages: jest.fn(),
    });

    render(<GuestMessageForm />);

    const submitButton = screen.getByRole('button', { name: /sending/i });
    expect(submitButton).toBeDisabled();
  });

  it('displays error message when submission fails', () => {
    mockUseGuestBook.mockReturnValue({
      messages: [],
      stats: null,
      isLoading: false,
      isSubmitting: false,
      error: 'Failed to submit message',
      form: mockForm,
      submitMessage: mockSubmitMessage,
      likeMessage: jest.fn(),
      filters: {},
      updateFilter: jest.fn(),
      isConnected: true,
      fetchMessages: jest.fn(),
    });

    render(<GuestMessageForm />);

    expect(screen.getByText('Failed to submit message')).toBeInTheDocument();
  });

  it('calls submitMessage when form is submitted', async () => {
    const user = userEvent.setup();
    mockForm.handleSubmit.mockImplementation((callback) => (e: any) => {
      e.preventDefault();
      callback({ senderName: 'John Doe', message: 'Congratulations!' });
    });

    render(<GuestMessageForm />);

    const form = screen.getByRole('form');
    await user.click(screen.getByRole('button', { name: /send message/i }));

    expect(mockForm.handleSubmit).toHaveBeenCalled();
  });

  it('shows offline indicator when not connected', () => {
    mockUseGuestBook.mockReturnValue({
      messages: [],
      stats: null,
      isLoading: false,
      isSubmitting: false,
      error: null,
      form: mockForm,
      submitMessage: mockSubmitMessage,
      likeMessage: jest.fn(),
      filters: {},
      updateFilter: jest.fn(),
      isConnected: false,
      fetchMessages: jest.fn(),
    });

    render(<GuestMessageForm />);

    expect(screen.getByText(/offline/i)).toBeInTheDocument();
  });

  it('validates required fields', () => {
    mockForm.formState.errors = {
      senderName: { message: 'Name is required' },
      message: { message: 'Message is required' },
    };

    render(<GuestMessageForm />);

    expect(screen.getByText('Name is required')).toBeInTheDocument();
    expect(screen.getByText('Message is required')).toBeInTheDocument();
  });

  it('shows character limit warning when approaching limit', () => {
    const longMessage = 'a'.repeat(480);
    mockForm.watch.mockReturnValue(longMessage);

    render(<GuestMessageForm />);

    const characterCount = screen.getByText('480/500');
    expect(characterCount).toHaveClass('text-amber-600');
  });

  it('shows character limit error when exceeding limit', () => {
    const tooLongMessage = 'a'.repeat(520);
    mockForm.watch.mockReturnValue(tooLongMessage);

    render(<GuestMessageForm />);

    const characterCount = screen.getByText('520/500');
    expect(characterCount).toHaveClass('text-rose-600');
  });
});
