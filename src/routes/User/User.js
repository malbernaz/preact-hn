import { h } from "preact";

import withStyles from "../../lib/withStyles";
import { timeago } from "../../lib/util";

import Wrapper from "../../components/Wrapper";
import Link from "../../components/Link";

import s from "./User.scss";

export default withStyles(s)(({ user: u }) =>
  <Wrapper>
    <div class={s.root}>
      <div class={s.header}>
        <h1>
          User: {u.id}
        </h1>
        <div class={s.info}>
          Created: {`${timeago(u.created)} ago`}
          <br />
          Karma: {u.karma}
        </div>
        <div class={s.about} dangerouslySetInnerHTML={{ __html: u.about }} />
        <div class={s.links}>
          <Link to={`https://news.ycombinator.com/submitted?id=${u.id}`} blank>
            submitted
          </Link>
          {" | "}
          <Link to={`https://news.ycombinator.com/threads?id=${u.id}`} blank>
            comments
          </Link>
        </div>
      </div>
    </div>
  </Wrapper>
);
