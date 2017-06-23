import { h } from "preact";

import Root from "../components/Root";
import createRoutes from "./createRoutes";
import About from "./About";
import NotFound from "./NotFound";

export default {
  path: "/",

  async action({ next, preMiddleware, postMiddleware, url }) {
    if (preMiddleware) preMiddleware();

    const route = await next();

    if (postMiddleware) postMiddleware(route);

    const component = (
      <Root currentRoute={url} notFound={route.title === "NOT FOUND"}>
        {route.component}
      </Root>
    );

    return { ...route, component };
  },

  children: [...createRoutes, About, NotFound]
};
