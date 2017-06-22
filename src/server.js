import { createServer } from "http";
import { h } from "preact";
import { resolve } from "path";
import Router from "universal-router"; // eslint-disable-line import/extensions
import compression from "compression";
import express from "express";
import render from "preact-render-to-string";
import serveFavicon from "serve-favicon";

import assets from "./assets"; // eslint-disable-line import/extensions
import Html from "./components/Html";
import Provider from "./lib/ContextProvider";
import routes from "./routes";

const app = express();
const port = 3000;

app.use(compression({ threshold: 0 }));
app.use(express.static(resolve(__dirname, "public")));
app.use(serveFavicon(resolve(__dirname, "public", "favicon.ico")));

const chunks = Object.keys(assets)
  .filter(c => !!assets[c].js && !/(main|commons)/.test(c))
  .map(c => assets[c].js);

const router = new Router(routes);

app.get("*", async (req, res, next) => {
  try {
    const css = [];

    const context = { insertCss: (...s) => s.forEach(style => css.push(style._getCss())) };

    const route = await router.resolve({ path: req.path });

    const component = render(
      <Provider context={context}>
        {route.component}
      </Provider>
    );

    const data = {
      chunks,
      commonjs: assets.commons.js,
      component,
      script: assets.main.js,
      style: css.join(""),
      title: route.title
    };

    res.send(`<!DOCTYPE html>${render(<Html {...data} />)}`);
  } catch (e) {
    next(e);
  }
});

createServer(app).listen(port, err =>
  // eslint-disable-next-line no-console
  console.log(err || `\n==> server running on port ${port}\n`)
);
