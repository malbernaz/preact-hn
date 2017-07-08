/* eslint-disable no-console */

import Firebase from "firebase";
import LRU from "lru-cache";

Firebase.initializeApp({ databaseURL: "https://hacker-news.firebaseio.com" });

const api = Firebase.database().ref("/v0");

api.cachedItems = LRU({
  max: 1000,
  maxAge: 1000 * 60 * 15 // 15 min cache
});

api.cachedIds = {};
["top", "new", "show", "ask", "job"].forEach(type => {
  api.child(`${type}stories`).on("value", snapshot => {
    api.cachedIds[type] = snapshot.val();
  });
});

function warmCache() {
  fetchItems((api.cachedIds.top || []).slice(0, 30));
  setTimeout(warmCache, 1000 * 60 * 15);
}

warmCache();

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
          cache && cache.set(child, val);
          resolve(val);
        },
        reject
      );
    });
  }
}

export function fetchItem(id) {
  return fetchAPI(`item/${id}`);
}

export function fetchItems(ids) {
  return Promise.all(ids.map(id => fetchItem(id)));
}

export function fetchIdsByType(type) {
  return api.cachedIds && api.cachedIds[type]
    ? Promise.resolve(api.cachedIds[type])
    : fetchAPI(`${type}stories`);
}

export function fetchUser(username) {
  return fetchAPI(`user/${username}`);
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

export default function connectToDatabase(socket) {
  socket.on("fetchIdsByType", (type, fn) => {
    fetchIdsByType(type).then(ids => {
      fn(ids);
    });
  });

  socket.on("fetchItem", (id, fn) => {
    fetchItem(id).then(item => {
      fn(item);
    });
  });

  socket.on("fetchItems", (ids, fn) => {
    fetchItems(ids).then(items => {
      fn(items);
    });
  });

  socket.on("fetchUser", (username, fn) => {
    fetchUser(username).then(items => {
      fn(items);
    });
  });

  let unwatchList;
  socket.on("watchList", (type, fn) => {
    unwatchList = watchList(type, items => {
      fn(items);
    });
  });

  socket.on("unwatchList", () => {
    unwatchList();
  });
}
