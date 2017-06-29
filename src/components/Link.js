import { h, Component } from "preact";
import history from "../lib/history";

export default class extends Component {
  static defaultProps = {
    delay: 0
  };

  handleClick = e => {
    if (this.props.onClick) this.props.onClick(e);
    if (e.metaKey || e.altKey || e.ctrlKey || e.shiftKey) return;
    if (e.button !== 0) return;
    if (e.defaultPrevented === true) return;
    e.preventDefault();
    if (this.props.to === location.pathname) return;
    setTimeout(() => {
      history.push(this.props.to);
    }, this.props.delay);
  };

  render({ to, children, ...props }) {
    return (
      <a href={to} {...props} onClick={this.handleClick}>
        {children}
      </a>
    );
  }
}
