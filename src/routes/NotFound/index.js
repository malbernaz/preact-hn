import { h } from "preact";

export default {
  path: "*",
  async action() {
    const { default: NotFound } = await import("./NotFound" /* webpackChunkName: "notfound" */);

    return {
      title: "NOT FOUND",
      component: <NotFound />
    };
  }
};
