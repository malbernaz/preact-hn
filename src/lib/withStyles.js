import { h, Component } from "preact";

export default function withStyles(...styles) {
  return WrappedComponent =>
    class WithStyles extends Component {
      componentWillMount() {
        this.removeCss = this.context.insertCss.apply(undefined, styles);
      }
      componentWillUnmount() {
        setTimeout(this.removeCss, 0);
      }
      render(props) {
        return <WrappedComponent {...props} />;
      }
    };
}
