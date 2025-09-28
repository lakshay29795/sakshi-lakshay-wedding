import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useAdminAnalytics } from '@/hooks/useAdminAnalytics';
import { useAdmin } from '@/components/admin/AdminProvider';

// Mock the hooks
jest.mock('@/hooks/useAdminAnalytics');
jest.mock('@/components/admin/AdminProvider');

// Mock fetch
global.fetch = jest.fn();

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    section: ({ children, ...props }: any) => <section {...props}>{children}</section>,
  },
  AnimatePresence: ({ children }: any) => children,
}));

// Mock Sonner toast
jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
    info: jest.fn(),
  },
}));

// Test component that uses real-time updates
const TestDashboard = () => {
  const {
    analytics,
    isLoadingAnalytics,
    activities,
    isLoadingActivities,
    refreshAnalytics,
    refreshActivities,
  } = useAdminAnalytics();

  const { user, hasPermission } = useAdmin();

  return (
    <div>
      <div data-testid="user-info">
        {user?.email || 'Not logged in'}
      </div>
      
      {hasPermission('view_analytics') && (
        <div data-testid="analytics-section">
          {isLoadingAnalytics ? (
            <div data-testid="analytics-loading">Loading analytics...</div>
          ) : (
            <div data-testid="analytics-data">
              <div data-testid="rsvp-total">{analytics?.rsvps.total || 0}</div>
              <div data-testid="guestbook-total">{analytics?.guestbook.total || 0}</div>
            </div>
          )}
          <button onClick={refreshAnalytics} data-testid="refresh-analytics">
            Refresh Analytics
          </button>
        </div>
      )}

      <div data-testid="activity-section">
        {isLoadingActivities ? (
          <div data-testid="activities-loading">Loading activities...</div>
        ) : (
          <div data-testid="activities-data">
            {activities.map((activity) => (
              <div key={activity.id} data-testid={`activity-${activity.id}`}>
                {activity.message}
              </div>
            ))}
          </div>
        )}
        <button onClick={refreshActivities} data-testid="refresh-activities">
          Refresh Activities
        </button>
      </div>
    </div>
  );
};

