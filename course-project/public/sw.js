const appName = '[Service Worker]';
const cacheKey = ['static', 'dynamic'];

self.addEventListener('install', (event) => {
    console.log(appName+' Installing Service Worker ....', event);
    event.waitUntil(
        caches.open(cacheKey[0])
        .then((cache) => {
            console.log(appName+' Pre-caching App shell.');
            cache.addAll([
                '/',
                '/index.html',
                '/offline.html',
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

function trimCache(cacheName, maxItems) {
    caches.open(cacheName)
    .then((cache) => {
        return cache.keys();
    }).then((keys) => {
        console.log('keys', keys, maxItems);
        if(keys.length > maxItems){
            cache.delete(keys[0])
            .then(trimCache(cacheName, maxItems));
        }
    })
};

self.addEventListener('activate', (event) => {
    console.log(appName+' Activating Service Worker ....', event);
    // remove old cache version
    event.waitUntil(
        caches.keys().then((keyList => {
            return Promise.all(keyList.map((key) => {
                if(!cacheKey.includes(key)){
                    console.log(appName+' Removing old cache.', key);
                    return caches.delete(key);
                }
            }));
        }))
    );

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
                return fetch(event.request).then((res) => {
                    return caches.open(cacheKey[1]).then((cache) => {
                        // trimCache(cacheKey[1], 3);
                        cache.put(event.request.url, res.clone());
                        return res;
                    });
                });
            }
        }).catch(err => {
            return caches.open(cacheKey[0]).then(cache => {
                return cache.match('/offline.html');
            });
        })
    );
});
