'use client';

import { getMessaging, getToken, onMessage, MessagePayload } from 'firebase/messaging';
import { app } from './config';

// Initialize Firebase Messaging
let messaging: any = null;

if (typeof window !== 'undefined') {
  try {
    messaging = getMessaging(app);
  } catch (error) {
    console.error('Firebase messaging initialization failed:', error);
  }
}

// VAPID key for push notifications (should be in environment variables)
const VAPID_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || 'demo-vapid-key';

export interface NotificationPayload {
  title: string;
  body: string;
  icon?: string;
  image?: string;
  badge?: string;
  tag?: string;
  data?: Record<string, any>;
  actions?: Array<{
    action: string;
    title: string;
    icon?: string;
  }>;
}

export interface PushSubscription {
  token: string;
  endpoint: string;
  userId?: string;
  preferences: NotificationPreferences;
  createdAt: Date;
  lastUsed: Date;
}

export interface NotificationPreferences {
  dailyLoveMessages: boolean;
  weddingReminders: boolean;
  guestBookUpdates: boolean;
  rsvpReminders: boolean;
  generalUpdates: boolean;
  quietHours: {
    enabled: boolean;
    start: string; // HH:MM format
    end: string;   // HH:MM format
  };
  timezone: string;
}

// Default notification preferences
export const defaultNotificationPreferences: NotificationPreferences = {
  dailyLoveMessages: true,
  weddingReminders: true,
  guestBookUpdates: false,
  rsvpReminders: true,
  generalUpdates: true,
  quietHours: {
    enabled: true,
    start: '22:00',
    end: '08:00',
  },
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
};

// Request notification permission and get FCM token
export async function requestNotificationPermission(): Promise<string | null> {
  if (!messaging) {
    console.warn('Firebase messaging not available');
    return null;
  }

  try {
    // Request permission
    const permission = await Notification.requestPermission();
    
    if (permission !== 'granted') {
      console.log('Notification permission denied');
      return null;
    }

    // Get FCM token
    const token = await getToken(messaging, {
      vapidKey: VAPID_KEY,
    });

    if (token) {
      console.log('FCM token received:', token);
      return token;
    } else {
      console.log('No registration token available');
      return null;
    }
  } catch (error) {
    console.error('Error getting notification permission:', error);
    return null;
  }
}

// Subscribe to push notifications
export async function subscribeToPushNotifications(
  preferences: NotificationPreferences = defaultNotificationPreferences
): Promise<PushSubscription | null> {
  const token = await requestNotificationPermission();
  
  if (!token) {
    return null;
  }

  try {
    // Send subscription to server
    const response = await fetch('/api/notifications/subscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token,
        preferences,
        userAgent: navigator.userAgent,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to subscribe to notifications');
    }

    const subscription = await response.json();
    
    // Store subscription locally
    localStorage.setItem('push-subscription', JSON.stringify(subscription));
    
    return subscription;
  } catch (error) {
    console.error('Error subscribing to push notifications:', error);
    return null;
  }
}

// Unsubscribe from push notifications
export async function unsubscribeFromPushNotifications(): Promise<boolean> {
  try {
    const storedSubscription = localStorage.getItem('push-subscription');
    if (!storedSubscription) {
      return true; // Already unsubscribed
    }

    const subscription = JSON.parse(storedSubscription);
    
    const response = await fetch('/api/notifications/unsubscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token: subscription.token,
      }),
    });

    if (response.ok) {
      localStorage.removeItem('push-subscription');
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Error unsubscribing from push notifications:', error);
    return false;
  }
}

// Update notification preferences
export async function updateNotificationPreferences(
  preferences: Partial<NotificationPreferences>
): Promise<boolean> {
  try {
    const storedSubscription = localStorage.getItem('push-subscription');
    if (!storedSubscription) {
      console.warn('No subscription found');
      return false;
    }

    const subscription = JSON.parse(storedSubscription);
    
    const response = await fetch('/api/notifications/preferences', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token: subscription.token,
        preferences,
      }),
    });

    if (response.ok) {
      // Update local storage
      const updatedSubscription = {
        ...subscription,
        preferences: { ...subscription.preferences, ...preferences },
      };
      localStorage.setItem('push-subscription', JSON.stringify(updatedSubscription));
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Error updating notification preferences:', error);
    return false;
  }
}

