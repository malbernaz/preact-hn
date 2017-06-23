import { h } from "preact";
import { connect } from "../lib/unistore";

function createRoute({ path, title, type }) {
  return {
    path,
    async action(ctx, { page }) {
      const { default: Stories } = await import(
        "../components/Stories" /* webpackChunkName: "stories" */
      );

      const WrappedStories = connect(state => ({ ...state[type] }))(props =>
        <Stories {...props} type={type} page={page || 1} />
      );

      return { title, page, component: <WrappedStories /> };
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
