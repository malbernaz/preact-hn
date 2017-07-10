import PromiseWorker from "promise-worker";
import HNServiceWorker from "./HNService.worker";

const worker = new HNServiceWorker();
const promiseWorker = new PromiseWorker(worker);

export function fetchIdsByType(type) {
  return promiseWorker.postMessage({ action: "fetchIdsByType", payload: type });
}

export function fetchItem(id) {
  return promiseWorker.postMessage({ action: "fetchItem", payload: id });
}

export function fetchItems(ids) {
  return promiseWorker.postMessage({ action: "fetchItems", payload: ids });
}

export function fetchUser(username) {
  return promiseWorker.postMessage({ action: "fetchUser", payload: username });
}

let watchListCallback;
worker.onmessage = ({ data: { action, payload } }) => {
  if (action) {
    watchListCallback(payload);
  }
};

export function watchList(type, cb) {
  watchListCallback = cb;
  worker.postMessage({ action: "watchList", payload: type });
  return () => {
    worker.postMessage({ action: "unwatchList" });
  };
}
