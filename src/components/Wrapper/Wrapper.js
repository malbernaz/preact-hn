import { h } from "preact";

import withStyles from "../../lib/withStyles";

import s from "./Wrapper.scss";

export default withStyles(s)(({ children }) =>
  <div class={s.root}>
    {children}
  </div>
);
