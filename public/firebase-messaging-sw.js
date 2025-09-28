// Firebase Messaging Service Worker
// This file handles background push notifications

importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

// Firebase configuration (should match your config)
const firebaseConfig = {
  apiKey: "demo-api-key",
  authDomain: "demo-project.firebaseapp.com",
  projectId: "demo-project",
  storageBucket: "demo-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "demo-app-id"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Firebase Messaging
const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log('Background message received:', payload);

  const { notification, data } = payload;
  
  // Customize notification
  const notificationTitle = notification?.title || 'Wedding Update';
  const notificationOptions = {
    body: notification?.body || 'New update from Sakshi & Lakshay',
    icon: notification?.icon || '/icons/icon-192x192.png',
    badge: '/icons/icon-72x72.png',
    image: notification?.image || '/images/couple/hero-bg.png',
    tag: data?.tag || 'wedding-notification',
    data: {
      url: data?.url || '/',
      timestamp: Date.now(),
      ...data
    },
    actions: [
      {
        action: 'view',
        title: 'View',
        icon: '/icons/icon-72x72.png'
      },
      {
        action: 'dismiss',
        title: 'Dismiss'
      }
    ],
    requireInteraction: true,
    vibrate: [200, 100, 200],
    silent: false
  };

  // Show notification
  return self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification click
self.addEventListener('notificationclick', (event) => {
  console.log('Notification clicked:', event);
  
  event.notification.close();
  
  const action = event.action;
  const url = event.notification.data?.url || '/';
  
  if (action === 'dismiss') {
    return;
  }
  
  // Open the app
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // Check if there's already a window/tab open with the target URL
      for (const client of clientList) {
        if (client.url.includes(url) && 'focus' in client) {
          return client.focus();
        }
      }
      
      // If not, open a new window/tab
      if (clients.openWindow) {
        return clients.openWindow(url);
      }
    })
  );
});

// Handle notification close
self.addEventListener('notificationclose', (event) => {
  console.log('Notification closed:', event);
  
  // Track notification dismissal
  const data = event.notification.data;
  if (data?.trackDismissal) {
    fetch('/api/notifications/track', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'dismiss',
        notificationId: data.id,
        timestamp: Date.now()
      })
    }).catch(console.error);
  }
});

// Handle push events (additional processing)
self.addEventListener('push', (event) => {
  if (!event.data) {
    return;
  }

  try {
    const payload = event.data.json();
    console.log('Push event received:', payload);
    
    // Custom processing for different notification types
    if (payload.data?.type === 'daily-love-message') {
      // Track daily love message delivery
      fetch('/api/notifications/track', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'delivered',
          type: 'daily-love-message',
          timestamp: Date.now()
        })
      }).catch(console.error);
    }
  } catch (error) {
    console.error('Error processing push event:', error);
  }
});

console.log('Firebase Messaging Service Worker loaded');
