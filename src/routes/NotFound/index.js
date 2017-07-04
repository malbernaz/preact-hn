import { h } from "preact";

export default {
  path: "*",
  async action({ url }) {
    const { default: NotFound } = await import("./NotFound" /* webpackChunkName: "notfound" */);

    return {
      title: "NOT FOUND",
      component: <NotFound url={url} />
    };
  }
};
