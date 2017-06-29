import { h, Component } from "preact";

import withStyles from "../../lib/withStyles";
import { connect } from "../../lib/unistore";
import history from "../../lib/history";

import s from "./Pagination.scss";

@withStyles(s)
@connect(state => state)
export default class extends Component {
  componentWillMount() {
    if (this.props.type) {
      this.hideOnFirstRender = false;
    } else {
      this.hideOnFirstRender = true;
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.type && nextProps.type) return;

    if (nextProps.type) {
      this.base.classList.remove(s.leave);
      this.base.classList.add(s.enter);
    } else {
      this.base.classList.remove(s.enter);
      this.base.classList.add(s.leave);
    }
  }

  handleClick = e => {
    if (this.props.onClick) this.props.onClick(e);
    if (e.metaKey || e.altKey || e.ctrlKey || e.shiftKey) return;
    if (e.button !== 0) return;
    if (e.defaultPrevented === true) return;
    e.preventDefault();
    const { store, type } = this.props;
    const storyState = store.getState()[type];
    const stories = storyState[e.target.dataset.page || 1];
    if (!stories || !stories.length) store.setState({ itemsFetched: false });
    history.push(e.target.pathname);
  };

  render({ page, type, ids = [0] }) {
    const url = type === "top" ? "/" : `/${type}/`;
    const pageNumber = parseInt(page, 10);
    const pages = ids.length % 30 !== 0 ? parseInt(ids.length / 30, 10) + 1 : ids.length / 30;
    const prev = pageNumber - 1 === 1 ? "" : pageNumber - 1;
    const next = pageNumber + 1;

    return (
      <nav class={`${s.root} ${this.hideOnFirstRender ? s.hidden : ""}`}>
        <a
          href={`${url}${prev}`}
          class={pageNumber === 1 && s.disabled}
          data-page={prev}
          onClick={this.handleClick}
        >
          ‹ prev
        </a>
        <span class={s.count}>
          {page || "1"}/{pages}
        </span>
        <a
          href={`${url}${next}`}
          class={parseInt(page, 10) === pages && s.disabled}
          data-page={next}
          onClick={this.handleClick}
        >
          next ›
        </a>
      </nav>
    );
  }
}
