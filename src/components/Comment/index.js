/* eslint-disable react/jsx-key */

import { h, Component } from "preact";

import withStyles from "../../lib/withStyles";
import { timeago, pluralize } from "../../lib/util";
import { connect } from "../../lib/unistore";

import Link from "../Link";

import s from "./Comment.scss";

class Comment extends Component {
  state = { repliesVisible: false };

  componentDidMount() {
    const { item } = this.props;
    if (item && item.text) this.hijackLinks();
  }

  componentDidUpdate() {
    const { item } = this.props;
    if (item && item.text) this.hijackLinks();
  }

  hijackLinks = () => {
    const linkTags = this.text.querySelectorAll("a");
    Array.prototype.slice.call(linkTags).forEach(a => {
      a.rel = "noreferrer noopener nofollow";
      a.target = "_blank";
    });
  };

  toggleReplies = () => {
    this.setState({ repliesVisible: !this.state.repliesVisible });
  };

  render({ id, item, items }, { repliesVisible }) {
    const replies =
      item && item.kids ? item.kids.map(id => items[id]).filter(i => i && i.text && i.by) : [];
    return item && item.text && item.by
      ? <div class={s.root}>
          <div class={s.content}>
            <div class={s.info}>
              by <Link to={`/user/${item.by}`}>{item.by}</Link>
              {` ${timeago(item.time)} ago`}
            </div>
            <div
              class={s.text}
              ref={c => {
                this.text = c;
              }}
              dangerouslySetInnerHTML={{ __html: item.text }}
            />
          </div>
          {!!replies.length && [
            <a
              onClick={this.toggleReplies}
              class={`${s.toggleReplies} ${!repliesVisible ? s.toggleRepliesCollapsed : ""}`}
            >
              {repliesVisible ? "[-]" : `[+] ${pluralize(replies.length, " comment")} hidden`}
            </a>,
            <div class={s.comments} style={{ display: !repliesVisible ? "none" : "" }}>
              {replies.map(({ id }) => <WrappedComment key={id} id={id} />)}
            </div>
          ]}
        </div>
      : null;
  }
}

const mapToProps = ({ items }, { id }) => ({ item: items[id], items });

const WrappedComment = withStyles(s)(connect(mapToProps)(Comment));

export default WrappedComment;
