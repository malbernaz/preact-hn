import { h } from "preact";

import withStyles from "../../lib/withStyles";
import timeago from "../../lib/timeago";

import Link from "../Link.js";

import s from "./Card.scss";

export default withStyles(s)(p =>
  <div class={s.root}>
    <span class={s.numbers}>
      <span class={s.position}>
        {p.index}
      </span>
      <span class={s.points}>
        {p.score}p
      </span>
    </span>
    <div class={s.info}>
      <div class={s.row}>
        <Link to={p.url || `/thread/${p.id}`} blank={!!p.url} class={s.title}>
          <h2>
            {p.title}
          </h2>
        </Link>
      </div>
      {p.type !== "job"
        ? <div class={s.row}>
            by <Link to={`/user/${p.by}`}>{p.by}</Link> {timeago(p.time)} ago |{" "}
            <Link to={`/thread/${p.id}`}>{p.kids ? p.descendants : "0"} comments</Link>
          </div>
        : <div class={s.row}>
            {timeago(p.time)} ago
          </div>}
    </div>
  </div>
);
