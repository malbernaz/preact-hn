import { h } from "preact";

export default {
  path: "/jobs/:page(\\d+)?",
  async action() {
    const { default: Stories } = await import(
      "../components/Stories" /* webpackChunkName: "stories" */
    );

    return {
      title: "JOBS",
      component: <Stories />
    };
  }
};
