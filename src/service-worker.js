/* eslint-env worker */

importScripts("/assets.js");

const VERSION = self.staticAssets.hash;
const STATIC_ASSETS = self.staticAssets.assets;
const PAGES = ["/", "/new", "/show", "/ask", "/jobs", "/notfound"];

self.oninstall = event =>
  event.waitUntil(
    caches
      .open(`static-${VERSION}`)
      .then(cache => cache.addAll([...PAGES, ...STATIC_ASSETS]))
      .then(() => self.skipWaiting())
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

  // Webpack Hot Module Reloading
  if (_DEV_ && /(hot-update|sockjs-node)/.test(href)) {
    return event.respondWith(fetch(requestUrl));
  }

  // Local Requests
  if (location.origin === origin) {
    // Server Rendered Pages
    if (PAGES.some(s => s === pathname)) {
      return staleWhileRevalidate(event, `static-${VERSION}`);
    }

    // Static Assets
    if (STATIC_ASSETS.some(s => new RegExp(s).test(pathname))) {
      return event.respondWith(caches.match(requestUrl, { ignoreSearch: true }));
    }
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
