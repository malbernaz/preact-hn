import { h } from "preact";

export default {
  path: "/jobs",
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
