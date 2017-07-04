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
            <b>Preact HN</b> is yet another hacker news PWA. It was built with Preact, Express,
            Universal Router, Webpack, Firebase and some more awesome technologies available for
            free.
          </p>
          <p>
            The app is hosted on{" "}
            <Link to="https://github.com/malbernaz/preact-hn" blank>
              GitHub
            </Link>. Feel free to make it yours...
          </p>
        </div>
      </Wrapper>
    );
  }
}
