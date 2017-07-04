import {
  BASE_URL,
  fetchItems,
  fetchItem as HNFetchItem,
  watchList as HNWatch
} from "./lib/HNService";
import store from "./store";

export async function fetchIds(type) {
  store.setState({ itemsFetched: false });
  const res = await fetch(`${BASE_URL}/${type}stories.json`);
  const ids = await res.json();
  store.setState({ currentStory: type, [type]: { ...store.getState()[type], ids } });
  return ids;
}

export function fetchStories(type, offset, itemsPerPage) {
  return async ids => {
    store.setState({ itemsFetched: false });
    try {
      const fetchedItems = await fetchItems(ids.slice(offset - itemsPerPage, offset));
      const { items } = store.getState();
      store.setState({
        itemsFetched: true,
        items: fetchedItems.filter(item => !!item).reduce(
          (state, item) => ({
            ...state,
            [item.id]: item
          }),
          items
        )
      });
    } catch (err) {
      console.error(err); // eslint-disable-line no-console
    }
  };
}

export async function fetchComments(ids) {
  const { items: storeItems } = store.getState();
  const fetchAndStore = async id => {
    const item = await HNFetchItem(id);
    store.setState({ items: { ...store.getState().items, [id]: item } });
    return item;
  };
  const items = await Promise.all(ids.map(async id => await (storeItems[id] || fetchAndStore(id))));

  for (let i in items) {
    const item = items[i];
    if (item && item.kids) {
      fetchComments(item.kids);
    }
  }
}

export function watchList(type, offset, itemsPerPage) {
  return HNWatch(type, fetchStories(type, offset, itemsPerPage));
}

export async function fetchItem(id) {
  const { items } = store.getState();
  let item;
  if (items[id]) {
    item = items[id];
  } else {
    const res = await fetch(`${BASE_URL}/item/${id}.json`);
    item = await res.json();
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
    const res = await fetch(`${BASE_URL}/user/${username}.json`);
    user = await res.json();
    store.setState({ users: { ...users, [username]: user } });
  }
  return user;
}
