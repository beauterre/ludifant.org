const CACHE_NAME = 'work-rest-timer-v2026-05-19';

const urlsToCache = [
  './',
  './index.html',
  './lib/NoSleep.min.js',
  './manifest.json', // IMPORTANT: Remove this line if the file does not exist on disk!
  './zenback.js', 

  // icon files
  "./img/icon-192.png",
  "./img/icon-512.png",
  
  // audio bundle files (These now contain your audio as base64)
  './audio-bundle/audio-bundle-part-music-none.js', 
  './audio-bundle/audio-bundle-part-music-relax.js', 
  './audio-bundle/audio-bundle-part-music-work.js', 
  './audio-bundle/audio-bundle-part-sfx-bells.js', 
  './audio-bundle/audio-bundle-part-voice-none.js', 
  './audio-bundle/audio-bundle-part-voice-Alice.js', 
  './audio-bundle/audio-bundle-part-voice-Hjalmar.js' 
];

// INSTALLATION: Cache all critical assets
self.addEventListener('install', event => {
  console.log('[SW] Installing Service Worker...');
  event.waitUntil(
    caches.open(CACHE_NAME).then(async cache => {
      for (const url of urlsToCache) {
        try {
          await cache.add(url);
          console.log('[SW] Cached successfully:', url);
        } catch (err) {
          console.error('[SW] Failed to cache:', url, err);
          // We don't throw here so that one missing file doesn't break the whole SW
        }
      }
    })
  );
});

// ACTIVATION: Clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('[SW] Clearing old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// FETCH: The core logic for offline access
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      // 1. Return cached version immediately if found
      if (cachedResponse) {
        return cachedResponse;
      }

      // 2. Otherwise, fetch from the network
      return fetch(event.request).then(response => {
        // If the network request was successful, cache it for next time
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }

        const responseToCache = response.clone();
        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, responseToCache);
        });

        return response;
      }).catch(err => {
        console.error('[SW] Fetch failed; returning offline fallback if available:', err);
        // This is where you could return a custom offline.html if you had one
        return caches.match('./index.html');
      });
    })
  );
});
