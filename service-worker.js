// Aware offline helper. Online: always loads the newest version. Offline: opens the saved copy.
// Change the version below whenever you replace index.html.
const CACHE = 'vr-aware-v4';
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(['./', './index.html', './manifest.json', './icon-192.png', './icon-512.png', './apple-touch-icon.png'])).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => (k.startsWith('vr-aware-') || k.startsWith('aware-')) && k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  const timeout = new Promise((_, rej) => setTimeout(rej, 3000));
  e.respondWith(
    Promise.race([fetch(e.request), timeout]).then(r => {
      const copy = r.clone();
      caches.open(CACHE).then(c => c.put(e.request, copy));
      return r;
    }).catch(() => caches.match(e.request, {ignoreSearch: true}).then(hit => hit || caches.match('./index.html')))
  );
});
