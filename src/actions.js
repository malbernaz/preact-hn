import * as hn from "HNService";

import store from "./store";
import { itemsPerPage } from "./config";

export async function fetchIds(type) {
  store.setState({ itemsFetched: false });
  const ids = await hn.fetchIdsByType(type);
  store.setState({ currentStory: type, [type]: { ...store.getState()[type], ids } });
  return ids;
}

export function fetchStories(type, offset) {
  return async ids => {
    store.setState({ itemsFetched: false });
    try {
      const fetchedItems = await hn.fetchItems(ids.slice(offset - itemsPerPage, offset));
      const { items } = store.getState();
      store.setState({
        itemsFetched: true,
        items: fetchedItems
          .filter(item => !!item)
          .reduce((state, item) => ({ ...state, [item.id]: item }), items)
      });
    } catch (err) {
      console.error(err); // eslint-disable-line no-console
    }
  };
}

export async function fetchComments(ids) {
  const { items: storeItems } = store.getState();
  const fetchAndStore = async id => {
    const item = await hn.fetchItem(id);
    store.setState({ items: { ...store.getState().items, [id]: item } });
    return item;
  };
  const items = await Promise.all(ids.map(async id => storeItems[id] || (await fetchAndStore(id))));

  for (let i in items) {
    const item = items[i];
    if (item && item.kids) {
      fetchComments(item.kids);
    }
  }
}

export function watchList(type, offset) {
  return hn.watchList(type, fetchStories(type, offset));
}

export async function fetchItem(id) {
  const { items } = store.getState();
  let item;
  if (items[id]) {
    item = items[id];
  } else {
    item = await hn.fetchItem(id);
    store.setState({ items: { ...items, [id]: item } });
  }
  return item;
}

export async function fetchUser(username) {
  const { users } = store.getState();
  let user;
  if (users[username]) {
    user = users[username];
  } else {
    user = await hn.fetchUser(username);
    store.setState({ users: { ...users, [username]: user } });
  }
  return user;
}
