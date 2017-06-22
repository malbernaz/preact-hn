import { h, render } from "preact";
import Router from "universal-router";

import { updateTitle } from "./lib/updateTag";
import history from "./lib/history";
import Provider from "./lib/ContextProvider";
import registerServiceWorker from "./sw-register";
import UseScroll from "./lib/middleware/useScroll";

let CURRENT_LOCATION = history.location;
let FIRST_RENDER = true;

const scroll = new UseScroll(CURRENT_LOCATION);

const routerMiddleware = {
  preMiddleware() {
    scroll.storeScroll(history);
  },
  postMiddleware({ title }) {
    scroll.restoreScroll(history.location);

    updateTitle(title);
  }
};

const context = {
  insertCss(...styles) {
    const removeCss = styles.map(x => x._insertCss());

    return () => removeCss.forEach(f => f());
  }
};

const mnt = document.querySelector("main");

async function bootstrap(location) {
  if (FIRST_RENDER) {
    if (process.env.NODE_ENV === "production") {
      await registerServiceWorker();
    }

    if (!self.fetch) {
      await import("isomorphic-fetch" /* webpackChunkName: "fetch-polyfill" */);
    }
  }

  CURRENT_LOCATION = location;

  const routes = require("./routes").default;

  const router = new Router(routes);

  const { pathname } = location;

  const route = await router.resolve({ path: pathname, ...routerMiddleware });

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

history.listen(bootstrap);

bootstrap(CURRENT_LOCATION);

if (module.hot) module.hot.accept("./routes", () => bootstrap(CURRENT_LOCATION));
