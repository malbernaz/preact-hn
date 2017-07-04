import { h } from "preact";

import { fetchUser } from "../../actions";

export default {
  path: "/user/:username",
  async action(ctx, { username }) {
    const { default: User } = await import("./User" /* webpackChunkName: "user" */);

    const user = await fetchUser(username);

    return {
      title: "user",
      component: <User user={user} />
    };
  }
};
