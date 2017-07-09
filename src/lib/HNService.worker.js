// eslint-env worker

import io from "socket.io";

import registerPromiseWorker from "promise-worker/register";

const socket = io(_DEV_ ? "http://localhost:3000" : location.origin);

const actions = {
  fetchIdsByType(type) {
    return new Promise(resolve => {
      socket.emit("fetchIdsByType", type, ids => {
        resolve(ids);
      });
    });
  },
  fetchItem(id) {
    return new Promise(resolve => {
      socket.emit("fetchItem", id, item => {
        resolve(item);
      });
    });
  },
  fetchItems(id) {
    return new Promise(resolve => {
      socket.emit("fetchItems", id, items => {
        resolve(items);
      });
    });
  },
  fetchUser(username) {
    return new Promise(resolve => {
      socket.emit("fetchUser", username, user => {
        resolve(user);
      });
    });
  },
  watchList(type) {
    socket.emit("watchList", type);
    return () => {
      socket.emit("unwatchList");
    };
  }
};

self.onmessage = ({ data: { action, payload } }) => {
  if (action) {
    socket.emit(action, payload);
  }
};

socket.on("watchList", ids => {
  self.postMessage({ action: "watchList", payload: ids });
});

registerPromiseWorker(({ action, payload }) => {
  return actions[action](payload);
});
