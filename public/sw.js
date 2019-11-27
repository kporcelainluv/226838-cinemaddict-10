self.addEventListener(`install`, evt => {
  const openCache = caches.open(`STATIC_V1.0`).then(cache => {
    return cache.addAll([`/`, `/index.html`, `/bundle.js`]);
  });
  evt.waitUntil(openCache);
});
self.addEventListener(`activate`, () => {
  console.log(`sw activated`);
});
