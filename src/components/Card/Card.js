import { h } from "preact";

import withStyles from "../../lib/withStyles";
import timeago from "../../lib/timeago";

import s from "./Card.scss";

export default withStyles(s)(props =>
  <div class={s.root}>
    <span class={s.numbers}>
      <span class={s.position}>{props.index}</span><span class={s.points}>{props.score}p</span>
    </span>
    <div class={s.info}>
      <div class={s.row}>
        <a class={s.title}>
          <h2>
            {props.title}
          </h2>
        </a>
      </div>
      <div class={s.row}>
        by <a>{props.by}</a> {timeago(props.time)} ago |{" "}
        <a>{props.kids ? props.descendants : "0"} comments</a>
      </div>
    </div>
  </div>
);
