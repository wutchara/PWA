const appName = '[Service Worker]';

self.addEventListener('install', (event) => {
    console.log(appName+' Installing Service Worker ....', event);
    event.waitUntil(
        caches.open('static')
        .then((cache) => {
            console.log(appName+' Pre-caching App shell.');
            cache.addAll([
                '/',
                '/index.html',
                '/src/js/app.js',
                '/src/js/feed.js',
                '/src/js/promise.js',
                '/src/js/fetch.js',
                '/src/js/material.min.js',
                '/src/css/app.css',
                '/src/css/feed.css',
                '/src/images/main-image.jpg',
                'https://fonts.googleapis.com/css?family=Roboto:400,700',
                'https://fonts.googleapis.com/icon?family=Material+Icons',
                'https://cdnjs.cloudflare.com/ajax/libs/material-design-lite/1.3.0/material.indigo-pink.min.css',
                
            ]);
        }).catch((err) => {
            console.log('Error caches static', err);
        })
    )
});

self.addEventListener('activate', (event) => {
    console.log(appName+' Activating Service Worker ....', event);
    return self.ClientRectList.claim();
});

self.addEventListener('fetch', (event) => {
    console.log(appName+' Fetching something ...', event);
    event.respondWith(
        caches.match(event.request)
        .then((response) => {
            if(response){
                return response;
            }else{
                return fetch(event.request);
            }
        })
    );
});
