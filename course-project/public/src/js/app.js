var deferredPrompt;

// support legacy browser
if(!window.Promise){
    window.Promise = Promise;
}

if('serviceWorker' in navigator) {
    navigator.serviceWorker
    .register('/sw.js')
    .then(() => {
        console.log('Service worker registered!!!');
    }).catch((err) => {
        console.log('error register service worker', err);
    });
}

window.addEventListener('beforeinstallprompt', (event) => {
    console.log('beforeinstallprompt fired');
    event.preventDefault();
    deferredPrompt = event;
    return false;
});

const promise = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve('This is executed once the timer is done!!');
    }, 3000);
});

promise.then((next) => {
    console.log('next', next);
    return next;
}).then((nextText) => {
    console.log('nextText', nextText);
});

console.log('This is executed right after setTimeout()');
