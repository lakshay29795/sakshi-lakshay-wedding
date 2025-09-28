import { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  guestMessageSchema,
  type GuestMessageFormInput,
} from '@/lib/validations/guestbook';
import {
  type GuestMessage,
  type GuestBookFilters,
  type GuestBookStats,
} from '@/types/guestbook';
import { toast } from 'sonner';
import { usePWA } from './usePWA';

interface UseGuestBookReturn {
  // Form management
  form: ReturnType<typeof useForm<GuestMessageFormInput>>;
  isSubmitting: boolean;
  submitMessage: (data: GuestMessageFormInput) => Promise<void>;
  
  // Messages management
  messages: GuestMessage[];
  isLoading: boolean;
  error: string | null;
  refreshMessages: () => Promise<void>;
  
  // Filtering and sorting
  filters: GuestBookFilters;
  setFilters: (filters: GuestBookFilters) => void;
  filteredMessages: GuestMessage[];
  
  // Statistics
  stats: GuestBookStats | null;
  
  // Real-time updates
  isConnected: boolean;
  
  // Interactions
  likeMessage: (messageId: string) => Promise<void>;
  unlikeMessage: (messageId: string) => Promise<void>;
}

export function useGuestBook(): UseGuestBookReturn {
  const { isOnline, storeForSync } = usePWA();
  const [messages, setMessages] = useState<GuestMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filters, setFilters] = useState<GuestBookFilters>({
    status: 'approved',
    sortBy: 'newest',
    search: '',
  });
  const [stats, setStats] = useState<GuestBookStats | null>(null);
  const [likedMessages, setLikedMessages] = useState<Set<string>>(new Set());

  const form = useForm<GuestMessageFormInput>({
    resolver: zodResolver(guestMessageSchema),
    defaultValues: {
      guestName: '',
      guestEmail: '',
      message: '',
    },
  });

  // Fetch messages from API
  const fetchMessages = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const queryParams = new URLSearchParams();
      if (filters.status && filters.status !== 'all') {
        queryParams.append('status', filters.status);
      }
      if (filters.sortBy) {
        queryParams.append('sortBy', filters.sortBy);
      }
      if (filters.search) {
        queryParams.append('search', filters.search);
      }

      const response = await fetch(`/api/guestbook?${queryParams.toString()}`);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch messages');
      }

      setMessages(result.data.messages || []);
      setStats(result.data.stats || null);
    } catch (err: any) {
      setError(err.message);
      toast.error('Failed to load guest book messages');
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  // Submit new message with offline support
  const submitMessage = useCallback(async (data: GuestMessageFormInput) => {
    setIsSubmitting(true);
    
    // If offline, store for background sync
    if (!isOnline) {
      storeForSync('GUESTBOOK_MESSAGE', data);
      toast.success('Message saved! It will be submitted when you\'re back online.');
      form.reset();
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch('/api/guestbook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to submit message');
      }

      toast.success('Thank you for your message! It will appear after review.');
      form.reset();
      
      // Refresh messages to show the new one (if auto-approved)
      await fetchMessages();
    } catch (err: any) {
      // If network error, store for background sync
      if (err instanceof TypeError && err.message.includes('fetch')) {
        storeForSync('GUESTBOOK_MESSAGE', data);
        toast.success('Message saved! It will be submitted when you\'re back online.');
        form.reset();
      } else {
        toast.error(err.message);
        throw err;
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [form, fetchMessages, isOnline, storeForSync]);

  // Like/unlike message
  const likeMessage = useCallback(async (messageId: string) => {
    try {
      const response = await fetch(`/api/guestbook/${messageId}/like`, {
        method: 'POST',
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to like message');
      }

      setLikedMessages(prev => new Set([...prev, messageId]));
      
      // Update the message in the local state
      setMessages(prev => prev.map(msg => 
        msg.id === messageId 
          ? { ...msg, likes: (msg.likes || 0) + 1 }
          : msg
      ));

      toast.success('❤️ Liked!');
    } catch (err: any) {
      toast.error('Failed to like message');
    }
  }, []);

  const unlikeMessage = useCallback(async (messageId: string) => {
    try {
      const response = await fetch(`/api/guestbook/${messageId}/like`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to unlike message');
      }

      setLikedMessages(prev => {
        const newSet = new Set(prev);
        newSet.delete(messageId);
        return newSet;
      });
      
      // Update the message in the local state
      setMessages(prev => prev.map(msg => 
        msg.id === messageId 
          ? { ...msg, likes: Math.max((msg.likes || 0) - 1, 0) }
          : msg
      ));
    } catch (err: any) {
      toast.error('Failed to unlike message');
    }
  }, []);

  // Filter messages based on current filters
  const filteredMessages = messages.filter(message => {
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      return (
        message.guestName.toLowerCase().includes(searchTerm) ||
        message.message.toLowerCase().includes(searchTerm)
      );
    }
    return true;
  });

  // Load liked messages from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('guestbook-liked-messages');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setLikedMessages(new Set(parsed));
      } catch {
        // Ignore invalid data
      }
    }
  }, []);

  // Save liked messages to localStorage
  useEffect(() => {
    localStorage.setItem(
      'guestbook-liked-messages',
      JSON.stringify([...likedMessages])
    );
  }, [likedMessages]);

  // Initial load and when filters change
  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  // Set up real-time updates (WebSocket or polling)
  useEffect(() => {
    const interval = setInterval(() => {
      // Poll for updates every 30 seconds
      fetchMessages();
    }, 30000);

    return () => clearInterval(interval);
  }, [fetchMessages]);

  return {
    form,
    isSubmitting,
    submitMessage,
    messages,
    isLoading,
    error,
    refreshMessages: fetchMessages,
    filters,
    setFilters,
    filteredMessages,
    stats,
    isConnected: isOnline,
    likeMessage,
    unlikeMessage,
  };
}
