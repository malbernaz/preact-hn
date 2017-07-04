import { h } from "preact";
import qs from "query-string";

export default {
  path: "*",
  async action({ url, search }) {
    const { default: NotFound } = await import("./NotFound" /* webpackChunkName: "notfound" */);

    let message = "";
    if (search) ({ message } = qs.parse(search));

    return {
      title: "NOT FOUND",
      component: <NotFound url={url} message={message} />
    };
  }
};
