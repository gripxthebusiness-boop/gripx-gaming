const CACHE_NAME = 'gripx-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/favicon.ico',
];

// Install event: cache essential files
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache).catch(() => {
        // Silently fail if offline
        console.log('Service Worker: offline installation');
      });
    })
  );
  self.skipWaiting();
});

// Activate event: clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event: network first, then cache
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip cross-origin requests. External assets/APIs should not be intercepted by this service worker.
  if (url.hostname !== self.location.hostname) {
    return;
  }

  // Network-first strategy for API calls
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request)
        .then(response => {
          if (response.ok) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then(c => c.put(request, responseClone));
          }
          return response;
        })
        .catch(() => {
          return caches.match(request).then(cachedResponse => {
            return cachedResponse || new Response(JSON.stringify({ offline: true }), {
              headers: { 'Content-Type': 'application/json' }
            });
          });
        })
    );
  }
  // Cache-first strategy for assets
  else {
    event.respondWith(
      caches.match(request).then(cachedResponse => {
        return cachedResponse || fetch(request).then(response => {
          if (response.ok && (request.url.includes('.js') || request.url.includes('.css') || request.url.includes('.woff2'))) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then(c => c.put(request, responseClone));
          }
          return response;
        });
      })
    );
  }
});
