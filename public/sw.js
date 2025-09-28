// Custom Service Worker for Wedding Website PWA
// This extends the next-pwa generated service worker with additional functionality

const CACHE_NAME = 'wedding-website-v1';
const OFFLINE_URL = '/offline';
const FALLBACK_IMAGE = '/images/couple/hero-bg.png';

// Background sync tags
const RSVP_SYNC_TAG = 'rsvp-sync';
const GUESTBOOK_SYNC_TAG = 'guestbook-sync';

// Install event - cache essential resources
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Service Worker: Caching essential resources');
      return cache.addAll([
        OFFLINE_URL,
        '/',
        '/gallery',
        '/story',
        '/rsvp',
        '/guestbook',
        FALLBACK_IMAGE,
        '/manifest.json'
      ]);
    })
  );
  
  // Skip waiting to activate immediately
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && cacheName.startsWith('wedding-website-')) {
            console.log('Service Worker: Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  
  // Take control of all clients immediately
  return self.clients.claim();
});

// Fetch event - handle network requests
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET requests and chrome-extension requests
  if (request.method !== 'GET' || url.protocol === 'chrome-extension:') {
    return;
  }
  
  // Handle navigation requests
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Update cache timestamp
          if (response.ok) {
            self.clients.matchAll().then((clients) => {
              clients.forEach((client) => {
                client.postMessage({
                  type: 'CACHE_UPDATED',
                  timestamp: new Date().toISOString()
                });
              });
            });
          }
          return response;
        })
        .catch(() => {
          // Return offline page for navigation requests
          return caches.match(OFFLINE_URL);
        })
    );
    return;
  }
  
  // Handle API requests
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Cache successful GET API responses
          if (response.ok && request.method === 'GET') {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          // Return cached API response if available
          return caches.match(request).then((cachedResponse) => {
            if (cachedResponse) {
              return cachedResponse;
            }
            // Return a generic offline response for API requests
            return new Response(
              JSON.stringify({
                error: 'Offline',
                message: 'This feature requires an internet connection'
              }),
              {
                status: 503,
                statusText: 'Service Unavailable',
                headers: { 'Content-Type': 'application/json' }
              }
            );
          });
        })
    );
    return;
  }
  
  // Handle image requests
  if (request.destination === 'image') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          return caches.match(request).then((cachedResponse) => {
            return cachedResponse || caches.match(FALLBACK_IMAGE);
          });
        })
    );
    return;
  }
  
  // Default strategy: Network first, then cache
  event.respondWith(
    fetch(request)
      .then((response) => {
        if (response.ok) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseClone);
          });
        }
        return response;
      })
      .catch(() => {
        return caches.match(request);
      })
  );
});

// Background Sync - Handle offline form submissions
self.addEventListener('sync', (event) => {
  console.log('Service Worker: Background sync triggered:', event.tag);
  
  if (event.tag === RSVP_SYNC_TAG) {
    event.waitUntil(syncRSVPData());
  } else if (event.tag === GUESTBOOK_SYNC_TAG) {
    event.waitUntil(syncGuestBookData());
  }
});

// Sync RSVP data when back online
async function syncRSVPData() {
  try {
    const rsvpData = await getStoredData('pendingRSVP');
    if (!rsvpData) return;
    
    const response = await fetch('/api/rsvp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(rsvpData)
    });
    
    if (response.ok) {
      await clearStoredData('pendingRSVP');
      await notifyClients({
        type: 'RSVP_SYNCED',
        message: 'Your RSVP has been submitted successfully!'
      });
    }
  } catch (error) {
    console.error('Failed to sync RSVP data:', error);
  }
}

