import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';

interface AnalyticsData {
  rsvps: {
    total: number;
    attending: number;
    notAttending: number;
    pending: number;
    trend: string;
    breakdown?: {
      thisWeek: number;
      thisMonth: number;
      total: number;
    };
  };
  guestbook: {
    total: number;
    approved: number;
    pending: number;
    rejected: number;
    trend: string;
    breakdown?: {
      thisWeek: number;
      thisMonth: number;
      total: number;
    };
  };
  notifications: {
    sent: number;
    delivered: number;
    opened: number;
    failed: number;
    trend: string;
    openRate: string;
    deliveryRate: string;
  };
  website: {
    visitors: number;
    pageViews: number;
    avgSession: string;
    bounceRate?: string;
    trend: string;
    topPages?: Array<{
      path: string;
      views: number;
      title: string;
    }>;
  };
  timeline?: {
    events: number;
    published: number;
    draft: number;
    lastUpdated: string;
  };
  photos?: {
    total: number;
    categories: Record<string, number>;
    storage: string;
  };
}

interface ActivityItem {
  id: string;
  type: 'rsvp' | 'guestbook' | 'notification' | 'system' | 'timeline' | 'photo';
  message: string;
  time: string;
  status: 'success' | 'warning' | 'info' | 'error';
  timestamp: Date;
  metadata?: any;
}

interface UseAdminAnalyticsReturn {
  // Analytics data
  analytics: AnalyticsData | null;
  isLoadingAnalytics: boolean;
  analyticsError: string | null;
  
  // Activity data
  activities: ActivityItem[];
  isLoadingActivities: boolean;
  activitiesError: string | null;
  hasMoreActivities: boolean;
  
  // Actions
  refreshAnalytics: () => Promise<void>;
  refreshActivities: () => Promise<void>;
  loadMoreActivities: () => Promise<void>;
}

export function useAdminAnalytics(): UseAdminAnalyticsReturn {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [isLoadingAnalytics, setIsLoadingAnalytics] = useState(true);
  const [analyticsError, setAnalyticsError] = useState<string | null>(null);
  
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [isLoadingActivities, setIsLoadingActivities] = useState(true);
  const [activitiesError, setActivitiesError] = useState<string | null>(null);
  const [hasMoreActivities, setHasMoreActivities] = useState(false);
  const [activitiesOffset, setActivitiesOffset] = useState(0);

  // Fetch analytics data
  const fetchAnalytics = useCallback(async () => {
    setIsLoadingAnalytics(true);
    setAnalyticsError(null);
    
    try {
      const response = await fetch('/api/admin/analytics', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to fetch analytics');
      }

      setAnalytics(result.data);
      
      if (result.warning) {
        console.warn('Analytics warning:', result.warning);
      }

    } catch (error: any) {
      console.error('Failed to fetch analytics:', error);
      setAnalyticsError(error.message || 'Failed to load analytics data');
      toast.error('Failed to load analytics data');
    } finally {
      setIsLoadingAnalytics(false);
    }
  }, []);

  // Fetch activities data
  const fetchActivities = useCallback(async (offset = 0, append = false) => {
    if (!append) {
      setIsLoadingActivities(true);
      setActivitiesError(null);
    }
    
    try {
      const response = await fetch(`/api/admin/activity?limit=10&offset=${offset}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to fetch activities');
      }

      if (append) {
        setActivities(prev => [...prev, ...result.data.activities]);
      } else {
        setActivities(result.data.activities);
      }
      
      setHasMoreActivities(result.data.hasMore);
      setActivitiesOffset(offset + result.data.activities.length);
      
      if (result.warning) {
        console.warn('Activities warning:', result.warning);
      }

    } catch (error: any) {
      console.error('Failed to fetch activities:', error);
      setActivitiesError(error.message || 'Failed to load activity data');
      if (!append) {
        toast.error('Failed to load activity data');
      }
    } finally {
      if (!append) {
        setIsLoadingActivities(false);
      }
    }
  }, []);

  // Refresh functions
  const refreshAnalytics = useCallback(async () => {
    await fetchAnalytics();
  }, [fetchAnalytics]);

  const refreshActivities = useCallback(async () => {
    setActivitiesOffset(0);
    await fetchActivities(0, false);
  }, [fetchActivities]);

  const loadMoreActivities = useCallback(async () => {
    if (hasMoreActivities && !isLoadingActivities) {
      await fetchActivities(activitiesOffset, true);
    }
  }, [fetchActivities, activitiesOffset, hasMoreActivities, isLoadingActivities]);

  // Initial data load
  useEffect(() => {
    fetchAnalytics();
    fetchActivities();
  }, [fetchAnalytics, fetchActivities]);

  // Auto-refresh every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      fetchAnalytics();
      fetchActivities();
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(interval);
  }, [fetchAnalytics, fetchActivities]);

  return {
    analytics,
    isLoadingAnalytics,
    analyticsError,
    activities,
    isLoadingActivities,
    activitiesError,
    hasMoreActivities,
    refreshAnalytics,
    refreshActivities,
    loadMoreActivities,
  };
}
