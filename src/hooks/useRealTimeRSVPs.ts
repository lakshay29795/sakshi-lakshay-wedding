import { useState, useEffect, useCallback } from 'react';
import { rsvpService } from '@/lib/services/rsvp';
import type { RSVPSubmission, RSVPStats } from '@/types/rsvp';

interface UseRealTimeRSVPsOptions {
  enabled?: boolean;
  onError?: (error: Error) => void;
}

interface UseRealTimeRSVPsReturn {
  rsvps: RSVPSubmission[];
  stats: RSVPStats | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  unsubscribe: () => void;
}

/**
 * Hook for real-time RSVP updates using Firestore listeners
 */
export function useRealTimeRSVPs(options: UseRealTimeRSVPsOptions = {}): UseRealTimeRSVPsReturn {
  const { enabled = true, onError } = options;
  
  const [rsvps, setRSVPs] = useState<RSVPSubmission[]>([]);
  const [stats, setStats] = useState<RSVPStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [unsubscribeFn, setUnsubscribeFn] = useState<(() => void) | null>(null);

  // Calculate stats from RSVPs
  const calculateStats = useCallback((rsvpList: RSVPSubmission[]): RSVPStats => {
    const stats: RSVPStats = {
      totalInvited: 0, // This would come from a separate invitations collection
      totalResponded: rsvpList.length,
      totalAttending: 0,
      totalDeclined: 0,
      responseRate: 0,
      mealBreakdown: {
        regular: 0,
        vegetarian: 0,
        vegan: 0,
        'gluten-free': 0,
      },
      childrenCount: 0,
      adultsCount: 0,
    };

    for (const rsvp of rsvpList) {
      if (rsvp.isAttending) {
        stats.totalAttending++;
        
        // Count meal preferences and ages
        if (rsvp.guests) {
          for (const guest of rsvp.guests) {
            stats.mealBreakdown[guest.mealPreference]++;
            
            if (guest.isChild) {
              stats.childrenCount++;
            } else {
              stats.adultsCount++;
            }
          }
        }
      } else {
        stats.totalDeclined++;
      }
    }

    // Calculate response rate (assuming total invited is available)
    if (stats.totalInvited > 0) {
      stats.responseRate = (stats.totalResponded / stats.totalInvited) * 100;
    }

    return stats;
  }, []);

  // Handle RSVP updates
  const handleRSVPUpdate = useCallback((updatedRSVPs: RSVPSubmission[]) => {
    setRSVPs(updatedRSVPs);
    setStats(calculateStats(updatedRSVPs));
    setLoading(false);
    setError(null);
  }, [calculateStats]);

  // Handle errors
  const handleError = useCallback((err: Error) => {
    setError(err);
    setLoading(false);
    if (onError) {
      onError(err);
    }
  }, [onError]);

  // Manual refetch function
  const refetch = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { rsvps: fetchedRSVPs } = await rsvpService.getAllRSVPs(1000); // Get all RSVPs
      handleRSVPUpdate(fetchedRSVPs);
    } catch (err) {
      handleError(err instanceof Error ? err : new Error('Failed to fetch RSVPs'));
    }
  }, [handleRSVPUpdate, handleError]);

  // Unsubscribe function
  const unsubscribe = useCallback(() => {
    if (unsubscribeFn) {
      unsubscribeFn();
      setUnsubscribeFn(null);
    }
  }, [unsubscribeFn]);

  // Set up real-time listener
  useEffect(() => {
    if (!enabled) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const unsubscribe = rsvpService.subscribeToRSVPs(
        handleRSVPUpdate,
        handleError
      );

      setUnsubscribeFn(() => unsubscribe);

      // Cleanup function
      return () => {
        unsubscribe();
      };
    } catch (err) {
      handleError(err instanceof Error ? err : new Error('Failed to set up real-time listener'));
    }
  }, [enabled, handleRSVPUpdate, handleError]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (unsubscribeFn) {
        unsubscribeFn();
      }
    };
  }, [unsubscribeFn]);

  return {
    rsvps,
    stats,
    loading,
    error,
    refetch,
    unsubscribe,
  };
}

/**
 * Hook for a single RSVP with real-time updates
 */
export function useRealTimeRSVP(rsvpId: string | null) {
  const [rsvp, setRSVP] = useState<RSVPSubmission | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!rsvpId) {
      setLoading(false);
      return;
    }

    const fetchRSVP = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const fetchedRSVP = await rsvpService.getRSVP(rsvpId);
        setRSVP(fetchedRSVP);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch RSVP'));
      } finally {
        setLoading(false);
      }
    };

    fetchRSVP();
  }, [rsvpId]);

  return { rsvp, loading, error };
}

/**
 * Hook for RSVP statistics only
 */
export function useRSVPStats() {
  const { stats, loading, error, refetch } = useRealTimeRSVPs();

  return {
    stats,
    loading,
    error,
    refetch,
  };
}
