import { Component } from "preact";

import withStyles from "../../lib/withStyles";

import Link from "../Link";

import s from "./Nav.scss";

function isActive(props) {
  return props.routes[props.children].test(props.currentRoute);
}

function getDelay() {
  if (!_CLIENT_) return 0;
  return matchMedia("(max-width: 600px)").matches ? 300 : 0;
}

const NavLink = props =>
  <Link class={isActive(props) ? s.linkActive : s.link} delay={getDelay()} {...props}>
    {props.children}
  </Link>;

@withStyles(s)
export default class extends Component {
  componentDidMount() {
    this.nav.addEventListener("transitionend", this.toggleBodyScroll, false);
    [this.nav, this.lever, this.shadow].forEach(el => {
      el.addEventListener("touchstart", this.onTouchStart, { passive: true });
      el.addEventListener("touchmove", this.onTouchMove, { passive: true });
      el.addEventListener("touchend", this.onTouchEnd, { passive: true });
    });
  }

  componentWillUnmount() {
    this.nav.removeEventListener("transitionend", this.toggleBodyScroll, false);
    [this.nav, this.lever, this.shadow].forEach(el => {
      el.removeEventListener("touchstart", this.onTouchStart, { passive: true });
      el.removeEventListener("touchmove", this.onTouchMove, { passive: true });
      el.removeEventListener("touchend", this.onTouchEnd, { passive: true });
    });
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

  render({ currentRoute, navOpened, toggle, routes }) {
    return (
      <div class={s.root}>
        <a
          class={!navOpened ? s.shadow : s.shadowShown}
          ref={c => (this.shadow = c)}
          onClick={() => setTimeout(toggle, 1)}
        />
        <nav class={!navOpened ? s.nav : s.navShown} ref={c => (this.nav = c)}>
          <NavLink routes={routes} currentRoute={currentRoute} onClick={toggle} to="/">
            top
          </NavLink>
          <NavLink routes={routes} currentRoute={currentRoute} onClick={toggle} to="/new/">
            new
          </NavLink>
          <NavLink routes={routes} currentRoute={currentRoute} onClick={toggle} to="/show/">
            show
          </NavLink>
          <NavLink routes={routes} currentRoute={currentRoute} onClick={toggle} to="/ask/">
            ask
          </NavLink>
          <NavLink routes={routes} currentRoute={currentRoute} onClick={toggle} to="/job/">
            jobs
          </NavLink>
          <div class={s.lever} ref={c => (this.lever = c)} onClick={navOpened && toggle} />
        </nav>
      </div>
    );
  }
}
