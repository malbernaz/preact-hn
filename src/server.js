/* eslint-disable no-console */

import "isomorphic-fetch";

import http from "http";
import { h } from "preact";
import { resolve } from "path";
import Router from "universal-router";
import compression from "compression";
import express from "express";
import render from "preact-render-to-string";
import serveFavicon from "serve-favicon";

import assets from "./assets";
import Html from "./components/Html";
import Provider from "./lib/ContextProvider";
import store from "./store";
import routes from "./routes";

const app = express();
const port = process.env.PORT || 3000;

app.use(compression({ threshold: 0 }));
app.use(express.static(resolve(__dirname, "public")));
app.use(serveFavicon(resolve(__dirname, "public", "favicon.ico")));

const chunks = Object.keys(assets).map(c => assets[c].js);

const router = new Router(routes);

function redirect(to, status) {
  const error = new Error(`Redirecting to "${to}"...`);
  error.status = status;
  error.path = to;
  throw error;
}

app.get("*", async (req, res, next) => {
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
      initialState: `__INITIAL_STATE__=${JSON.stringify(store.getState())}`,
      manifest: assets.manifest.js,
      script: assets.main.js,
      style: css.join(""),
      title: route.title,
      vendor: assets.vendor.js
    };

    res.send(`<!DOCTYPE html>${render(<Html {...data} />)}`);
  } catch (err) {
    if (err.status === 404) {
      res.status(err.status);
      res.redirect(err.path || "/");
      return;
    }
    next(err);
  }
});

http.createServer(app).listen(port, err => {
  console.log(err || `\n==> server running on port ${port}\n`);
});
