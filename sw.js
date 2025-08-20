const CACHE_NAME = 'hike-map-cache-v4'; // Version incremented to trigger update

// The 'install' event is fired when a new service worker is installed.
self.addEventListener('install', event => {
  console.log('[Service Worker] Install');
  // We no longer call self.skipWaiting() here to wait for user confirmation.
});

// This new listener waits for a message from the page to activate.
self.addEventListener('message', event => {
    if (event.data && event.data.action === 'skipWaiting') {
        self.skipWaiting();
    }
});

// The 'activate' event cleans up old caches.
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
  return self.clients.claim();
});

// The 'fetch' event serves files from the cache.
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        return response || fetch(event.request);
      })
  );
});
