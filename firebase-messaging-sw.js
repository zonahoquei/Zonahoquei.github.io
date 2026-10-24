/* Firebase Cloud Messaging service worker for ZonaHoquei. */
importScripts('https://www.gstatic.com/firebasejs/10.13.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.13.2/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: 'AIzaSyC4DpGAeENPsA5Lypnt511L5VpJLT3JVTg',
  authDomain: 'zona-hoquei-notifications.firebaseapp.com',
  projectId: 'zona-hoquei-notifications',
  storageBucket: 'zona-hoquei-notifications.firebasestorage.app',
  messagingSenderId: '320069813841',
  appId: '1:320069813841:web:82084c784aea11b71a1a70'
});

const messaging = firebase.messaging();
messaging.onBackgroundMessage(function(payload) {
  const notification = payload.notification || {};
  self.registration.showNotification(notification.title || 'ZonaHoquei', {
    body: notification.body || 'Hi ha novetats d’un dels teus favorits.',
    icon: '/favicon.ico',
    data: { url: payload.fcmOptions && payload.fcmOptions.link || 'https://zonahoquei.github.io/' }
  });
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  const url = event.notification.data && event.notification.data.url || 'https://zonahoquei.github.io/';
  event.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(clients) {
    for (const client of clients) {
      if (client.url.indexOf('zonahoquei.github.io') >= 0 && 'focus' in client) return client.focus();
    }
    return self.clients.openWindow(url);
  }));
});
