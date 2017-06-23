import { h } from "preact";

export default {
  path: "/thread",
  async action() {
    const { default: Thread } = await import("./Thread" /* webpackChunkName: "thread" */);

    return {
      title: "THREAD",
      component: <Thread />
    };
  }
};
