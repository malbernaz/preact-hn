import { h, Component } from "preact";

import withStyles from "../../lib/withStyles";

import Wrapper from "../../components/Wrapper";
import Logo from "../../components/icons/Logo";
import Link from "../../components/Link";

import s from "./About.scss";

@withStyles(s)
export default class extends Component {
  render() {
    return (
      <Wrapper>
        <div class={s.root}>
          <Logo />
          <h1>Preact HN</h1>
          <p>
            <b>Preact HN</b> is yet another hacker news clone – in the form of a progressive web
            app. It was built with Preact, Express, Universal Router, Webpack, Firebase and some
            other awesome technologies made by amazing people.
          </p>
          <p>
            This project is all open source and it can be found at{" "}
            <Link to="https://github.com/malbernaz/preact-hn" blank>
              GitHub
            </Link>.
            <br />
            Feel free to make it yours...
          </p>
        </div>
      </Wrapper>
    );
  }
}
