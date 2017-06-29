import { h, Component } from "preact";

export default Wrapped =>
  class extends Component {
    componentWillEnter(cb) {
      this.base.classList.remove("transition-leave");
      this.base.classList.add("transition-enter");
      cb();
    }

    componentWillLeave(cb) {
      this.base.classList.remove("transition-enter");
      this.base.classList.add("transition-leave");
      setTimeout(cb, 400);
    }

    render(props) {
      return <Wrapped {...props} />;
    }
  };
