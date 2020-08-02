const appName = '[Service Worker]';

self.addEventListener('install', (event) => {
    console.log(appName+' Installing Service Worker ....', event);
});

self.addEventListener('activate', (event) => {
    console.log(appName+' Activating Service Worker ....', event);
});

self.addEventListener('fetch', (event) => {
    console.log(appName+' Fetching something ...', event);
    event.respondWith(fetch(event.request));
});
