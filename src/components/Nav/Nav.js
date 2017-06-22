/* eslint-disable */
import { h, Component } from "preact";

import withStyles from "../../lib/withStyles";

import Link from "../Link";

import s from "./Nav.scss";

function isActive(props) {
  if (props.to === "/") {
    const page = props.currentRoute.split("/")[1];
    if (!page) {
      return true;
    }
    return !isNaN(page);
  }
  return props.currentRoute === props.to;
}

const NavLink = props =>
  <Link class={isActive(props) ? s.linkActive : s.link} {...props}>
    {props.children}
  </Link>;

@withStyles(s)
export default class extends Component {
  componentDidMount() {
    this.nav.addEventListener("transitionend", this.toggleBodyScroll, false);
  }

  componentWillUnmount() {
    this.nav.removeEventListener("transitionend", this.toggleBodyScroll, false);
  }

  onTouchStart = event => {
    const { clientX } = event.touches[0];
    const { left, width } = this.nav.getBoundingClientRect();

    this.startPos = left;
    this.touchStart = clientX - left;
    this.navWidth = width;
    this.shadow.style.transition = "none";
    this.nav.style.transition = "none";

    document.body.classList.add(s.lockScroll);
  };

  onTouchMove = event => {
    const { clientX } = event.touches[0];

    const mod = clientX - this.touchStart;

    if (mod <= 0) {
      this.nav.style.transform = `translateX(${mod}px)`;
      this.shadow.style.opacity = (this.navWidth + mod) / this.navWidth;
    }
  };

  onTouchEnd = () => {
    const { handleNavOpen } = this.props;
    const { left, width } = this.nav.getBoundingClientRect();

    const nearOpen = this.startPos === 0 ? -left < width / 6 : -left < width / 6 * 5;

    this.shadow.style.opacity = "";
    this.shadow.style.transition = "";
    this.nav.style.transition = "";
    this.nav.style.transform = "";

    handleNavOpen(nearOpen);
  };

  toggleBodyScroll = () => {
    if (this.props.navOpened) {
      document.body.classList.add(s.lockScroll);
    } else {
      document.body.classList.remove(s.lockScroll);
    }
  };

  render({ currentRoute, navOpened, toggle }) {
    return (
      <div class={s.root}>
        <div
          class={!navOpened ? s.shadow : s.shadowShown}
          ref={c => {
            this.shadow = c;
          }}
          onClick={() => setTimeout(toggle, 1)}
        />
        <nav
          class={!navOpened ? s.nav : s.navShown}
          onTouchEnd={this.onTouchEnd}
          onTouchMove={this.onTouchMove}
          onTouchStart={this.onTouchStart}
          ref={c => {
            this.nav = c;
          }}
        >
          <NavLink currentRoute={currentRoute} onClick={toggle} to="/">top</NavLink>
          <NavLink currentRoute={currentRoute} onClick={toggle} to="/new">new</NavLink>
          <NavLink currentRoute={currentRoute} onClick={toggle} to="/show">show</NavLink>
          <NavLink currentRoute={currentRoute} onClick={toggle} to="/ask">ask</NavLink>
          <NavLink currentRoute={currentRoute} onClick={toggle} to="/jobs">jobs</NavLink>
          <div
            class={s.lever}
            onClick={navOpened && toggle}
            onTouchEnd={this.onTouchEnd}
            onTouchMove={this.onTouchMove}
            onTouchStart={this.onTouchStart}
          />
        </nav>
      </div>
    );
  }
}
