(function(){
const version = 'v2';
const cacheName = `${version}::cache`;
const defaultCacheList = ['index.html'];
function onInstall(event) {
  event.waitUntil(caches.open(cacheName).then(cache => cache.addAll(defaultCacheList).catch(() => {})));
}
function onActivate(event) {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => !key.startsWith(cacheName)).map(key => caches.delete(key)))));
}
function onFetch(event) {
  if (navigator.onLine) return;
  event.respondWith(fetch(event.request).catch(err => {
    if (event.request.destination === 'document') {
      return caches.open(cacheName).then(cache => cache.match('index.html'));
    } else {
      console.log('service worker cache fetch error', event.request);
      throw err;
    }
  }));
}
self.addEventListener('install', onInstall);
self.addEventListener('fetch', onFetch);
self.addEventListener('activate', onActivate);
}());
