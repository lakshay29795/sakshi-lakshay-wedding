import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { GuestMessageCard } from '@/components/guestbook/GuestMessageCard';
import { GuestMessage } from '@/types/guestbook';

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
  },
}));

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  Heart: ({ className, ...props }: any) => <div data-testid="heart-icon" className={className} {...props} />,
  Clock: ({ className, ...props }: any) => <div data-testid="clock-icon" className={className} {...props} />,
  Star: ({ className, ...props }: any) => <div data-testid="star-icon" className={className} {...props} />,
}));

describe('GuestMessageCard', () => {
  const mockMessage: GuestMessage = {
    id: 'test-message-1',
    guestName: 'John Doe',
    guestEmail: 'john@example.com',
    message: 'Congratulations on your special day! Wishing you both a lifetime of happiness.',
    submittedAt: new Date('2024-01-15T10:30:00Z'),
    status: 'approved',
    likes: 5,
    likedBy: [],
    isHighlighted: false,
  };

  const mockOnLike = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders message content correctly', () => {
    render(<GuestMessageCard message={mockMessage} onLike={mockOnLike} />);

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText(mockMessage.message)).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('displays highlighted badge for highlighted messages', () => {
    const highlightedMessage = { ...mockMessage, isHighlighted: true };
    render(<GuestMessageCard message={highlightedMessage} onLike={mockOnLike} />);

    expect(screen.getByText(/featured/i)).toBeInTheDocument();
    expect(screen.getByTestId('star-icon')).toBeInTheDocument();
  });

  it('formats timestamp correctly', () => {
    render(<GuestMessageCard message={mockMessage} onLike={mockOnLike} />);

    // Should display relative time
    expect(screen.getByText(/ago/)).toBeInTheDocument();
  });

  it('calls onLike when like button is clicked', async () => {
    const user = userEvent.setup();
    render(<GuestMessageCard message={mockMessage} onLike={mockOnLike} />);

    const likeButton = screen.getByRole('button', { name: /like/i });
    await user.click(likeButton);

    expect(mockOnLike).toHaveBeenCalledWith(mockMessage.id);
  });

  it('shows liked state when user has liked the message', () => {
    const likedMessage = { ...mockMessage, likedBy: ['current-user-ip'] };
    render(<GuestMessageCard message={likedMessage} onLike={mockOnLike} currentUserIp="current-user-ip" />);

    const likeButton = screen.getByRole('button', { name: /liked/i });
    expect(likeButton).toHaveClass('text-rose-500');
  });

  it('disables like button when onLike is not provided', () => {
    render(<GuestMessageCard message={mockMessage} />);

    const likeButton = screen.getByRole('button', { name: /like/i });
    expect(likeButton).toBeDisabled();
  });

  it('shows loading state when liking', () => {
    render(<GuestMessageCard message={mockMessage} onLike={mockOnLike} isLiking />);

    const likeButton = screen.getByRole('button');
    expect(likeButton).toBeDisabled();
  });

  it('handles long messages with proper text wrapping', () => {
    const longMessage = {
      ...mockMessage,
      message: 'This is a very long message that should wrap properly and not break the layout. '.repeat(10),
    };

    render(<GuestMessageCard message={longMessage} onLike={mockOnLike} />);

    expect(screen.getByText(longMessage.message)).toBeInTheDocument();
  });

  it('displays pending status for pending messages', () => {
    const pendingMessage = { ...mockMessage, status: 'pending' as const };
    render(<GuestMessageCard message={pendingMessage} onLike={mockOnLike} showStatus />);

    expect(screen.getByText(/pending/i)).toBeInTheDocument();
  });

  it('displays rejected status for rejected messages', () => {
    const rejectedMessage = { ...mockMessage, status: 'rejected' as const };
    render(<GuestMessageCard message={rejectedMessage} onLike={mockOnLike} showStatus />);

    expect(screen.getByText(/rejected/i)).toBeInTheDocument();
  });

  it('handles messages without email gracefully', () => {
    const messageWithoutEmail = { ...mockMessage, guestEmail: undefined };
    render(<GuestMessageCard message={messageWithoutEmail} onLike={mockOnLike} />);

    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });

  it('shows zero likes correctly', () => {
    const messageWithNoLikes = { ...mockMessage, likes: 0 };
    render(<GuestMessageCard message={messageWithNoLikes} onLike={mockOnLike} />);

    expect(screen.getByText('0')).toBeInTheDocument();
  });

  it('applies compact styling when compact prop is true', () => {
    render(<GuestMessageCard message={mockMessage} onLike={mockOnLike} compact />);

    const card = screen.getByRole('article');
    expect(card).toHaveClass('p-3'); // Compact padding
  });

  it('handles emoji in messages correctly', () => {
    const emojiMessage = { ...mockMessage, message: 'Congratulations! 🎉💕🥳' };
    render(<GuestMessageCard message={emojiMessage} onLike={mockOnLike} />);

    expect(screen.getByText('Congratulations! 🎉💕🥳')).toBeInTheDocument();
  });
});
