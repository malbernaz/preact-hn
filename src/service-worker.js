/* eslint-env worker */

importScripts("/assets.js");

const { hash: VERSION, assets: STATIC_ASSETS } = self.staticAssets;
const PAGES = [
  { test: /^(?:\/((?:\d+)))?(?:\/(?=$))?$/i, url: "/" },
  { test: /^\/new(?:\/((?:\d+)))?(?:\/(?=$))?$/i, url: "/new/" },
  { test: /^\/show(?:\/((?:\d+)))?(?:\/(?=$))?$/i, url: "/show/" },
  { test: /^\/ask(?:\/((?:\d+)))?(?:\/(?=$))?$/i, url: "/ask/" },
  { test: /^\/job(?:\/((?:\d+)))?(?:\/(?=$))?$/i, url: "/job/" },
  { test: /^\/about\/?$/i, url: "/about/" },
  { test: /^\/thread\/(?:(\d+))\/?$/i },
  { test: /^\/user\/(?:([^\/]+?))\/?$/i }
];

const pagesToCacheOnInstall = PAGES.filter(p => !!p.url).map(p => p.url);

self.oninstall = event =>
  event.waitUntil(
    Promise.all([
      caches.open(`static-${VERSION}`).then(cache => cache.addAll(STATIC_ASSETS)),
      caches.open(`pages-${VERSION}`).then(cache => cache.addAll(pagesToCacheOnInstall))
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

  // Webpack Hot Module Reloading
  if (_DEV_ && /(hot-update|sockjs-node)/.test(href)) {
    return event.respondWith(fetch(requestUrl));
  }

  // Local Requests
  if (location.origin === origin) {
    // Server Rendered Pages
    if (PAGES.some(p => p.test.test(pathname))) {
      return staleWhileRevalidate(event, `pages-${VERSION}`);
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
