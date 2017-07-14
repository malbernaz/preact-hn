/* eslint-disable */

import { Component } from "preact";

import withStyles from "../../lib/withStyles";
import { title } from "../../config";

import Logo from "../icons/Logo";
import Info from "../icons/Info";
import Menu from "../icons/Menu";
import Link from "../Link";
import Nav from "../Nav";

import s from "./Header.scss";

@withStyles(s)
export default class extends Component {
  state = { navOpened: false };

  toggle = () => {
    if (matchMedia("(max-width: 768px)").matches) {
      this.setState({ navOpened: !this.state.navOpened });
    }
  };

  handleNavOpen = open => {
    if (matchMedia("(max-width: 768px)").matches) {
      this.setState({ navOpened: open });
    }
  };

  render({ currentRoute, notFound, routes }, { navOpened }) {
    return (
      <header class={s.root}>
        <div class={s.wrapper}>
          <a class={s.menu} onClick={this.toggle}>
            <Menu />
          </a>
          <div class={s.navContent}>
            <Link to="/" class={s.logo}>
              <Logo />
              <h1>
                {title}
              </h1>
            </Link>
            <Nav
              currentRoute={currentRoute}
              navOpened={navOpened}
              toggle={this.toggle}
              routes={routes}
              handleNavOpen={this.handleNavOpen}
            />
          </div>
          <Link to="/about/" class={s.aboutLink}>
            <Info />
            <span>about</span>
          </Link>
        </div>
      </header>
    );
  }
}
