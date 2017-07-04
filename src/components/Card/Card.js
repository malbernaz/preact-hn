import { h } from "preact";

import withStyles from "../../lib/withStyles";
import { timeago, pluralize } from "../../lib/util";

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
      <div class={s.row}>
        {p.type !== "job"
          ? <div class={s.info}>
              by <Link to={`/user/${p.by}`}>{p.by}</Link> {timeago(p.time)} ago |{" "}
              <Link to={`/thread/${p.id}`}>
                {pluralize(p.kids ? p.descendants : 0, " comment")}
              </Link>
            </div>
          : <div class={s.info}>
              {timeago(p.time)} ago
            </div>}
      </div>
    </div>
  </div>
);
