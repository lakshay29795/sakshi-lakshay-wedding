'use client';

import { useState, useEffect, useCallback } from 'react';

interface PWAState {
  isOnline: boolean;
  isInstallable: boolean;
  isInstalled: boolean;
  isSupported: boolean;
  installPrompt: any;
}

interface CacheInfo {
  [cacheName: string]: number;
}

export function usePWA() {
  const [state, setState] = useState<PWAState>({
    isOnline: true,
    isInstallable: false,
    isInstalled: false,
    isSupported: false,
    installPrompt: null,
  });

  const [serviceWorker, setServiceWorker] = useState<ServiceWorkerRegistration | null>(null);
  const [cacheInfo, setCacheInfo] = useState<CacheInfo>({});

  // Check if PWA is supported
  useEffect(() => {
    const isSupported = 'serviceWorker' in navigator && 'PushManager' in window;
    setState(prev => ({ ...prev, isSupported }));
  }, []);

  // Handle online/offline status
  useEffect(() => {
    const handleOnline = () => setState(prev => ({ ...prev, isOnline: true }));
    const handleOffline = () => setState(prev => ({ ...prev, isOnline: false }));

    setState(prev => ({ ...prev, isOnline: navigator.onLine }));

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Handle PWA installation
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setState(prev => ({ 
        ...prev, 
        isInstallable: true, 
        installPrompt: e 
      }));
    };

    const handleAppInstalled = () => {
      setState(prev => ({ 
        ...prev, 
        isInstalled: true, 
        isInstallable: false, 
        installPrompt: null 
      }));
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    // Check if already installed
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    const isInWebAppiOS = (window.navigator as any).standalone === true;
    const isInstalled = isStandalone || isInWebAppiOS;

    setState(prev => ({ ...prev, isInstalled }));

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  // Register service worker and handle messages
  useEffect(() => {
    if (!state.isSupported) return;

    const registerServiceWorker = async () => {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js');
        setServiceWorker(registration);

        // Handle service worker messages
        navigator.serviceWorker.addEventListener('message', (event) => {
          const { type, timestamp } = event.data;
          
          switch (type) {
            case 'CACHE_UPDATED':
              localStorage.setItem('lastCacheUpdate', timestamp);
              break;
            case 'RSVP_SYNCED':
            case 'GUESTBOOK_SYNCED':
              // Show success notification
              if ('Notification' in window && Notification.permission === 'granted') {
                new Notification('Sync Complete', {
                  body: event.data.message,
                  icon: '/icons/icon-192x192.png'
                });
              }
              break;
          }
        });

      } catch (error) {
        console.error('Service worker registration failed:', error);
      }
    };

    registerServiceWorker();
  }, [state.isSupported]);

  // Install PWA
  const installPWA = useCallback(async () => {
    if (!state.installPrompt) return false;

    try {
      const result = await state.installPrompt.prompt();
      const outcome = await result.userChoice;
      
      if (outcome === 'accepted') {
        setState(prev => ({ 
          ...prev, 
          isInstallable: false, 
          installPrompt: null 
        }));
        return true;
      }
    } catch (error) {
      console.error('PWA installation failed:', error);
    }
    
    return false;
  }, [state.installPrompt]);

  // Request notification permission
  const requestNotificationPermission = useCallback(async () => {
    if (!('Notification' in window)) return false;

    if (Notification.permission === 'granted') return true;
    if (Notification.permission === 'denied') return false;

    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }, []);

  // Subscribe to push notifications
  const subscribeToPush = useCallback(async () => {
    if (!serviceWorker || !state.isOnline) return null;

    try {
      const subscription = await serviceWorker.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
      });

      // Send subscription to server
      await fetch('/api/push/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(subscription)
      });

      return subscription;
    } catch (error) {
      console.error('Push subscription failed:', error);
      return null;
    }
  }, [serviceWorker, state.isOnline]);

  // Store data for background sync
  const storeForSync = useCallback((type: 'RSVP' | 'GUESTBOOK_MESSAGE', data: any) => {
    if (!serviceWorker) return;

    const messageType = type === 'RSVP' ? 'STORE_RSVP' : 'STORE_GUESTBOOK_MESSAGE';
    
    serviceWorker.active?.postMessage({
      type: messageType,
      data: {
        ...data,
        id: `${type.toLowerCase()}-${Date.now()}`,
        timestamp: new Date().toISOString()
      }
    });
  }, [serviceWorker]);

  // Get cache information
  const getCacheInfo = useCallback(async () => {
    if (!serviceWorker) return {};

    return new Promise<CacheInfo>((resolve) => {
      const messageChannel = new MessageChannel();
      
      messageChannel.port1.onmessage = (event) => {
        setCacheInfo(event.data);
        resolve(event.data);
      };

      serviceWorker.active?.postMessage(
        { type: 'GET_CACHE_INFO' },
        [messageChannel.port2]
      );
    });
  }, [serviceWorker]);

  // Clear all caches
  const clearCache = useCallback(async () => {
    if (!serviceWorker) return false;

    return new Promise<boolean>((resolve) => {
      const messageChannel = new MessageChannel();
      
      messageChannel.port1.onmessage = (event) => {
        resolve(event.data.success);
      };

      serviceWorker.active?.postMessage(
        { type: 'CLEAR_CACHE' },
        [messageChannel.port2]
      );
    });
  }, [serviceWorker]);

  // Update service worker
  const updateServiceWorker = useCallback(async () => {
    if (!serviceWorker) return false;

    try {
      await serviceWorker.update();
      return true;
    } catch (error) {
      console.error('Service worker update failed:', error);
      return false;
    }
  }, [serviceWorker]);

  // Share content (Web Share API)
  const shareContent = useCallback(async (data: ShareData) => {
    if (navigator.share) {
      try {
        await navigator.share(data);
        return true;
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          console.error('Web Share failed:', error);
        }
      }
    }
    
    // Fallback to clipboard
    if (navigator.clipboard && data.url) {
      try {
        await navigator.clipboard.writeText(data.url);
        return true;
      } catch (error) {
        console.error('Clipboard write failed:', error);
      }
    }
    
    return false;
  }, []);

  return {
    // State
    ...state,
    serviceWorker,
    cacheInfo,
    
    // Actions
    installPWA,
    requestNotificationPermission,
    subscribeToPush,
    storeForSync,
    getCacheInfo,
    clearCache,
    updateServiceWorker,
    shareContent,
  };
}
