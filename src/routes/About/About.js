import { h, Component } from "preact";

import withStyles from "../../lib/withStyles";

import Wrapper from "../../components/Wrapper";

import s from "./About.scss";

@withStyles(s)
export default class extends Component {
  render() {
    return (
      <Wrapper>
        <div>something</div>
      </Wrapper>
    );
  }
}
