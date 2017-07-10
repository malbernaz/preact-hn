import { h } from "preact";
import qs from "query-string";
import NotFound from "./NotFound";

export default {
  path: "*",
  action({ url, search }) {
    let message = "";
    if (search) ({ message } = qs.parse(search));

    return {
      title: "NOT FOUND",
      component: <NotFound url={url} message={message} />
    };
  }
};
