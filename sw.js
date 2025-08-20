// A unique name for our cache
const CACHE_NAME = 'hike-map-cache-v1';

// We need to import the data.js script to get access to the KML file URLs
importScripts('data.js');

// --- Files to Cache ---

// 1. Get the KML file URLs from the data.js variable
const kmlUrls = hikeStagesData.map(stage => stage.kml);

// 2. Define the "app shell" - the core files your app needs to run
const appShellFiles = [
  '.',
  'index.html',
  'style.css',
  'script.js',
  'data.js',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js',
  'https://cdnjs.cloudflare.com/ajax/libs/togeojson/0.16.0/togeojson.min.js'
];

// 3. Combine the app shell and the KML data into one list
const urlsToCache = [...appShellFiles, ...kmlUrls];


// --- Service Worker Event Listeners ---

// The 'install' event is fired when the service worker is first installed.
self.addEventListener('install', event => {
  console.log('[Service Worker] Install');
  // We wait until the cache is opened and all our files are cached.
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[Service Worker] Caching all: app shell and data');
        // If any of the files fail to cache, the service worker installation will fail.
        return cache.addAll(urlsToCache);
      })
  );
});

// The 'fetch' event is fired for every network request the page makes.
self.addEventListener('fetch', event => {
  event.respondWith(
    // We look for a matching request in the cache first.
    caches.match(event.request)
      .then(response => {
        if (response) {
          // If we find a match in the cache, we return it.
          console.log('[Service Worker] Returning from Cache:', event.request.url);
          return response;
        }
        // If it's not in the cache, we let the browser fetch it from the network.
        console.log('[Service Worker] Fetching from Network:', event.request.url);
        return fetch(event.request);
      })
  );
});