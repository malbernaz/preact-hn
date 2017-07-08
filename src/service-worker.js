/* eslint-env worker */

importScripts("/assets.js");

const { hash: VERSION, assets: STATIC_ASSETS } = self.staticAssets;
const PAGES = ["/", "/new/", "/show/", "/ask/", "/job/", "/about/"];

self.oninstall = event =>
  event.waitUntil(
    Promise.all([
      caches.open(`static-${VERSION}`).then(cache => cache.addAll(STATIC_ASSETS)),
      caches.open(`pages-${VERSION}`).then(cache => cache.addAll(PAGES))
    ]).then(() => self.skipWaiting())
  );

self.onactivate = event =>
  event.waitUntil(
    caches
      .keys()
      .then(cacheNames =>
        Promise.all(
          cacheNames
            .filter(cache => !new RegExp(VERSION).test(cache))
            .map(cache => caches.delete(cache))
        )
      )
      .then(() => self.clients.claim())
  );

self.onfetch = event => {
  const requestUrl = new URL(event.request.url);

  const { pathname, href, origin } = requestUrl;

  // Webpack Hot Module Replacement
  if (_DEV_) {
    if (/(hot-update|sockjs-node)/.test(href)) {
      return;
    }
  }

  // Prevent service worker from requesting socket connection
  if (/socket\.io/.test(href)) {
    return;
  }

  // Local Requests
  if (location.origin === origin) {
    // Static Assets
    if (STATIC_ASSETS.some(s => new RegExp(s).test(pathname))) {
      return event.respondWith(caches.match(requestUrl, { ignoreSearch: true }));
    }

    // Server Rendered Pages
    return staleWhileRevalidate(event, `pages-${VERSION}`);
  }

  // Dynamic Requests
  return staleWhileRevalidate(event, `dynamic-${VERSION}`);
};

function staleWhileRevalidate(event, cacheName) {
  const requestUrl = new URL(event.request.url);
  const fetchedVersion = fetch(requestUrl);
  const fetchedCopy = fetchedVersion.then(res => res.clone());
  const cachedVersion = caches.match(requestUrl);

  event.respondWith(
    Promise.race([fetchedVersion.catch(() => cachedVersion), cachedVersion])
      .then(response => response || fetchedVersion)
      .catch(() => new Response(null, { status: 404 }))
  );

  let response;
  return event.waitUntil(
    fetchedCopy
      .then(res => {
        response = res;
        return caches.open(cacheName);
      })
      .then(cache => cache.put(requestUrl, response))
  );
}
