import { Component } from "preact";

export default Wrapped =>
  class extends Component {
    static defaultProps = { timeout: 600, hooks: [] };

    componentDidMount() {
      const transitionContainer = this.base.querySelector("#transition-element");
      transitionContainer.addEventListener("animationstart", this.callAnimationHooks, false);
    }

    componentWillUnmount() {
      const transitionContainer = this.base.querySelector("#transition-element");
      transitionContainer.removeEventListener("animationstart", this.callAnimationHooks);
    }

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

    callAnimationHooks = e => {
      if (
        !!this.base &&
        this.base.classList.contains("transition-enter") &&
        e.target.id === "transition-element"
      ) {
        this.props.hooks.forEach(f => {
          if (typeof f === "function") f();
        });
      }
    };

    render(props) {
      return <Wrapped {...props} />;
    }
  };