// Get current subscription
export function getCurrentSubscription(): PushSubscription | null {
  try {
    const storedSubscription = localStorage.getItem('push-subscription');
    return storedSubscription ? JSON.parse(storedSubscription) : null;
  } catch (error) {
    console.error('Error getting current subscription:', error);
    return null;
  }
}

// Listen for foreground messages
export function onForegroundMessage(callback: (payload: MessagePayload) => void) {
  if (!messaging) {
    console.warn('Firebase messaging not available');
    return () => {};
  }

  return onMessage(messaging, (payload) => {
    console.log('Foreground message received:', payload);
    
    // Show notification if the app is in foreground
    if (payload.notification) {
      const { title, body, icon, image } = payload.notification;
      
      if ('Notification' in window && Notification.permission === 'granted') {
        const notification = new Notification(title || 'Wedding Update', {
          body: body || '',
          icon: icon || '/icons/icon-192x192.png',
          image: image,
          badge: '/icons/icon-72x72.png',
          tag: payload.data?.tag || 'wedding-notification',
          data: payload.data,
          requireInteraction: true,
        });

        // Handle notification click
        notification.onclick = () => {
          window.focus();
          if (payload.data?.url) {
            window.location.href = payload.data.url;
          }
          notification.close();
        };
      }
    }
    
    callback(payload);
  });
}

// Test notification (for development)
export async function sendTestNotification(): Promise<boolean> {
  try {
    const subscription = getCurrentSubscription();
    if (!subscription) {
      console.warn('No subscription found for test notification');
      return false;
    }

    const response = await fetch('/api/notifications/test', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token: subscription.token,
      }),
    });

    return response.ok;
  } catch (error) {
    console.error('Error sending test notification:', error);
    return false;
  }
}

// Daily love messages data
export const dailyLoveMessages = [
  {
    title: "💕 Daily Love Message",
    body: "Every love story is beautiful, but ours is my favorite.",
    image: "/images/couple/hero-bg.png"
  },
  {
    title: "💖 Love Reminder",
    body: "You are my today and all of my tomorrows.",
    image: "/images/couple/hero-bg.png"
  },
  {
    title: "💝 Sweet Thoughts",
    body: "In all the world, there is no heart for me like yours.",
    image: "/images/couple/hero-bg.png"
  },
  {
    title: "💞 Love Note",
    body: "I choose you. And I'll choose you over and over, without pause.",
    image: "/images/couple/hero-bg.png"
  },
  {
    title: "💗 Daily Reminder",
    body: "You are my sunshine on a cloudy day.",
    image: "/images/couple/hero-bg.png"
  },
  {
    title: "💘 Love Message",
    body: "Together is a wonderful place to be.",
    image: "/images/couple/hero-bg.png"
  },
  {
    title: "💓 Sweet Words",
    body: "You make my heart smile every single day.",
    image: "/images/couple/hero-bg.png"
  }
];

// Wedding reminder messages
export const weddingReminderMessages = [
  {
    daysUntil: 30,
    title: "🎉 30 Days Until Our Wedding!",
    body: "The countdown begins! We can't wait to celebrate with you.",
    url: "/rsvp"
  },
  {
    daysUntil: 14,
    title: "💒 Two Weeks to Go!",
    body: "Our special day is getting closer. Have you RSVP'd yet?",
    url: "/rsvp"
  },
  {
    daysUntil: 7,
    title: "📅 One Week Until the Big Day!",
    body: "Final preparations are underway. See you soon!",
    url: "/details"
  },
  {
    daysUntil: 3,
    title: "🥳 3 Days Until We Say 'I Do'!",
    body: "The excitement is building! Check out the latest photos.",
    url: "/gallery"
  },
  {
    daysUntil: 1,
    title: "💍 Tomorrow is the Day!",
    body: "We're getting married tomorrow! Thank you for being part of our journey.",
    url: "/"
  },
  {
    daysUntil: 0,
    title: "👰🤵 It's Our Wedding Day!",
    body: "Today we become husband and wife! Follow along for live updates.",
    url: "/gallery"
  }
];
