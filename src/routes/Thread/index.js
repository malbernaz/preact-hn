import { h } from "preact";

import { fetchItem } from "../../actions";

export default {
  path: "/thread/:id(\\d+)",
  async action({ url }, { id }) {
    const { default: Thread } = await import("./Thread" /* webpackChunkName: "thread" */);
    const {
      default: NotFound
    } = await import("../NotFound/NotFound" /* webpackChunkName: "notfound" */);

    const item = await fetchItem(id);

    return {
      title: item ? item.title : "not found",
      component: item ? <Thread item={item} /> : <NotFound url={url} />
    };
  }
};
