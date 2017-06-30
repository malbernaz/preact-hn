import { fetchItems, watchList as HNWatch } from "./lib/HNService";
import store from "./store";

const BASE_URL = "https://hacker-news.firebaseio.com/v0/";

export async function fetchIds(type) {
  store.setState({ itemsFetched: false });
  const res = await fetch(`${BASE_URL}${type}stories.json`);
  const ids = await res.json();
  store.setState({ currentStory: type, [type]: { ...store.getState()[type], ids } });
  return ids;
}

export function fetchStories(type, page) {
  return async ids => {
    store.setState({ itemsFetched: false });
    const offset = page * 30;
    try {
      const items = await fetchItems(ids.slice(offset - 30, offset));
      store.setState({
        itemsFetched: true,
        [type]: { ...store.getState()[type], [page]: items.filter(i => i !== null) }
      });
    } catch (err) {
      console.error(err); // eslint-disable-line no-console
    }
  };
}

export async function fetchComments(ids) {
  const items = await fetchItems(ids);

  for (let i in items) {
    if (items[i].kids && items[i].kids.length) {
      const kids = await fetchComments(items[i].kids);
      items[i].kids = kids;
    }
  }

  return items;
}

export function watchList(type, page) {
  return HNWatch(type, fetchStories(type, page));
}

export async function fetchItem(id) {
  const res = await fetch(`${BASE_URL}/item/${id}.json`);
  const item = await res.json();
  return item;
}
