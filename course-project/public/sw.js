self.addEventListener('install', (event) => {
    console.log('[Service Worker] Installing Service Worker ....', event);
});

self.addEventListener('activate', (event) => {
    console.log('[Service Worker] Activating Service Worker ....', event);
});

self.addEventListener('fetch', (event) => {
    console.log('[Serview Working] Fetching somethind ...', event);
    event.respondWith(fetch(event.request));
});
