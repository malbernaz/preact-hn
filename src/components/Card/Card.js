import { h } from "preact";

import withStyles from "../../lib/withStyles";

import s from "./Card.scss";

export default withStyles(s)(() =>
  <div class={s.root}>
    <span class={s.numbers}>
      <span class={s.position}>1</span><span class={s.points}>77p</span>
    </span>
    <div class={s.info}>
      <div class={s.row}>
        <h2 class={s.title}>
          Trump administration has plan to scrap ‘startup visa’ rule
        </h2>
        {" "}
        <a>
          (sfchronicle.com)
        </a>
      </div>
      <div class={s.row}>
        by <a>sloreti</a> 4 hours ago | <a>45 comments</a>
      </div>
    </div>
  </div>
);
