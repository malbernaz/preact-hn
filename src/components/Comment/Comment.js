/* eslint-disable react/jsx-key */
import { h, Component } from "preact";

import withStyles from "../../lib/withStyles";
import timeago from "../../lib/timeago";

import Link from "../Link";

import s from "./Comment.scss";

@withStyles(s)
class Comment extends Component {
  state = { repliesVisible: true };

  toggleReplies = () => {
    this.setState({ repliesVisible: !this.state.repliesVisible });
  };

  render({ item: i }, { repliesVisible }) {
    return (
      <div class={s.root}>
        <div class={s.content}>
          <div class={s.info}>
            by <Link to={`/user/${i.by}`}>{i.by}</Link>
            {` ${timeago(i.time)} ago`}
          </div>
          <div class={s.text} dangerouslySetInnerHTML={{ __html: i.text }} />
        </div>
        {i.kids && [
          <a
            onClick={this.toggleReplies}
            class={`${s.toggleReplies} ${!repliesVisible ? s.toggleRepliesCollapsed : ""}`}
          >
            {repliesVisible ? "[-]" : `[+] ${i.kids.length} replies collapsed`}
          </a>,
          <div class={s.comments} style={{ display: !repliesVisible ? "none" : "" }}>
            {i.kids.filter(c => c.text !== undefined).map(c => <Comment key={c.id} item={c} />)}
          </div>
        ]}
      </div>
    );
  }
}

export default Comment;
