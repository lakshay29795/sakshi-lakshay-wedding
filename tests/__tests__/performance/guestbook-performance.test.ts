import { render, screen, waitFor } from '@testing-library/react';
import { performance } from 'perf_hooks';
import { GuestMessage } from '@/types/guestbook';
import { useGuestBook } from '@/hooks/useGuestBook';
import React from 'react';

// Mock the useGuestBook hook
jest.mock('@/hooks/useGuestBook');
const mockUseGuestBook = useGuestBook as jest.MockedFunction<typeof useGuestBook>;

// Mock framer-motion for performance tests
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    section: ({ children, ...props }: any) => <section {...props}>{children}</section>,
    button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

// Create a test component that uses the guest book
const GuestBookTestComponent = ({ messageCount }: { messageCount: number }) => {
  const { messages, isLoading } = useGuestBook();

  if (isLoading) {
    return <div data-testid="loading">Loading...</div>;
  }

  return (
    <div data-testid="message-list">
      {messages.map((message) => (
        <div key={message.id} data-testid="message-item">
          <h3>{message.guestName}</h3>
          <p>{message.message}</p>
          <span>{message.likes} likes</span>
        </div>
      ))}
    </div>
  );
};

// Helper function to generate large datasets
const generateMessages = (count: number): GuestMessage[] => {
  const messages: GuestMessage[] = [];
  const names = ['John Doe', 'Jane Smith', 'Bob Wilson', 'Alice Johnson', 'Charlie Brown'];
  const messageTemplates = [
    'Congratulations on your special day!',
    'Wishing you both a lifetime of happiness.',
    'So excited to celebrate with you!',
    'Your love story is truly inspiring.',
    'May your marriage be filled with joy and laughter.',
  ];

  for (let i = 0; i < count; i++) {
    messages.push({
      id: `message-${i}`,
      guestName: names[i % names.length],
      message: messageTemplates[i % messageTemplates.length] + ` Message ${i + 1}`,
      submittedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000), // Random date within last 30 days
      status: 'approved',
      likes: Math.floor(Math.random() * 20),
      likedBy: [],
      isHighlighted: i % 10 === 0, // Every 10th message is highlighted
    });
  }

  return messages;
};

