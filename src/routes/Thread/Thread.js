import { h } from "preact";

import withStyles from "../../lib/withStyles";
import timeago from "../../lib/timeago";

import Wrapper from "../../components/Wrapper";

import s from "./Thread.scss";

export default withStyles(s)(({ item }) =>
  <Wrapper>
    <div class={s.root}>
      <div class={s.header}>
        <h1>
          {item.title}
        </h1>
        <div class={s.info}>
          {item.score} points | by {item.by} {timeago(item.time)} ago
        </div>
        {item.text &&
          <p class={s.text}>
            {item.text}
          </p>}
      </div>
    </div>
  </Wrapper>
);
