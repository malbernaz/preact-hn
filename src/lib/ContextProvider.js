import { Component } from "preact";

export default class ContextProvider extends Component {
  getChildContext() {
    return this.props.context;
  }

  render({ children }) {
    return children[0];
  }
}
