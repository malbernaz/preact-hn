import io from "socket.io";

const socket = io(_DEV_ ? "http://localhost:3000" : location.origin);

export function fetchIdsByType(type) {
  return new Promise(resolve => {
    socket.emit("fetchIdsByType", type, ids => {
      resolve(ids);
    });
  });
}

export function fetchItem(id) {
  return new Promise(resolve => {
    socket.emit("fetchItem", id, item => {
      resolve(item);
    });
  });
}

export function fetchItems(id) {
  return new Promise(resolve => {
    socket.emit("fetchItems", id, items => {
      resolve(items);
    });
  });
}

export function fetchUser(username) {
  return new Promise(resolve => {
    socket.emit("fetchUser", username, user => {
      resolve(user);
    });
  });
}

export function watchList(type, cb) {
  socket.emit("watchList", type, ids => {
    cb(ids);
  });

  return () => {
    socket.emit("unwatchList");
  };
}
