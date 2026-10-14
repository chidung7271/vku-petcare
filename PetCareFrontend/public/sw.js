const CACHE_NAME = 'petcare-pwa-v1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/logo.png',
  '/manifest.webmanifest'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Pre-caching offline assets');
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('[SW] Clearing old cache:', key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // Navigation fallback & cache-first for static, network-first for others
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => {
        return caches.match('/index.html') || caches.match('/');
      })
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request)
        .then((networkResponse) => {
          if (
            networkResponse &&
            networkResponse.status === 200 &&
            (event.request.url.startsWith('http') || event.request.url.startsWith('https'))
          ) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              // Cache static assets dynamically
              if (
                event.request.url.includes('.js') ||
                event.request.url.includes('.css') ||
                event.request.url.includes('.png') ||
                event.request.url.includes('fonts.googleapis')
              ) {
                cache.put(event.request, responseClone);
              }
            });
          }
          return networkResponse;
        })
        .catch(() => {
          // Graceful fallback
          if (event.request.destination === 'image') {
            return caches.match('/logo.png');
          }
        });
    })
  );
});
