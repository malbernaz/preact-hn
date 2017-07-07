import { h } from "preact";
import qs from "query-string";

import { fetchItem } from "../../actions";

export default {
  path: "/thread/:id(\\d+)",
  async action({ redirect }, { id }) {
    const { default: Thread } = await import("./Thread" /* webpackChunkName: "thread" */);

    const item = await fetchItem(id);

    if (!item) {
      const query = qs.stringify({ message: `thread ${id} does not exist.` });
      return redirect(`/notfound?${query}`, 404);
    }

    return {
      title: item.title,
      component: <Thread item={item} />
    };
  }
};
