import "../styles/main.scss";

import TransitionGroup from "preact-transition-group";
import Router from "universal-router";

import animated from "../lib/animated";

import Root from "../components/Root";
import storyRoutes from "./createStoryTypes";
import About from "./About";
import Thread from "./Thread";
import User from "./User";
import NotFound from "./NotFound";

export default {
  path: "/",

  async action({ next, preMiddleware, postMiddleware, url, route: { children } }) {
    if (preMiddleware) preMiddleware();

    const route = await next();

    const hooks = [];
    if (postMiddleware) {
      hooks.push(() => postMiddleware(route));
    }

    const routes = children
      .filter(c => !!c.title)
      .reduce((acc, c) => ({ ...acc, [c.title]: Router.pathToRegexp(c.path, "i") }), {});

    const AnimatedRoute = animated(() => route.component);

    const component = (
      <Root page={route.page} type={route.type} routes={routes} currentRoute={url}>
        <TransitionGroup component="div" class="route-transition-container">
          <AnimatedRoute timeout={600} hooks={hooks} key={url} />
        </TransitionGroup>
      </Root>
    );

    return { ...route, component };
  },

  children: [...storyRoutes, About, Thread, User, NotFound]
};
