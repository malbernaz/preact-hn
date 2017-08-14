/* eslint-disable no-console */

import "isomorphic-fetch";

import http from "http";
import { resolve } from "path";
import Router from "universal-router";
import compression from "compression";
import express from "express";
import render from "preact-render-to-string";
import serveFavicon from "serve-favicon";
import LRU from "lru-cache";

import assets from "./assets";
import Html from "./components/Html";
import Provider from "./lib/ContextProvider";
import store from "./store";
import routes from "./routes";

const app = express();
const server = http.createServer(app);

app.use(compression({ threshold: 0 }));
app.use(serveFavicon(resolve(__dirname, "public", "favicon.ico")));
app.use(
  express.static(resolve(__dirname, "public"), {
    setHeaders(res) {
      res.setHeader("Cache-Control", "public,max-age=31536000,immutable");
    }
  })
);

const chunks = Object.keys(assets)
  .filter(Boolean)
  .filter(c => !(/service/i.test(c) || /fetch/.test(c) || /thread/.test(c)))
  .map(c => assets[c].js);

const router = new Router(routes);

function redirect(to, status) {
  const error = new Error(`Redirecting to "${to}"...`);
  error.status = status;
  error.path = to;
  throw error;
}

const cache = LRU({ max: 100, maxAge: 1000 });

app.get("*", async (req, res, next) => {
  if (cache.get(req.url)) {
    const html = cache
      .get(req.url)
      .replace("__INITIAL_STATE__", `__INITIAL_STATE__=${JSON.stringify(store.getState())}`);

    return res.end(`<!DOCTYPE html>${html}`);
  }

  try {
    const css = [];

    const context = { insertCss: (...s) => s.forEach(style => css.push(style._getCss())), store };

    const { search } = req._parsedOriginalUrl;

    const route = await router.resolve({ path: req.path, store, redirect, search });

    const component = render(
      <Provider context={context}>
        {route.component}
      </Provider>
    );

    const data = {
      chunks,
      component,
      manifest: assets.manifest.js,
      script: assets.main.js,
      style: css.join(""),
      title: route.title,
      vendor: assets.vendor.js
    };

    const html = render(<Html {...data} />).replace(
      "__INITIAL_STATE__",
      `__INITIAL_STATE__=${JSON.stringify(store.getState())}`
    );

    cache.set(req.url, html);

    res.end(`<!DOCTYPE html>${html}`);
  } catch (err) {
    if (err.status === 404) {
      res.status(err.status);
      res.redirect(err.path || "/");
      return;
    }
    next(err);
  }
});

const port = process.env.PORT || 3000;

server.listen(port, err => {
  console.log(err || `\n==> server running on port ${port}\n`);
});