describe('Guest Book Performance Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering Performance', () => {
    it('renders 100 messages within acceptable time', async () => {
      const messages = generateMessages(100);
      
      mockUseGuestBook.mockReturnValue({
        messages,
        stats: {
          totalMessages: 100,
          approvedMessages: 100,
          pendingMessages: 0,
          rejectedMessages: 0,
          totalLikes: messages.reduce((sum, m) => sum + m.likes, 0),
        },
        isLoading: false,
        isSubmitting: false,
        error: null,
        form: {} as any,
        submitMessage: jest.fn(),
        likeMessage: jest.fn(),
        filters: {},
        updateFilter: jest.fn(),
        isConnected: true,
        fetchMessages: jest.fn(),
      });

      const startTime = performance.now();
      
      render(<GuestBookTestComponent messageCount={100} />);
      
      await waitFor(() => {
        expect(screen.getByTestId('message-list')).toBeInTheDocument();
      });

      const endTime = performance.now();
      const renderTime = endTime - startTime;

      // Should render within 100ms
      expect(renderTime).toBeLessThan(100);
      
      // Should render all messages
      expect(screen.getAllByTestId('message-item')).toHaveLength(100);
    });

    it('renders 500 messages within acceptable time', async () => {
      const messages = generateMessages(500);
      
      mockUseGuestBook.mockReturnValue({
        messages,
        stats: {
          totalMessages: 500,
          approvedMessages: 500,
          pendingMessages: 0,
          rejectedMessages: 0,
          totalLikes: messages.reduce((sum, m) => sum + m.likes, 0),
        },
        isLoading: false,
        isSubmitting: false,
        error: null,
        form: {} as any,
        submitMessage: jest.fn(),
        likeMessage: jest.fn(),
        filters: {},
        updateFilter: jest.fn(),
        isConnected: true,
        fetchMessages: jest.fn(),
      });

      const startTime = performance.now();
      
      render(<GuestBookTestComponent messageCount={500} />);
      
      await waitFor(() => {
        expect(screen.getByTestId('message-list')).toBeInTheDocument();
      });

      const endTime = performance.now();
      const renderTime = endTime - startTime;

      // Should render within 500ms even with 500 messages
      expect(renderTime).toBeLessThan(500);
      
      // Should render all messages
      expect(screen.getAllByTestId('message-item')).toHaveLength(500);
    });

    it('handles 1000 messages without crashing', async () => {
      const messages = generateMessages(1000);
      
      mockUseGuestBook.mockReturnValue({
        messages,
        stats: {
          totalMessages: 1000,
          approvedMessages: 1000,
          pendingMessages: 0,
          rejectedMessages: 0,
          totalLikes: messages.reduce((sum, m) => sum + m.likes, 0),
        },
        isLoading: false,
        isSubmitting: false,
        error: null,
        form: {} as any,
        submitMessage: jest.fn(),
        likeMessage: jest.fn(),
        filters: {},
        updateFilter: jest.fn(),
        isConnected: true,
        fetchMessages: jest.fn(),
      });

      // Should not throw an error
      expect(() => {
        render(<GuestBookTestComponent messageCount={1000} />);
      }).not.toThrow();

      await waitFor(() => {
        expect(screen.getByTestId('message-list')).toBeInTheDocument();
      });

      // Should render all messages
      expect(screen.getAllByTestId('message-item')).toHaveLength(1000);
    });
  });

  describe('Memory Usage', () => {
    it('does not cause memory leaks with large datasets', async () => {
      const initialMemory = process.memoryUsage().heapUsed;
      
      // Render and unmount multiple times with large datasets
      for (let i = 0; i < 10; i++) {
        const messages = generateMessages(100);
        
        mockUseGuestBook.mockReturnValue({
          messages,
          stats: {
            totalMessages: 100,
            approvedMessages: 100,
            pendingMessages: 0,
            rejectedMessages: 0,
            totalLikes: messages.reduce((sum, m) => sum + m.likes, 0),
          },
          isLoading: false,
          isSubmitting: false,
          error: null,
          form: {} as any,
          submitMessage: jest.fn(),
          likeMessage: jest.fn(),
          filters: {},
          updateFilter: jest.fn(),
          isConnected: true,
          fetchMessages: jest.fn(),
        });

        const { unmount } = render(<GuestBookTestComponent messageCount={100} />);
        
        await waitFor(() => {
          expect(screen.getByTestId('message-list')).toBeInTheDocument();
        });
        
        unmount();
      }

      // Force garbage collection if available
      if (global.gc) {
        global.gc();
      }

      const finalMemory = process.memoryUsage().heapUsed;
      const memoryIncrease = finalMemory - initialMemory;

      // Memory increase should be reasonable (less than 50MB)
      expect(memoryIncrease).toBeLessThan(50 * 1024 * 1024);
    });
  });

  describe('Filtering Performance', () => {
    it('filters large datasets efficiently', async () => {
      const messages = generateMessages(1000);
      const searchTerm = 'Message 1'; // Should match multiple messages
      
      const startTime = performance.now();
      
      const filteredMessages = messages.filter(message =>
        message.guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        message.message.toLowerCase().includes(searchTerm.toLowerCase())
      );
      
      const endTime = performance.now();
      const filterTime = endTime - startTime;

      // Filtering should be fast (less than 10ms)
      expect(filterTime).toBeLessThan(10);
      
      // Should return expected results
      expect(filteredMessages.length).toBeGreaterThan(0);
      expect(filteredMessages.every(msg => 
        msg.message.toLowerCase().includes(searchTerm.toLowerCase())
      )).toBe(true);
    });

    it('sorts large datasets efficiently', async () => {
      const messages = generateMessages(1000);
      
      const startTime = performance.now();
      
      // Sort by likes (descending)
      const sortedMessages = [...messages].sort((a, b) => b.likes - a.likes);
      
      const endTime = performance.now();
      const sortTime = endTime - startTime;

      // Sorting should be fast (less than 10ms)
      expect(sortTime).toBeLessThan(10);
      
      // Should be properly sorted
      for (let i = 0; i < sortedMessages.length - 1; i++) {
        expect(sortedMessages[i].likes).toBeGreaterThanOrEqual(sortedMessages[i + 1].likes);
      }
    });
  });

  describe('API Performance Simulation', () => {
    it('handles rapid API calls without blocking', async () => {
      const mockFetch = jest.fn();
      global.fetch = mockFetch;

      // Simulate multiple rapid API calls
      const promises = [];
      const startTime = performance.now();

      for (let i = 0; i < 10; i++) {
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            success: true,
            data: {
              messages: generateMessages(50),
              stats: { totalMessages: 50, approvedMessages: 50, pendingMessages: 0, rejectedMessages: 0, totalLikes: 250 },
            },
          }),
        } as Response);

        promises.push(fetch('/api/guestbook'));
      }

      await Promise.all(promises);
      
      const endTime = performance.now();
      const totalTime = endTime - startTime;

      // All calls should complete within reasonable time
      expect(totalTime).toBeLessThan(100);
      expect(mockFetch).toHaveBeenCalledTimes(10);
    });

    it('handles concurrent like operations efficiently', async () => {
      const mockFetch = jest.fn();
      global.fetch = mockFetch;

      // Simulate multiple concurrent like operations
      const promises = [];
      const startTime = performance.now();

      for (let i = 0; i < 20; i++) {
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            success: true,
            data: {
              messageId: `message-${i}`,
              likes: Math.floor(Math.random() * 20) + 1,
            },
          }),
        } as Response);

        promises.push(fetch(`/api/guestbook/message-${i}/like`, { method: 'POST' }));
      }

      await Promise.all(promises);
      
      const endTime = performance.now();
      const totalTime = endTime - startTime;

      // All like operations should complete quickly
      expect(totalTime).toBeLessThan(200);
      expect(mockFetch).toHaveBeenCalledTimes(20);
    });
  });

  describe('Real-time Updates Performance', () => {
    it('handles frequent polling without performance degradation', async () => {
      const mockFetch = jest.fn();
      global.fetch = mockFetch;

      let callCount = 0;
      mockFetch.mockImplementation(async () => {
        callCount++;
        return {
          ok: true,
          json: async () => ({
            success: true,
            data: {
              messages: generateMessages(100),
              stats: { totalMessages: 100, approvedMessages: 100, pendingMessages: 0, rejectedMessages: 0, totalLikes: 500 },
            },
          }),
        } as Response;
      });

      const startTime = performance.now();

      // Simulate 10 polling requests
      const promises = [];
      for (let i = 0; i < 10; i++) {
        promises.push(fetch('/api/guestbook'));
      }

      await Promise.all(promises);

      const endTime = performance.now();
      const totalTime = endTime - startTime;

      // Should handle multiple polling requests efficiently
      expect(totalTime).toBeLessThan(300);
      expect(callCount).toBe(10);
    });
  });
});
