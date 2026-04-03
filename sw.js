const CACHE='workhours-v1.2.0';
const FILES=[
  './',
  './index.html',
  './manifest.json',
  './icons/icon-192-any.png',
  './icons/icon-192.png',
  './icons/icon-512-any.png',
  './icons/icon-512.png',
  './icons/apple-touch-icon.png',
  './icons/favicon-32.png',
  './icons/favicon-16.png'
];
self.addEventListener('install',e=>{
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)).catch(()=>{}));
  self.skipWaiting();
});
self.addEventListener('activate',e=>{
  e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener('fetch',e=>{
  const u=e.request.url;
  if(u.includes('firebase')||u.includes('googleapis')||u.includes('anthropic')||u.includes('gstatic')||u.includes('fonts.'))return;
  e.respondWith(
    fetch(e.request)
      .then(r=>{if(r&&r.status===200){const c=r.clone();caches.open(CACHE).then(ca=>ca.put(e.request,c))}return r})
      .catch(()=>caches.match(e.request))
  );
});
