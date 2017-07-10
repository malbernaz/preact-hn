import register from "promise-worker/register";

import Firebase from "firebase/app";
import "firebase/database";

Firebase.initializeApp({ databaseURL: "https://hacker-news.firebaseio.com" });

const api = Firebase.database().ref("/v0");

function fetchAPI(child) {
  return new Promise((resolve, reject) => {
    api.child(child).once(
      "value",
      snapshot => {
        const val = snapshot.val();
        resolve(val);
      },
      reject
    );
  });
}

const actions = {
  fetchItem(id) {
    return fetchAPI(`item/${id}`);
  },
  fetchItems(ids) {
    return Promise.all(ids.map(id => actions.fetchItem(id)));
  },
  fetchIdsByType(type) {
    return fetchAPI(`${type}stories`);
  },
  fetchUser(username) {
    return fetchAPI(`user/${username}`);
  }
};

function watchList(type, cb) {
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

let unwatchList;
self.onmessage = ({ data: { action, payload } }) => {
  if (!action) return;
  if (action === "watchList") {
    unwatchList = watchList(payload, ids => {
      self.postMessage({ action: "watchList", payload: ids });
    });
  }
  if (action === "unwatchList") {
    unwatchList();
  }
};

register(({ action, payload }) => {
  return actions[action](payload);
});
