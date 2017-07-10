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

export function fetchItem(id) {
  return fetchAPI(`item/${id}`);
}

export function fetchItems(ids) {
  return Promise.all(ids.map(id => fetchItem(id)));
}

export function fetchIdsByType(type) {
  return fetchAPI(`${type}stories`);
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
