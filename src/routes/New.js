import { h } from "preact";

export default {
  path: "/new",
  async action() {
    const { default: Stories } = await import(
      "../components/Stories" /* webpackChunkName: "stories" */
    );

    return {
      title: "NEW",
      component: <Stories />
    };
  }
};
