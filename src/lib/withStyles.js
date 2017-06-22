import { h, Component } from "preact";
import hoistStatics from "hoist-non-react-statics";

export default function withStyles(...styles) {
  return function wrapWithStyles(WrappedComponent) {
    const displayName = WrappedComponent.displayName || WrappedComponent.name || "Component";

    class WithStyles extends Component {
      static displayName = `WithStyles(${displayName})`;

      componentWillMount() {
        this.removeCss = this.context.insertCss.apply(undefined, styles);
      }

      componentWillUnmount() {
        setTimeout(this.removeCss, 0);
      }

      render() {
        return <WrappedComponent {...this.props} />;
      }
    }

    return hoistStatics(WithStyles, WrappedComponent);
  };
}