// Sync Guest Book data when back online
async function syncGuestBookData() {
  try {
    const messages = await getStoredData('pendingGuestBookMessages') || [];
    
    for (const message of messages) {
      try {
        const response = await fetch('/api/guestbook', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(message)
        });
        
        if (response.ok) {
          // Remove synced message from pending list
          const updatedMessages = messages.filter(m => m.id !== message.id);
          await storeData('pendingGuestBookMessages', updatedMessages);
        }
      } catch (error) {
        console.error('Failed to sync guest book message:', error);
      }
    }
    
    await notifyClients({
      type: 'GUESTBOOK_SYNCED',
      message: 'Your messages have been submitted successfully!'
    });
  } catch (error) {
    console.error('Failed to sync guest book data:', error);
  }
}

// Push notification handler
self.addEventListener('push', (event) => {
  console.log('Service Worker: Push notification received');
  
  if (!event.data) return;
  
  const data = event.data.json();
  const options = {
    body: data.body || 'New update from Sarah & Michael\'s wedding!',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-72x72.png',
    image: data.image || '/images/couple/hero-bg.png',
    vibrate: [200, 100, 200],
    data: {
      url: data.url || '/',
      timestamp: Date.now()
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
    tag: data.tag || 'wedding-notification'
  };
  
  event.waitUntil(
    self.registration.showNotification(data.title || 'Wedding Update', options)
  );
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  console.log('Service Worker: Notification clicked');
  
  event.notification.close();
  
  const action = event.action;
  const url = event.notification.data?.url || '/';
  
  if (action === 'dismiss') {
    return;
  }
  
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((clientList) => {
      // Check if there's already a window/tab open with the target URL
      for (const client of clientList) {
        if (client.url === url && 'focus' in client) {
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

// Message handler for communication with main thread
self.addEventListener('message', (event) => {
  const { type, data } = event.data;
  
  switch (type) {
    case 'STORE_RSVP':
      storeData('pendingRSVP', data);
      self.registration.sync.register(RSVP_SYNC_TAG);
      break;
      
    case 'STORE_GUESTBOOK_MESSAGE':
      getStoredData('pendingGuestBookMessages').then((messages) => {
        const updatedMessages = [...(messages || []), data];
        storeData('pendingGuestBookMessages', updatedMessages);
        self.registration.sync.register(GUESTBOOK_SYNC_TAG);
      });
      break;
      
    case 'GET_CACHE_INFO':
      getCacheInfo().then((info) => {
        event.ports[0].postMessage(info);
      });
      break;
      
    case 'CLEAR_CACHE':
      clearAllCaches().then(() => {
        event.ports[0].postMessage({ success: true });
      });
      break;
  }
});

// Utility functions
async function getStoredData(key) {
  try {
    const cache = await caches.open(CACHE_NAME);
    const response = await cache.match(`/sw-data/${key}`);
    if (response) {
      return await response.json();
    }
  } catch (error) {
    console.error('Error getting stored data:', error);
  }
  return null;
}

async function storeData(key, data) {
  try {
    const cache = await caches.open(CACHE_NAME);
    const response = new Response(JSON.stringify(data));
    await cache.put(`/sw-data/${key}`, response);
  } catch (error) {
    console.error('Error storing data:', error);
  }
}

async function clearStoredData(key) {
  try {
    const cache = await caches.open(CACHE_NAME);
    await cache.delete(`/sw-data/${key}`);
  } catch (error) {
    console.error('Error clearing stored data:', error);
  }
}

async function notifyClients(message) {
  const clients = await self.clients.matchAll();
  clients.forEach((client) => {
    client.postMessage(message);
  });
}

async function getCacheInfo() {
  const cacheNames = await caches.keys();
  const cacheInfo = {};
  
  for (const cacheName of cacheNames) {
    const cache = await caches.open(cacheName);
    const keys = await cache.keys();
    cacheInfo[cacheName] = keys.length;
  }
  
  return cacheInfo;
}

async function clearAllCaches() {
  const cacheNames = await caches.keys();
  await Promise.all(
    cacheNames.map((cacheName) => caches.delete(cacheName))
  );
}

console.log('Service Worker: Custom wedding website service worker loaded');
