import { render, options } from "preact";
import Router from "universal-router";

import { updateTitle } from "./lib/updateTag";
import history from "./lib/history";
import Provider from "./lib/ContextProvider";
import UseScroll from "./lib/useScroll";
import registerServiceWorker from "./sw-register";
import store from "./store";
import routes from "./routes";

let CURRENT_LOCATION = history.location;
let FIRST_RENDER = true;

options.debounceRendering = requestAnimationFrame;

const scroll = new UseScroll(CURRENT_LOCATION);

const routerMiddleware = {
  preMiddleware() {
    return scroll.storeScroll(history);
  },
  postMiddleware({ title }) {
    updateTitle(title);
    scroll.restoreScroll(history.location);
  }
};

function insertCss(...styles) {
  const removeCss = styles.map(x => x._insertCss());

  return () => removeCss.forEach(f => f());
}

function redirect(to) {
  history.replace(to);
}

const context = { insertCss, store };

const mnt = document.querySelector("main");

const router = new Router(routes);

async function bootstrap(location, router) {
  if (FIRST_RENDER) {
    if (!_DEV_) await registerServiceWorker();

    if (!self.fetch) {
      await import("unfetch" /* webpackChunkName: "fetch-polyfill" */);
    }
  }

  CURRENT_LOCATION = location;

  const { pathname: path, search } = location;

  const route = await router.resolve({ path, store, redirect, search, ...routerMiddleware });

  const component = (
    <Provider context={context}>
      {route.component}
    </Provider>
  );

  render(component, mnt, mnt.lastElementChild);

  if (FIRST_RENDER) {
    const node = document.getElementById("css");

    if (node) node.parentNode.removeChild(node);

    FIRST_RENDER = false;
  }
}

history.listen(location => bootstrap(location, router));

bootstrap(CURRENT_LOCATION, router);

if (module.hot) {
  module.hot.accept("./routes", () => {
    const nextRoutes = require("./routes").default;
    const nextRouter = new Router(nextRoutes);

    bootstrap(CURRENT_LOCATION, nextRouter);
  });
}
