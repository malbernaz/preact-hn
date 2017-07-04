import { h } from "preact";
import qs from "query-string";

import { fetchUser } from "../../actions";

export default {
  path: "/user/:username",
  async action({ redirect }, { username }) {
    const { default: User } = await import("./User" /* webpackChunkName: "user" */);

    const user = await fetchUser(username);

    if (!user) {
      const query = qs.stringify({ message: `user ${username} does not exist.` });
      return redirect(`/notfound?${query}`, 404);
    }

    return {
      title: "user",
      component: <User user={user} />
    };
  }
};
