import { h } from "preact";

import Root from "../components/Root";
import createRoutes from "./createRoutes";
import About from "./About";
import NotFound from "./NotFound";
import Router from "universal-router";

export default {
  path: "/",

  async action({ next, preMiddleware, postMiddleware, url, route: { children } }) {
    if (preMiddleware) preMiddleware();

    const route = await next();

    if (postMiddleware) postMiddleware(route);

    const routes = children
      .filter(c => !!c.title)
      .reduce((acc, c) => ({ ...acc, [c.title]: Router.pathToRegexp(c.path, "i") }), {});

    const component = (
      <Root
        page={route.page}
        routes={routes}
        currentRoute={url}
        notFound={route.title === "NOT FOUND"}
      >
        {route.component}
      </Root>
    );

    return { ...route, component };
  },

  children: [...createRoutes, About, NotFound]
};
