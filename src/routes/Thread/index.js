import { h } from "preact";

import { fetchItem } from "../../actions";

export default {
  path: "/thread/:id(\\d+)",
  async action(ctx, { id }) {
    const { default: Thread } = await import("./Thread" /* webpackChunkName: "thread" */);

    const item = await fetchItem(id);

    return {
      title: "THREAD",
      component: <Thread item={item} />
    };
  }
};
