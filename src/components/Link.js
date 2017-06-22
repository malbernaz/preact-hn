import { h, Component } from "preact";
import history from "../lib/history";

class Link extends Component {
  handleClick = e => {
    if (this.props.onClick) this.props.onClick(e);

    if (e.metaKey || e.altKey || e.ctrlKey || e.shiftKey) return;

    if (e.button !== 0) return;

    if (e.defaultPrevented === true) return;

    e.preventDefault();

    history.push(this.props.to);
  };

  render({ to, children, ...props }) {
    return <a href={to} {...props} onClick={this.handleClick}>{children}</a>;
  }
}

export default Link;
