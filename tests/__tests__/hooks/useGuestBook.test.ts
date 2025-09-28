import { renderHook, act, waitFor } from '@testing-library/react';
import { useGuestBook } from '@/hooks/useGuestBook';
import { GuestMessage } from '@/types/guestbook';

// Mock fetch
global.fetch = jest.fn();
const mockFetch = fetch as jest.MockedFunction<typeof fetch>;

// Mock react-hook-form
jest.mock('react-hook-form', () => ({
  useForm: () => ({
    register: jest.fn(),
    handleSubmit: jest.fn((callback) => (data: any) => callback(data)),
    formState: { errors: {} },
    watch: jest.fn(),
    reset: jest.fn(),
    setValue: jest.fn(),
    getValues: jest.fn(),
    control: {},
  }),
}));

// Mock sonner
jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

// Mock use-debounce
jest.mock('use-debounce', () => ({
  useDebounce: (value: any) => [value],
}));

describe('useGuestBook', () => {
  const mockMessages: GuestMessage[] = [
    {
      id: '1',
      guestName: 'John Doe',
      message: 'Congratulations!',
      submittedAt: new Date('2024-01-15T10:00:00Z'),
      status: 'approved',
      likes: 5,
      likedBy: [],
      isHighlighted: false,
    },
    {
      id: '2',
      guestName: 'Jane Smith',
      message: 'So happy for you both!',
      submittedAt: new Date('2024-01-15T11:00:00Z'),
      status: 'approved',
      likes: 3,
      likedBy: [],
      isHighlighted: true,
    },
  ];

  const mockStats = {
    totalMessages: 2,
    approvedMessages: 2,
    pendingMessages: 0,
    rejectedMessages: 0,
    totalLikes: 8,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('fetches messages on mount', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        data: {
          messages: mockMessages,
          stats: mockStats,
        },
      }),
    } as Response);

    const { result } = renderHook(() => useGuestBook());

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.messages).toEqual(mockMessages);
    expect(result.current.stats).toEqual(mockStats);
    expect(mockFetch).toHaveBeenCalledWith('/api/guestbook?');
  });

  it('handles fetch errors gracefully', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network error'));

    const { result } = renderHook(() => useGuestBook());

    await waitFor(() => {
      expect(result.current.error).toBe('Network error');
      expect(result.current.isConnected).toBe(false);
    });
  });

  it('submits new messages successfully', async () => {
    const newMessage = {
      id: '3',
      guestName: 'Bob Wilson',
      message: 'Best wishes!',
      submittedAt: new Date(),
      status: 'pending' as const,
      likes: 0,
      likedBy: [],
      isHighlighted: false,
    };

    // Mock initial fetch
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        data: { messages: mockMessages, stats: mockStats },
      }),
    } as Response);

    // Mock submit response
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        data: newMessage,
        message: 'Message submitted successfully!',
      }),
    } as Response);

    // Mock refresh fetch
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        data: {
          messages: [...mockMessages, newMessage],
          stats: { ...mockStats, totalMessages: 3, pendingMessages: 1 },
        },
      }),
    } as Response);

    const { result } = renderHook(() => useGuestBook());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await act(async () => {
      await result.current.submitMessage({
        senderName: 'Bob Wilson',
        message: 'Best wishes!',
      });
    });

    expect(mockFetch).toHaveBeenCalledWith('/api/guestbook', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        senderName: 'Bob Wilson',
        message: 'Best wishes!',
      }),
    });
  });

  it('handles submit errors', async () => {
    // Mock initial fetch
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        data: { messages: mockMessages, stats: mockStats },
      }),
    } as Response);

    // Mock submit error
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({
        success: false,
        error: 'Message too long',
      }),
    } as Response);

    const { result } = renderHook(() => useGuestBook());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await act(async () => {
      await result.current.submitMessage({
        senderName: 'Test User',
        message: 'Test message',
      });
    });

    expect(result.current.error).toBe('Message too long');
  });

  it('likes messages successfully', async () => {
    // Mock initial fetch
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        data: { messages: mockMessages, stats: mockStats },
      }),
    } as Response);

    // Mock like response
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        likes: 6,
        likedByIp: ['user-ip'],
        message: 'Message liked!',
      }),
    } as Response);

    const { result } = renderHook(() => useGuestBook());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await act(async () => {
      await result.current.likeMessage('1');
    });

    expect(mockFetch).toHaveBeenCalledWith('/api/guestbook/1/like', {
      method: 'POST',
    });

    // Should optimistically update the message
    const updatedMessage = result.current.messages.find(m => m.id === '1');
    expect(updatedMessage?.likes).toBe(6);
  });

  it('updates filters correctly', async () => {
    // Mock initial fetch
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        data: { messages: mockMessages, stats: mockStats },
      }),
    } as Response);

    // Mock filtered fetch
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        data: { messages: [mockMessages[0]], stats: mockStats },
      }),
    } as Response);

    const { result } = renderHook(() => useGuestBook());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    act(() => {
      result.current.updateFilter({ status: 'pending' });
    });

    expect(result.current.filters.status).toBe('pending');
  });

  it('polls for updates at specified interval', async () => {
    const pollingInterval = 1000;

    // Mock initial fetch
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        data: { messages: mockMessages, stats: mockStats },
      }),
    } as Response);

    renderHook(() => useGuestBook({ pollingInterval }));

    // Initial fetch
    expect(mockFetch).toHaveBeenCalledTimes(1);

    // Advance timer by polling interval
    act(() => {
      jest.advanceTimersByTime(pollingInterval);
    });

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledTimes(2);
    });
  });

  it('applies search filter correctly', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        data: { messages: mockMessages, stats: mockStats },
      }),
    } as Response);

    const { result } = renderHook(() => 
      useGuestBook({ initialFilters: { search: 'congratulations' } })
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('search=congratulations')
    );
  });

  it('handles connection status correctly', async () => {
    // Mock successful fetch
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        data: { messages: mockMessages, stats: mockStats },
      }),
    } as Response);

    const { result } = renderHook(() => useGuestBook());

    await waitFor(() => {
      expect(result.current.isConnected).toBe(true);
    });

    // Mock network error
    mockFetch.mockRejectedValueOnce(new Error('Network error'));

    act(() => {
      result.current.fetchMessages();
    });

    await waitFor(() => {
      expect(result.current.isConnected).toBe(false);
    });
  });
});
