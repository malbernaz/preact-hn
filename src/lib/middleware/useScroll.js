export default class UseScroll {
  constructor(location) {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    this.currentLocation = location;
    this.scrollPositionsHistory = {};
  }

  storeScroll(history) {
    const { location } = history;

    this.scrollPositionsHistory[this.currentLocation.key] = {
      scrollX: window.pageXOffset,
      scrollY: window.pageYOffset
    };

    if (history.action === "PUSH") {
      delete this.scrollPositionsHistory[location.key];
    }

    this.currentLocation = location;
  }

  restoreScroll(location) {
    const pos = this.scrollPositionsHistory[location.key];

    let scrollX = 0;
    let scrollY = 0;

    if (pos) {
      scrollX = pos.scrollX;
      scrollY = pos.scrollY;
    } else {
      const targetHash = location.hash.substr(1);

      if (targetHash) {
        const target = document.getElementById(targetHash);

        if (target) {
          scrollY = window.pageYOffset + target.getBoundingClientRect().top;
        }
      }
    }

    setTimeout(() => window.scrollTo(scrollX, scrollY), 0);
  }
}
