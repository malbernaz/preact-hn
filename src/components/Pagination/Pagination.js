import { h } from "preact";

import withStyles from "../../lib/withStyles";

import Link from "../Link";

import s from "./Pagination.scss";

export default withStyles(s)(() =>
  <nav class={s.root}>
    <Link>‹ prev</Link>
    <span class={s.count}>1/25</span>
    <Link>next ›</Link>
  </nav>
);
