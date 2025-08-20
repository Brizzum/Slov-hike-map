const CACHE_NAME = 'hike-map-cache-v3';

// The 'install' event is fired when the service worker is first installed.
// We now just ensure the service worker activates.
self.addEventListener('install', event => {
  console.log('[Service Worker] Install');
  // Skip waiting forces the waiting service worker to become the active service worker.
  self.skipWaiting();
});

// The 'activate' event is a good place to clean up old caches.
self.addEventListener('activate', event => {
  console.log('[Service Worker] Activate');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('[Service Worker] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  // Claiming the clients forces the browser to use this service worker for the current page.
  return self.clients.claim();
});

// The 'fetch' event intercepts network requests.
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // If we find a match in the cache, return it. Otherwise, fetch from the network.
        return response || fetch(event.request);
      })
  );
});