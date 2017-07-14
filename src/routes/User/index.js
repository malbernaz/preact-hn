import qs from "query-string";

import { fetchUser } from "../../actions";

import User from "./User";

export default {
  path: "/user/:username",
  async action({ redirect }, { username }) {
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
