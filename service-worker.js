const CACHE_NAME = 'e-setu-cache-v2';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './css/design-system.css',
  './css/components.css',
  './js/app.js',
  './js/store.js',
  './js/vernacular.js',
  './js/voice-engine.js',
  './js/acoustic-tester.js',
  './js/legal-shield.js',
  './js/cannibalization.js',
  './js/scrap-lens.js',
  './js/porh-handshake.js',
  './js/recycler-cockpit.js',
  './datasets/materials.json',
  './datasets/prices_mandi.json',
  './datasets/authorized_recyclers.json',
  './datasets/transactions_ledger.json',
  './datasets/traceability_porh.json',
  './datasets/collector_profiles.json',
  './datasets/ai_training_metadata.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[E-Setu ServiceWorker] Pre-caching all 7 datasets and offline assets');
      return cache.addAll(ASSETS_TO_CACHE).catch(err => {
        console.warn('Non-blocking cache add warning:', err);
      });
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('[E-Setu ServiceWorker] Clearing outdated cache', key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // Ignore non-GET requests or browser-extensions
  if (event.request.method !== 'GET' || !event.request.url.startsWith('http')) {
    return;
  }

  // Network-first for dynamic API endpoints, Cache-first with network fallback for assets
  const isApiRequest = event.request.url.includes('/api/');

  if (isApiRequest) {
    event.respondWith(
      fetch(event.request).catch(() => caches.match(event.request))
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        // Fetch in background to update cache (stale-while-revalidate)
        fetch(event.request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const clone = networkResponse.clone();
            caches.open(CACHE_NAME).then(c => c.put(event.request, clone));
          }
        }).catch(() => {});
        return cachedResponse;
      }

      return fetch(event.request).then((networkResponse) => {
        if (!networkResponse || networkResponse.status !== 200) {
          return networkResponse;
        }
        const responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });
        return networkResponse;
      }).catch(() => {
        if (event.request.mode === 'navigate') {
          return caches.match('./index.html');
        }
      });
    })
  );
});
