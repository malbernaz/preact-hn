import { h } from "preact";

import withStyles from "../../lib/withStyles";

import Header from "../Header";

import s from "./Root.scss";

export default withStyles(s)(({ children, currentRoute, notFound, routes }) =>
  <div class={s.root}>
    <Header currentRoute={currentRoute} routes={routes} notFound={notFound} />
    {children}
  </div>
);
