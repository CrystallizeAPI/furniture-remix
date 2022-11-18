const MAIN_CACHE = 'frntr-v2-cache-v1.0.1';

const log = (message) => {
    if (MAIN_CACHE.indexOf('debug') === 0) {
        console.log('SW - ' + MAIN_CACHE, message);
    }
};

self.addEventListener('install', (event) => {
    log('Install');
    event.waitUntil(
        (async () => {
            const cache = await caches.open(MAIN_CACHE);
            // do something on install, like caching resources you would get from a server
        })(),
    );
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        (async () => {
            const cacheNames = await caches.keys();
            return Promise.all(
                cacheNames.map(function (cacheName) {
                    if (MAIN_CACHE.indexOf(cacheName) === -1) {
                        log('Deleting => ' + cacheName);
                        return caches.delete(cacheName);
                    }
                }),
            );
        })(),
    );
    self.clients.claim();
});

const canFetch = (request) => {
    if (request.method === 'POST') return false;
    if (!(request.url.indexOf('http') === 0)) return false;
    return true;
};

self.addEventListener('fetch', (event) => {
    if (!canFetch(event.request)) {
        log('Fetch Refused - ' + event.request.url);
        return;
    }
    event.respondWith(
        (async () => {
            try {
                log('Fetch Normal - ' + event.request.url);
                const cache = await caches.open(MAIN_CACHE);
                // if you want to returned the cache version, you can do it here. (assuming you have a cache version)
                const cachedResponse = await cache.match(event.request.url);
                if (cachedResponse) {
                    log('Hit: ' + event.request.url);
                    return cachedResponse;
                }
                const freshResponse = await fetch(event.request);
                if (!freshResponse || freshResponse.status !== 200 || freshResponse.type !== 'basic') {
                    return freshResponse;
                }
                const responseToCache = freshResponse.clone();
                log('Put ' + event.request.url);

                // this is where you can cache the response, we are NOT caching the response here for the boilerplate
                // but you can cache it if you want to and manage it yourself.

                // cache.put(event.request, responseToCache);

                return freshResponse;
            } catch (error) {
                log(error);
            }
        })(),
    );
});
