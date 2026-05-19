const CACHE_NAME = 'work-rest-timer-v1';
const urlsToCache = [
  './',
  './index.html',
  './lib/NoSleep.min.js',
  './manifest.json',
   './zenback.js', 

  // icon files
  "./img/icon-192.png",
  "./img/icon-512.png",
  
  
  // audio files
  './audio-bundle/audio-bundle-part-music-none.js' 
  './audio-bundle/audio-bundle-part-music-relax.js' 
  './audio-bundle/audio-bundle-part-music-work.js' 
  './audio-bundle/audio-bundle-part-sfx-bells.js' 
  './audio-bundle/audio-bundle-part-voice-none.js' 
  './audio-bundle/audio-bundle-part-voice-Alice.js' 
  './audio-bundle/audio-bundle-part-voice-Hjalmar.js' 
 
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async cache => {
      for (const url of urlsToCache) {
        try {
          await cache.add(url);
          console.log('[SW] Cached successfully:', url);
        } catch (err) {
          console.error('[SW] Failed to cache:', url, err);
        }
      }
    })
  );
});

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  if (url.pathname.endsWith('.mp3')) {
    event.respondWith(
      caches.open(CACHE_NAME).then(async (cache) => {
        const cachedResponse = await caches.match(event.request);
        if (cachedResponse) return cachedResponse;

        // FORCE a full response instead of a partial one
        // We do this by creating a new request and removing the 'Range' header
        const response = await fetch(event.request);
        
        if (response.status === 206) {
          // If we got a partial, we try to fetch it again without range headers
          // Most servers will then send the whole file (200 OK)
          const fullResponse = await fetch(event.request.url); 
          if (fullResponse.status === 200) {
            cache.put(event.request, fullResponse.clone());
            return fullResponse;
          }
        } else if (response.status === 200) {
          cache.put(event.request, response.clone());
        }
        
        return response;
      })
    );
    return;
  }

});

/* //normally it would be..

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.open(CACHE_NAME).then(async (cache) => {
      const cachedResponse = await caches.match(event.request);
      
      // Start a network fetch to see if there is a newer version
      const fetchPromise = fetch(event.request).then(networkResponse => {
        // Update the cache with the new version
        cache.put(event.request, networkResponse.clone());
        return networkResponse;
      }).catch(() => {
        // Network failed, return the cached version
        return cachedResponse;
      });

      // Return the cached version immediately if it exists, 
      // otherwise wait for the network fetch
      return cachedResponse || fetchPromise;
    })
  );
});*/
