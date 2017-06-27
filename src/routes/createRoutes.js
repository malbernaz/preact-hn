import { h } from "preact";
import { connect } from "../lib/unistore";
import { fetchIds, fetchStories } from "../actions";

function createRoute({ path, title, type }) {
  return {
    path,
    title,
    async action({ store, url }, { page = "1" }) {
      const { default: Stories } = await import(
        "../components/Stories" /* webpackChunkName: "stories" */
      );

      const typeState = store.getState()[type];
      let ids = typeState.ids;

      if (ids) {
        store.setState({ currentStory: type });
      } else {
        if (!_CLIENT_) {
          ids = await fetchIds(type);
        } else {
          fetchIds(type).then(ids => {
            if (_CLIENT_) {
              fetchStories(type, page)(ids);
            }
          });
        }
      }

      if (_CLIENT_ && ids && !typeState[page]) {
        fetchStories(type, page)(ids);
      }

      const WrappedStories = connect(state => ({
        ...state[type],
        ids: state[state.currentStory].ids
      }))(props => <Stories {...props} type={type} page={page} />);

      return { title, page, component: <WrappedStories /> };
    }
  };
}

export default [
  {
    path: "/:page(\\d+)?",
    title: "top",
    type: "top"
  },
  {
    path: "/new/:page(\\d+)?",
    title: "new",
    type: "new"
  },
  {
    path: "/show/:page(\\d+)?",
    title: "show",
    type: "show"
  },
  {
    path: "/ask/:page(\\d+)?",
    title: "ask",
    type: "ask"
  },
  {
    path: "/job/:page(\\d+)?",
    title: "jobs",
    type: "job"
  }
].map(createRoute);
