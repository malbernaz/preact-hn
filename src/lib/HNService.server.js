import { memoize } from "decko";

const BASE_URL = "https://hacker-news.firebaseio.com/v0/";

const cache = {};

export function fetchIdsByType(type) {
  return memoize({ cache: cache[type] })(async () => {
    const res = await fetch(`${BASE_URL}${type}stories.json`);
    const ids = await res.json();
    return ids;
  });
}
