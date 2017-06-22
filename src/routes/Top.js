import { h } from "preact";

export default {
  path: /^(\/\d+|\/)$/i,
  async action() {
    const { default: Stories } = await import(
      "../components/Stories" /* webpackChunkName: "stories" */
    );

    return {
      title: "TOP",
      component: <Stories />
    };
  }
};
