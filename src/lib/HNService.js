/* eslint-disable no-console */

import Firebase from "firebase/app";

import "firebase/database";

const URL = "https://hacker-news.firebaseio.com";
const VERSION = "/v0";

Firebase.initializeApp({ databaseURL: URL });

const api = Firebase.database().ref(VERSION);

function fetchAPI(child) {
  const cache = api.cachedItems;
  if (cache && cache.has(child)) {
    return Promise.resolve(cache.get(child));
  } else {
    return new Promise((resolve, reject) => {
      api.child(child).once(
        "value",
        snapshot => {
          const val = snapshot.val();
          if (val) val.__lastUpdated = Date.now();
          cache && cache.set(child, val);
          resolve(val);
        },
        reject
      );
    });
  }
}

export const BASE_URL = URL + VERSION;

export function fetchIdsByType(type) {
  return api.cachedIds && api.cachedIds[type]
    ? Promise.resolve(api.cachedIds[type])
    : fetchAPI(`${type}stories`);
}

export function fetchItem(id) {
  return fetchAPI(`item/${id}`);
}

export function fetchItems(ids) {
  return Promise.all(ids.map(id => fetchItem(id)));
}

export function watchList(type, cb) {
  let first = true;
  const ref = api.child(`${type}stories`);
  const handler = snapshot => {
    if (first) {
      first = false;
    } else {
      cb(snapshot.val());
    }
  };
  ref.on("value", handler);
  return () => {
    ref.off("value", handler);
  };
}
