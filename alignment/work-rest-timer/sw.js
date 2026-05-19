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
  './audio/music/work/work-music001.mp3',
  './audio/music/work/work-music002.mp3',
  './audio/music/work/work-music003.mp3',
  './audio/music/work/work-music004.mp3',
  './audio/music/work/work-music005.mp3',
  './audio/music/work/work-music006.mp3',
  './audio/music/work/work-music007.mp3',
  './audio/music/work/work-music008.mp3',
  './audio/music/work/work-music009.mp3',
  './audio/music/work/work-music010.mp3',
  './audio/music/work/work-music011.mp3',
  './audio/music/work/work-music012.mp3',
  './audio/music/work/work-music013.mp3',
  './audio/music/relax/relax-music001.mp3',
  './audio/music/relax/relax-music002.mp3',
  './audio/music/relax/relax-music003.mp3',
  './audio/music/relax/relax-music004.mp3',
  './audio/sfx/work-bell.mp3',
  './audio/sfx/none.mp3',
  './audio/sfx/relax-bell.mp3',

  // voices (Alice)
  './audio/voices/Alice/begin001.mp3',
  './audio/voices/Alice/begin002.mp3',
  './audio/voices/Alice/begin003.mp3',
  './audio/voices/Alice/pause001.mp3',
  './audio/voices/Alice/pause002.mp3',
  './audio/voices/Alice/pause003.mp3',
  './audio/voices/Alice/resume001.mp3',
  './audio/voices/Alice/resume002.mp3',
  './audio/voices/Alice/resume003.mp3',
  './audio/voices/Alice/end001.mp3',
  './audio/voices/Alice/end002.mp3',
  './audio/voices/Alice/end003.mp3',
  './audio/voices/Alice/active001.mp3',
  './audio/voices/Alice/active002.mp3',
  './audio/voices/Alice/active003.mp3',
  './audio/voices/Alice/active004.mp3',
  './audio/voices/Alice/resting001.mp3',
  './audio/voices/Alice/resting002.mp3',
  './audio/voices/Alice/resting003.mp3',
  './audio/voices/Alice/resting004.mp3',
  
  // voices (Hjalmar)
  './audio/voices/Hjalmar/begin001.mp3',
  './audio/voices/Hjalmar/begin002.mp3',
  './audio/voices/Hjalmar/begin003.mp3',
  './audio/voices/Hjalmar/pause001.mp3',
  './audio/voices/Hjalmar/pause002.mp3',
  './audio/voices/Hjalmar/pause003.mp3',
  './audio/voices/Hjalmar/resume001.mp3',
  './audio/voices/Hjalmar/resume002.mp3',
  './audio/voices/Hjalmar/resume003.mp3',
  './audio/voices/Hjalmar/end001.mp3',
  './audio/voices/Hjalmar/end002.mp3',
  './audio/voices/Hjalmar/end003.mp3',
  './audio/voices/Hjalmar/active001.mp3',
  './audio/voices/Hjalmar/active002.mp3',
  './audio/voices/Hjalmar/active003.mp3',
  './audio/voices/Hjalmar/active004.mp3',
  './audio/voices/Hjalmar/resting001.mp3',
  './audio/voices/Hjalmar/resting002.mp3',
  './audio/voices/Hjalmar/resting003.mp3',
  './audio/voices/Hjalmar/resting004.mp3',
  
  
 // voices (none)
  './audio/voices/none/begin001.mp3',
  './audio/voices/none/begin002.mp3',
  './audio/voices/none/begin003.mp3',
  './audio/voices/none/pause001.mp3',
  './audio/voices/none/pause002.mp3',
  './audio/voices/none/pause003.mp3',
  './audio/voices/none/resume001.mp3',
  './audio/voices/none/resume002.mp3',
  './audio/voices/none/resume003.mp3',
  './audio/voices/none/end001.mp3',
  './audio/voices/none/end002.mp3',
  './audio/voices/none/end003.mp3',
  './audio/voices/none/active001.mp3',
  './audio/voices/none/active002.mp3',
  './audio/voices/none/active003.mp3',
  './audio/voices/none/active004.mp3',
  './audio/voices/none/resting001.mp3',
  './audio/voices/none/resting002.mp3',
  './audio/voices/none/resting003.mp3',
  './audio/voices/none/resting004.mp3' 


  
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
