import { h } from "preact";

export default {
  path: "/show/:page(\\d+)?",
  async action() {
    const { default: Stories } = await import(
      "../components/Stories" /* webpackChunkName: "stories" */
    );

    return {
      title: "SHOW",
      component: <Stories />
    };
  }
};
