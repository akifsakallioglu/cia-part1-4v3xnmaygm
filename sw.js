// Bu dosya tools/build-web.mjs tarafından üretilir. Sürüm: 1.2.0-bad1db0651
const CACHE = 'yavruma-cia-1.2.0-bad1db0651';
const FILES = [
  "./",
  "./css/app.css",
  "./css/fonts.css",
  "./data/icerik.json",
  "./fonts/dancing-script-latin-700-normal.woff2",
  "./fonts/dancing-script-latin-ext-700-normal.woff2",
  "./fonts/nunito-latin-400-normal.woff2",
  "./fonts/nunito-latin-600-normal.woff2",
  "./fonts/nunito-latin-700-normal.woff2",
  "./fonts/nunito-latin-800-normal.woff2",
  "./fonts/nunito-latin-ext-400-normal.woff2",
  "./fonts/nunito-latin-ext-600-normal.woff2",
  "./fonts/nunito-latin-ext-700-normal.woff2",
  "./fonts/nunito-latin-ext-800-normal.woff2",
  "./img/apple-touch-icon.png",
  "./img/icon-192.png",
  "./img/icon-512.png",
  "./index.html",
  "./js/app.js",
  "./manifest.webmanifest"
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE)
      .then((cache) => cache.addAll(FILES.map((f) => new Request(f, { cache: 'reload' }))))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k.startsWith('yavruma-cia-') && k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

// Önce önbellek: uygulama internet olmadan da açılır. Yeni sürüm yayınlanınca internet varken
// arka planda indirilir ve uygulama bir sonraki açılışta yeni sürümle başlar.
self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;
  event.respondWith(
    caches.open(CACHE).then(async (cache) => {
      const hit = await cache.match(req, { ignoreSearch: true });
      if (hit) return hit;
      if (req.mode === 'navigate') {
        const shell = await cache.match('./index.html');
        if (shell) return shell;
      }
      return fetch(req);
    }),
  );
});
