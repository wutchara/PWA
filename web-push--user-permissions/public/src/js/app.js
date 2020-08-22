
var deferredPrompt;
var enableNotificationsButtons = document.querySelectorAll('.enable-notifications');

if (!window.Promise) {
  window.Promise = Promise;
}

if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register('/sw.js')
    .then(function () {
      console.log('Service worker registered!');
    })
    .catch(function(err) {
      console.log(err);
    });
}

window.addEventListener('beforeinstallprompt', function(event) {
  console.log('beforeinstallprompt fired');
  event.preventDefault();
  deferredPrompt = event;
  return false;
});

window.addEventListener('beforeinstallprompt', function(event) {
  console.log('beforeinstallprompt fired');
  event.preventDefault();
  deferredPrompt = event;
  return false;
});

function configurePushSub() {
  if (!('serviceWorker' in navigator)) {
    return;
  }

  var reg;
  navigator.serviceWorker.ready
    .then(function(swreg) {
      reg = swreg;
      return swreg.pushManager.getSubscription();
    })
    .then(function(sub) {
      // https://blog.mozilla.org/services/2016/04/04/using-vapid-with-webpush/
      if (sub === null) {
        // Create a new subscription
        // command `npm run web-push generate-vapid-keys`
        // =======================================

        // Public Key:
        // BNR-TXYtMHBseoBlzfUYltjXX6Y0lTHgAo8p-vE0PbzGq8Z02vfeLz6pEN-Bt6G3ixe9zLnOSMn3QN0HVUXkOpM

        // Private Key:
        // tOoPLFtq0WjngGxXIOow2k167tuP32H6Vj77FxPYpp4

        // =======================================
        var vapidPublicKey = 'BNR-TXYtMHBseoBlzfUYltjXX6Y0lTHgAo8p-vE0PbzGq8Z02vfeLz6pEN-Bt6G3ixe9zLnOSMn3QN0HVUXkOpM';
        var convertedVapidPublicKey = urlBase64ToUint8Array(vapidPublicKey);
        return reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: convertedVapidPublicKey
        });
      } else {
        // We have a subscription
      }
    })
    .then(function(newSub) {
      return fetch('https://pwagram-99adf.firebaseio.com/subscriptions.json', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(newSub)
      })
    })
    .then(function(res) {
      if (res.ok) {
        displayConfirmNotification();
      }
    })
    .catch(function(err) {
      console.log(err);
    });
}

displayConfirmNotification = () => {
  if('serviceWorker' in navigator){
    const options = {
      body: 'You successfully.....',
      icon: '/src/images/icons/app-icon-96x96.png',
      image: '/src/images/sf-boat.jpg',
      dir: 'ltr',
      lang: 'en-US', // BCP 47,
      vibrate: [100, 50, 200],
      badge: '/src/images/icons/app-icon-96x96.png',
      tag: 'confirm-notification',
      renotify: true,
      actions: [
        { action: 'confirm', title: 'Okay', icon: '/src/images/icons/app-icon-96x96.png' },
        { action: 'cancel', title: 'Cancel', icon: '/src/images/icons/app-icon-96x96.png' }
      ]
    };
    navigator.serviceWorker.ready
    .then((swreg) => {
      
      swreg.showNotification('Successfully subscribed!!!', options);
    });
  }
}

function askForNotificationPermission() {
  Notification.requestPermission(function(result) {
    console.log('User Choice', result);
    if (result !== 'granted') {
      console.log('No notification permission granted!');
    } else {
      displayConfirmNotification();
      // TODO: setup firebase first
      // configurePushSub();
    }
  });
}

if ('Notification' in window) {
  for (var i = 0; i < enableNotificationsButtons.length; i++) {
    enableNotificationsButtons[i].style.display = 'inline-block';
    enableNotificationsButtons[i].addEventListener('click', askForNotificationPermission);
  }
}