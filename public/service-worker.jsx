// Service Worker for a better offline experience for D.E.M.N App
// Note: 'self' is a valid global in service worker context

const CACHE_NAME = 'd.e.m.n-app-cache-v1';
const OFFLINE_URL = 'offline.html';

const APP_SHELL_FILES = [
  '/',
  '/index.html',
  '/offline.html',
  '/manifest.json',
  '/icons/icon-source.svg',
  '/icons/icon-192x192.png'
];

// 1. Install Event:
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Install event in progress.');
  event.waitUntil(
    (async () => {
      try {
        const cache = await caches.open(CACHE_NAME);
        console.log('[Service Worker] Caching App Shell:', APP_SHELL_FILES);
        await cache.addAll(APP_SHELL_FILES);
      } catch (error) {
        console.error('[Service Worker] Failed to cache App Shell:', error);
      }
    })()
  );
});

// 2. Activate Event:
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activate event in progress.');
  event.waitUntil(
    (async () => {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[Service Worker] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
      // Force the activated service worker to take control immediately
      await self.clients.claim();
    })()
  );
});

// 3. Fetch Event: Network-First strategy
self.addEventListener('fetch', (event) => {
  const { request } = event;

  if (request.mode === 'navigate') {
    event.respondWith(
      (async () => {
        try {
          const networkResponse = await fetch(request);
          return networkResponse;
        } catch (error) {
          console.log('[Service Worker] Fetch failed, returning offline page.', error);
          const cache = await caches.open(CACHE_NAME);
          const cachedResponse = await cache.match(OFFLINE_URL);
          return cachedResponse;
        }
      })()
    );
    return;
  }

  event.respondWith(
    (async () => {
      const cache = await caches.open(CACHE_NAME);

      const cachedResponse = await cache.match(request);
      if (cachedResponse) {
        return cachedResponse;
      }

      try {
        const networkResponse = await fetch(request);
        return networkResponse;
      } catch (error) {
        console.error('[Service Worker] Fetch failed, not in cache:', request.url, error);
        return new Response(null, { status: 404 });
      }
    })()
  );
});
