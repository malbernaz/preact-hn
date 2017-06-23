import { h } from "preact";

function createRoute({ path, title, type }) {
  return {
    path,
    async action() {
      const { default: Stories } = await import(
        "../components/Stories" /* webpackChunkName: "stories" */
      );

      const component = <Stories type={type} />;

      return { title, component };
    }
  };
}

export default [
  {
    path: "/:page(\\d+)?",
    title: "TOP",
    type: "top"
  },
  {
    path: "/new/:page(\\d+)?",
    title: "NEW",
    type: "new"
  },
  {
    path: "/show/:page(\\d+)?",
    title: "SHOW",
    type: "show"
  },
  {
    path: "/ask/:page(\\d+)?",
    title: "ASK",
    type: "ask"
  },
  {
    path: "/jobs/:page(\\d+)?",
    title: "JOBS",
    type: "job"
  }
].map(createRoute);