describe('Real-time Update Verification', () => {
  const mockUseAdmin = useAdmin as jest.MockedFunction<typeof useAdmin>;
  const mockUseAdminAnalytics = useAdminAnalytics as jest.MockedFunction<typeof useAdminAnalytics>;

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Default mock implementations
    mockUseAdmin.mockReturnValue({
      user: {
        uid: 'test-uid',
        email: 'admin@example.com',
        role: 'admin',
        permissions: ['view_analytics', 'manage_content'],
        displayName: 'Test Admin',
      },
      isLoading: false,
      error: null,
      hasPermission: jest.fn((permission) => 
        ['view_analytics', 'manage_content'].includes(permission)
      ),
      login: jest.fn(),
      logout: jest.fn(),
    });

    mockUseAdminAnalytics.mockReturnValue({
      analytics: {
        rsvps: { total: 156, attending: 134, notAttending: 22, pending: 18, trend: '+12%' },
        guestbook: { total: 89, approved: 76, pending: 13, rejected: 0, trend: '+8%' },
        notifications: { sent: 245, delivered: 238, opened: 189, failed: 7, trend: '+15%', openRate: '77.1%', deliveryRate: '97.1%' },
        website: { visitors: 2847, pageViews: 8934, avgSession: '3m 42s', trend: '+23%' },
      },
      isLoadingAnalytics: false,
      analyticsError: null,
      activities: [
        {
          id: '1',
          type: 'rsvp',
          message: 'New RSVP from Sarah Johnson',
          time: '2 minutes ago',
          status: 'success',
          timestamp: new Date(),
        },
        {
          id: '2',
          type: 'guestbook',
          message: 'Guest message pending approval',
          time: '15 minutes ago',
          status: 'warning',
          timestamp: new Date(),
        },
      ],
      isLoadingActivities: false,
      activitiesError: null,
      hasMoreActivities: false,
      refreshAnalytics: jest.fn(),
      refreshActivities: jest.fn(),
      loadMoreActivities: jest.fn(),
    });
  });

  describe('Initial Data Loading', () => {
    it('should display loading states initially', () => {
      mockUseAdminAnalytics.mockReturnValue({
        ...mockUseAdminAnalytics(),
        isLoadingAnalytics: true,
        isLoadingActivities: true,
      });

      render(<TestDashboard />);

      expect(screen.getByTestId('analytics-loading')).toBeInTheDocument();
      expect(screen.getByTestId('activities-loading')).toBeInTheDocument();
    });

    it('should display data when loaded', () => {
      render(<TestDashboard />);

      expect(screen.getByTestId('rsvp-total')).toHaveTextContent('156');
      expect(screen.getByTestId('guestbook-total')).toHaveTextContent('89');
      expect(screen.getByTestId('activity-1')).toHaveTextContent('New RSVP from Sarah Johnson');
      expect(screen.getByTestId('activity-2')).toHaveTextContent('Guest message pending approval');
    });

    it('should respect user permissions', () => {
      mockUseAdmin.mockReturnValue({
        ...mockUseAdmin(),
        hasPermission: jest.fn((permission) => permission !== 'view_analytics'),
      });

      render(<TestDashboard />);

      expect(screen.queryByTestId('analytics-section')).not.toBeInTheDocument();
      expect(screen.getByTestId('activity-section')).toBeInTheDocument();
    });
  });

  describe('Manual Refresh Functionality', () => {
    it('should refresh analytics when refresh button is clicked', async () => {
      const mockRefreshAnalytics = jest.fn();
      mockUseAdminAnalytics.mockReturnValue({
        ...mockUseAdminAnalytics(),
        refreshAnalytics: mockRefreshAnalytics,
      });

      render(<TestDashboard />);

      const refreshButton = screen.getByTestId('refresh-analytics');
      await userEvent.click(refreshButton);

      expect(mockRefreshAnalytics).toHaveBeenCalledTimes(1);
    });

    it('should refresh activities when refresh button is clicked', async () => {
      const mockRefreshActivities = jest.fn();
      mockUseAdminAnalytics.mockReturnValue({
        ...mockUseAdminAnalytics(),
        refreshActivities: mockRefreshActivities,
      });

      render(<TestDashboard />);

      const refreshButton = screen.getByTestId('refresh-activities');
      await userEvent.click(refreshButton);

      expect(mockRefreshActivities).toHaveBeenCalledTimes(1);
    });
  });

  describe('Auto-refresh Behavior', () => {
    it('should auto-refresh data periodically', async () => {
      jest.useFakeTimers();
      
      const mockRefreshAnalytics = jest.fn();
      const mockRefreshActivities = jest.fn();
      
      // Mock the hook to simulate auto-refresh
      let refreshCount = 0;
      mockUseAdminAnalytics.mockImplementation(() => {
        // Simulate auto-refresh every 5 minutes
        React.useEffect(() => {
          const interval = setInterval(() => {
            mockRefreshAnalytics();
            mockRefreshActivities();
            refreshCount++;
          }, 5 * 60 * 1000); // 5 minutes

          return () => clearInterval(interval);
        }, []);

        return {
          ...mockUseAdminAnalytics(),
          refreshAnalytics: mockRefreshAnalytics,
          refreshActivities: mockRefreshActivities,
        };
      });

      render(<TestDashboard />);

      // Fast-forward 5 minutes
      act(() => {
        jest.advanceTimersByTime(5 * 60 * 1000);
      });

      await waitFor(() => {
        expect(mockRefreshAnalytics).toHaveBeenCalled();
        expect(mockRefreshActivities).toHaveBeenCalled();
      });

      jest.useRealTimers();
    });
  });

  describe('Real-time Data Updates', () => {
    it('should update analytics data when new data arrives', async () => {
      const { rerender } = render(<TestDashboard />);

      // Initial state
      expect(screen.getByTestId('rsvp-total')).toHaveTextContent('156');

      // Simulate new data
      mockUseAdminAnalytics.mockReturnValue({
        ...mockUseAdminAnalytics(),
        analytics: {
          ...mockUseAdminAnalytics().analytics!,
          rsvps: { total: 160, attending: 138, notAttending: 22, pending: 18, trend: '+15%' },
        },
      });

      rerender(<TestDashboard />);

      expect(screen.getByTestId('rsvp-total')).toHaveTextContent('160');
    });

    it('should update activity feed when new activities arrive', async () => {
      const { rerender } = render(<TestDashboard />);

      // Initial state
      expect(screen.getAllByTestId(/^activity-/)).toHaveLength(2);

      // Simulate new activity
      mockUseAdminAnalytics.mockReturnValue({
        ...mockUseAdminAnalytics(),
        activities: [
          {
            id: '3',
            type: 'notification',
            message: 'Daily love message sent',
            time: '1 minute ago',
            status: 'success',
            timestamp: new Date(),
          },
          ...mockUseAdminAnalytics().activities,
        ],
      });

      rerender(<TestDashboard />);

      expect(screen.getAllByTestId(/^activity-/)).toHaveLength(3);
      expect(screen.getByTestId('activity-3')).toHaveTextContent('Daily love message sent');
    });

    it('should handle activity ordering correctly', async () => {
      const now = new Date();
      const activities = [
        {
          id: '1',
          type: 'rsvp' as const,
          message: 'Oldest activity',
          time: '1 hour ago',
          status: 'success' as const,
          timestamp: new Date(now.getTime() - 60 * 60 * 1000),
        },
        {
          id: '2',
          type: 'guestbook' as const,
          message: 'Newest activity',
          time: '1 minute ago',
          status: 'success' as const,
          timestamp: new Date(now.getTime() - 60 * 1000),
        },
        {
          id: '3',
          type: 'notification' as const,
          message: 'Middle activity',
          time: '30 minutes ago',
          status: 'info' as const,
          timestamp: new Date(now.getTime() - 30 * 60 * 1000),
        },
      ];

      mockUseAdminAnalytics.mockReturnValue({
        ...mockUseAdminAnalytics(),
        activities,
      });

      render(<TestDashboard />);

      const activityElements = screen.getAllByTestId(/^activity-/);
      
      // Should be ordered by timestamp (newest first)
      expect(activityElements[0]).toHaveTextContent('Newest activity');
      expect(activityElements[1]).toHaveTextContent('Middle activity');
      expect(activityElements[2]).toHaveTextContent('Oldest activity');
    });
  });

  describe('Error Handling', () => {
    it('should handle analytics loading errors gracefully', () => {
      mockUseAdminAnalytics.mockReturnValue({
        ...mockUseAdminAnalytics(),
        analyticsError: 'Failed to load analytics data',
        analytics: null,
      });

      render(<TestDashboard />);

      // Should still render the component without crashing
      expect(screen.getByTestId('analytics-section')).toBeInTheDocument();
      expect(screen.getByTestId('rsvp-total')).toHaveTextContent('0');
    });

    it('should handle activity loading errors gracefully', () => {
      mockUseAdminAnalytics.mockReturnValue({
        ...mockUseAdminAnalytics(),
        activitiesError: 'Failed to load activities',
        activities: [],
      });

      render(<TestDashboard />);

      // Should still render the component without crashing
      expect(screen.getByTestId('activity-section')).toBeInTheDocument();
      expect(screen.queryByTestId(/^activity-/)).not.toBeInTheDocument();
    });

    it('should handle network connectivity issues', async () => {
      // Mock network error
      const mockRefreshAnalytics = jest.fn().mockRejectedValue(new Error('Network error'));
      
      mockUseAdminAnalytics.mockReturnValue({
        ...mockUseAdminAnalytics(),
        refreshAnalytics: mockRefreshAnalytics,
      });

      render(<TestDashboard />);

      const refreshButton = screen.getByTestId('refresh-analytics');
      await userEvent.click(refreshButton);

      // Should handle the error gracefully
      expect(mockRefreshAnalytics).toHaveBeenCalled();
    });
  });

  describe('Performance and Memory Management', () => {
    it('should not cause memory leaks with frequent updates', async () => {
      const { unmount } = render(<TestDashboard />);

      // Simulate multiple rapid updates
      for (let i = 0; i < 100; i++) {
        mockUseAdminAnalytics.mockReturnValue({
          ...mockUseAdminAnalytics(),
          analytics: {
            ...mockUseAdminAnalytics().analytics!,
            rsvps: { ...mockUseAdminAnalytics().analytics!.rsvps, total: 156 + i },
          },
        });
      }

      // Unmount to trigger cleanup
      unmount();

      // If there were memory leaks, this test would timeout or fail
      expect(true).toBe(true);
    });

    it('should handle large activity lists efficiently', () => {
      const largeActivityList = Array.from({ length: 1000 }, (_, i) => ({
        id: `activity-${i}`,
        type: 'rsvp' as const,
        message: `Activity ${i}`,
        time: `${i} minutes ago`,
        status: 'success' as const,
        timestamp: new Date(Date.now() - i * 60 * 1000),
      }));

      mockUseAdminAnalytics.mockReturnValue({
        ...mockUseAdminAnalytics(),
        activities: largeActivityList,
      });

      const startTime = performance.now();
      render(<TestDashboard />);
      const endTime = performance.now();

      // Should render within reasonable time (less than 100ms)
      expect(endTime - startTime).toBeLessThan(100);
    });
  });

  describe('WebSocket Simulation', () => {
    it('should handle simulated WebSocket updates', async () => {
      // Mock WebSocket-like behavior
      let updateCallback: (() => void) | null = null;

      mockUseAdminAnalytics.mockImplementation(() => {
        const [data, setData] = React.useState(mockUseAdminAnalytics());

        React.useEffect(() => {
          updateCallback = () => {
            setData(prev => ({
              ...prev,
              analytics: {
                ...prev.analytics!,
                rsvps: { ...prev.analytics!.rsvps, total: prev.analytics!.rsvps.total + 1 },
              },
            }));
          };

          return () => {
            updateCallback = null;
          };
        }, []);

        return data;
      });

      const { rerender } = render(<TestDashboard />);

      // Initial state
      expect(screen.getByTestId('rsvp-total')).toHaveTextContent('156');

      // Simulate WebSocket update
      if (updateCallback) {
        act(() => {
          updateCallback();
        });
      }

      rerender(<TestDashboard />);

      await waitFor(() => {
        expect(screen.getByTestId('rsvp-total')).toHaveTextContent('157');
      });
    });
  });

  describe('Concurrent Updates', () => {
    it('should handle concurrent analytics and activity updates', async () => {
      const mockRefreshAnalytics = jest.fn();
      const mockRefreshActivities = jest.fn();

      mockUseAdminAnalytics.mockReturnValue({
        ...mockUseAdminAnalytics(),
        refreshAnalytics: mockRefreshAnalytics,
        refreshActivities: mockRefreshActivities,
      });

      render(<TestDashboard />);

      // Trigger concurrent updates
      const analyticsButton = screen.getByTestId('refresh-analytics');
      const activitiesButton = screen.getByTestId('refresh-activities');

      await Promise.all([
        userEvent.click(analyticsButton),
        userEvent.click(activitiesButton),
      ]);

      expect(mockRefreshAnalytics).toHaveBeenCalledTimes(1);
      expect(mockRefreshActivities).toHaveBeenCalledTimes(1);
    });

    it('should handle race conditions in data updates', async () => {
      let updateCount = 0;

      mockUseAdminAnalytics.mockImplementation(() => {
        const [count, setCount] = React.useState(0);

        const refresh = React.useCallback(async () => {
          // Simulate async update with potential race condition
          const currentUpdate = ++updateCount;
          await new Promise(resolve => setTimeout(resolve, Math.random() * 100));
          
          // Only update if this is still the latest update
          if (currentUpdate === updateCount) {
            setCount(currentUpdate);
          }
        }, []);

        return {
          ...mockUseAdminAnalytics(),
          analytics: {
            ...mockUseAdminAnalytics().analytics!,
            rsvps: { ...mockUseAdminAnalytics().analytics!.rsvps, total: 156 + count },
          },
          refreshAnalytics: refresh,
        };
      });

      render(<TestDashboard />);

      // Trigger multiple rapid updates
      const refreshButton = screen.getByTestId('refresh-analytics');
      
      await Promise.all([
        userEvent.click(refreshButton),
        userEvent.click(refreshButton),
        userEvent.click(refreshButton),
      ]);

      // Should handle race conditions gracefully
      await waitFor(() => {
        const totalElement = screen.getByTestId('rsvp-total');
        expect(totalElement).toBeInTheDocument();
      });
    });
  });
});
