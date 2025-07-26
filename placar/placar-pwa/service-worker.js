
const cacheName = 'placar-v1';
const assets = [
  './',
  './index.html',
  './placar.css',
  './responsivo-placar.css',
  './placar.js',
  './manifest.json',
  './icone.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(cacheName).then(cache => {
      return cache.addAll(assets);
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
