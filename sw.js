const CACHE_NAME = "laundry-cache-v1";

const urlsToCache = [
    "/",
    "/index.html",
    "/manifest.json",
    "/src/main.jsx",
    "/src/App.jsx"
];


self.addEventListener("install", (e) => {
    e.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll(URLS_TO_CACHE))
    );
});

// Install SW
self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(urlsToCache);
        })
    );
});

// Fetch Handler
self.addEventListener("fetch", (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return (
                response ||
                fetch(event.request).catch(() =>
                    caches.match("/index.html")
                )
            );
        })
    );
});

// Activate & cleanup old cache
self.addEventListener("activate", (event) => {
    const whitelist = [CACHE_NAME];

    event.waitUntil(
        caches.keys().then((keys) =>
            Promise.all(
                keys.map((key) => {
                    if (!whitelist.includes(key)) {
                        return caches.delete(key);
                    }
                })
            )
        )
    );
});
