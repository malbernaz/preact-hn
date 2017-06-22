import { h } from "preact";

export default {
  path: "/ask",
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
