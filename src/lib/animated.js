import { h, Component } from "preact";

export default Wrapped =>
  class extends Component {
    static defaultProps = {
      timeout: 500
    };

    componentWillEnter(cb) {
      this.base.classList.remove("transition-leave");
      this.base.classList.add("transition-enter");
      cb();
    }

    componentWillLeave(cb) {
      this.base.classList.remove("transition-enter");
      this.base.classList.add("transition-leave");
      setTimeout(cb, this.props.timeout);
    }

    render(props) {
      return <Wrapped {...props} />;
    }
  };
