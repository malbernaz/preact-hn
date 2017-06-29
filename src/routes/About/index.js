import { h } from "preact";

export default {
  path: "/about",
  async action() {
    const { default: About } = await import("./About" /* webpackChunkName: "about" */);

    return {
      title: "about",
      component: <About />
    };
  }
};
