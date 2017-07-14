import { Component } from "preact";

import withStyles from "../../lib/withStyles";
import { timeago, pluralize } from "../../lib/util";
import { fetchComments } from "../../actions";

import Wrapper from "../../components/Wrapper";
import Comment from "../../components/Comment";
import Spinner from "../../components/Spinner";
import Link from "../../components/Link";

import s from "./Thread.scss";

@withStyles(s)
export default class extends Component {
  state = { commentsFetched: false };

  async componentDidMount() {
    const { item } = this.props;
    if (item.text) {
      const linkTags = this.text.querySelectorAll("a");
      Array.prototype.slice.call(linkTags).forEach(a => {
        a.rel = "noreferrer noopener nofollow";
        a.target = "_blank";
      });
    }
    if (item.descendants) {
      await fetchComments(item.kids);
      this.setState({ commentsFetched: true });
    }
  }

  render({ item }, { commentsFetched }) {
    return (
      <Wrapper>
        <div class={s.root}>
          <div class={s.header}>
            {item.url
              ? <Link class={s.title} to={item.url} blank>
                  <h1>
                    {item.type === "job" && "Job: "}
                    {item.title}
                  </h1>
                </Link>
              : <h1>
                  {item.type === "job" && "Job: "}
                  {item.title}
                </h1>}
            <div class={s.info}>
              {pluralize(item.score, " point")} | by <Link to={`/user/${item.by}`}>{item.by}</Link>{" "}
              {timeago(item.time)} ago
            </div>
            {item.text &&
              <div
                class={s.text}
                ref={c => {
                  this.text = c;
                }}
                dangerouslySetInnerHTML={{ __html: item.text }}
              />}
          </div>
          {item.type !== "job" &&
            <div class={s.commentsContainer}>
              <div
                class={`${s.commentsCount} ${commentsFetched ? s.commentsCountCommentsLoaded : ""}`}
              >
                <p>
                  {item.descendants
                    ? `${pluralize(item.descendants, " comment")}`
                    : "no comments yet"}
                </p>
                {!commentsFetched &&
                  !!item.descendants &&
                  <span>
                    <Spinner />
                  </span>}
              </div>
              {!!commentsFetched &&
                <div class={s.comments}>
                  {item.kids.map(id => <Comment key={id} id={id} />)}
                </div>}
            </div>}
        </div>
      </Wrapper>
    );
  }
}
