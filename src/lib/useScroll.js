export default class UseScroll {
  constructor(location) {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
      this.scrollRestorationSupported = true;
    }

    this.currentLocation = location;
    this.scrollPositionsHistory = {};
  }

  storeScroll({ location, action }) {
    if (!this.scrollRestorationSupported) return;

    this.scrollPositionsHistory[this.currentLocation.key] = {
      scrollX: window.pageXOffset,
      scrollY: window.pageYOffset
    };

    if (action === "PUSH") {
      delete this.scrollPositionsHistory[location.key];
    }

    this.currentLocation = location;
  }

  restoreScroll({ key, hash }) {
    if (!this.scrollRestorationSupported) return;

    let { scrollX = 0, scrollY = 0 } = this.scrollPositionsHistory[key] || {};
    const targetHash = hash.substr(1);

    if (targetHash) {
      const target = document.getElementById(targetHash);

      if (target) {
        scrollY = window.pageYOffset + target.getBoundingClientRect().top;
      }
    }

    window.scrollTo(scrollX, scrollY);
  }
}
