/*eslint-disable*/
import { h, Component } from "preact";

import withStyles from "../../lib/withStyles";
import timeago from "../../lib/timeago";
import { fetchComments } from "../../actions";

import Wrapper from "../../components/Wrapper";
import Comment from "../../components/Comment";
import Spinner from "../../components/Spinner";

import s from "./Thread.scss";

@withStyles(s)
export default class extends Component {
  state = { comments: [] };

  async componentDidMount() {
    const comments = await fetchComments(this.props.item.kids);
    this.setState({ comments });
  }

  render({ item }, { comments }) {
    return (
      <Wrapper>
        <div class={s.root}>
          <div class={s.header}>
            <h1>
              {item.title}
            </h1>
            <div class={s.info}>
              {item.score} points | by {item.by} {timeago(item.time)} ago
            </div>
            {item.text && <div class={s.text} dangerouslySetInnerHTML={{ __html: item.text }} />}
          </div>
          <div class={s.comments}>
            <div
              class={`${s.commentsCount} ${comments.length ? s.commentsCountCoomentsLoaded : ""}`}
            >
              <p>
                {item.descendants} comments{" "}
              </p>
              {!comments.length &&
                <span>
                  <Spinner />
                </span>}
            </div>
            {!!comments.length &&
              comments.filter(c => c.text !== undefined).map(c => <Comment key={c.id} item={c} />)}
          </div>
        </div>
      </Wrapper>
    );
  }
}
