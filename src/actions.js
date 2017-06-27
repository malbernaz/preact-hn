import { fetchItems } from "./lib/HNService";
import store from "./store";

export async function fetchIds(type) {
  store.setState({ itemsFetched: false });
  const res = await fetch(`https://hacker-news.firebaseio.com/v0/${type}stories.json`);
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
