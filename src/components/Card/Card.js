import { h } from "preact";

import withStyles from "../../lib/withStyles";
import timeago from "../../lib/timeago";

import s from "./Card.scss";

export default withStyles(s)(p =>
  <div class={s.root}>
    <span class={s.numbers}>
      <span class={s.position}>{p.index}</span><span class={s.points}>{p.score}p</span>
    </span>
    <div class={s.info}>
      <div class={s.row}>
        <a href={p.url} target="_blank" rel="noreferrer noopener" class={s.title}>
          <h2>
            {p.title}
          </h2>
        </a>
      </div>
      <div class={s.row}>
        by <a>{p.by}</a> {timeago(p.time)} ago |{" "}
        <a>{p.kids ? p.descendants : "0"} comments</a>
      </div>
    </div>
  </div>
);
