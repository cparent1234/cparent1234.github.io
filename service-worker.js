const CACHE_NAME = 'karten-workout-v1';
const urlsToCache = [
  './',
  'index.html'
];

// Einfache Installation - nur wesentliche Dateien cachen
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

// Vereinfachte Fetch-Strategie für service-worker.js
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        return response || fetch(event.request);
      })
  );
});
