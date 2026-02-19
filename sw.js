const CACHE_NAME = "mdt-cache-v2";
const CORE_ASSETS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./scanner.html",
  "./css/app.css"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_ASSETS)).then(()=>self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.map(k => k===CACHE_NAME ? null : caches.delete(k)))).then(()=>self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  // Only GET
  if (req.method !== "GET") return;
  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached;
      return fetch(req).then((resp) => {
        // Cache same-origin assets
        try{
          const url = new URL(req.url);
          if (url.origin === location.origin) {
            const copy = resp.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(req, copy));
          }
        }catch(e){}
        return resp;
      }).catch(() => cached || caches.match("./index.html"));
    })
  );
});
