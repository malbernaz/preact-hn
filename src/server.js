/* eslint-disable no-console */

import "isomorphic-fetch";

import http from "http";
import spdy from "spdy";

import { h } from "preact";
import { resolve } from "path";
import fs from "fs";
import { promisify } from "util";
import Router from "universal-router"; // eslint-disable-line import/extensions
import compression from "compression";
import express from "express";
import render from "preact-render-to-string";
import serveFavicon from "serve-favicon";

import assets from "./assets"; // eslint-disable-line import/extensions
import Html from "./components/Html";
import Provider from "./lib/ContextProvider";
import store from "./store";
import routes from "./routes";

const app = express();
const port = 3000;

app.use(compression({ threshold: 0 }));
app.use(express.static(resolve(__dirname, "public")));
app.use(serveFavicon(resolve(__dirname, "public", "favicon.ico")));

const chunks = Object.keys(assets).map(c => assets[c].js);

const router = new Router(routes);

const readFile = promisify(fs.readFile);

app.get("*", async (req, res, next) => {
  try {
    if (!_DEV_) {
      if (!req.secure) {
        res.status(301);
        res.redirect(`https://${req.hostname}${req.url}`);
      }

      if (req.push) {
        const files = await Promise.all(chunks.map(c => readFile(resolve(__dirname, "public", c))));

        chunks.forEach((c, i) => {
          const stream = res.push(`/${c}`, {
            req: { accept: "**/*" },
            res: { "content-type": "application/javascript" }
          });

          stream.on("error", console.error);

          stream.end(files[i]);
        });
      }
    }

    const css = [];

    const context = { insertCss: (...s) => s.forEach(style => css.push(style._getCss())), store };

    const route = await router.resolve({ path: req.path, store });

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
  } catch (e) {
    next(e);
  }
});

if (!_DEV_) {
  const options = {
    cert: fs.readFileSync(resolve(__dirname, "..", "certs", "server.crt")),
    key: fs.readFileSync(resolve(__dirname, "..", "certs", "server.key"))
  };

  spdy
    .createServer(options, app)
    .listen(port, err => console.log(err || `\n==> server running on port ${port}\n`));
}

http
  .createServer(app)
  .listen(port, err => console.log(err || `\n==> server running on port ${port}\n`));
