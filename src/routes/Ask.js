import { h } from "preact";

export default {
  path: "/ask/:page(\\d+)?",
  async action() {
    const { default: Stories } = await import(
      "../components/Stories" /* webpackChunkName: "stories" */
    );

    return {
      title: "ASK",
      component: <Stories />
    };
  }
};
