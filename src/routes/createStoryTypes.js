import { h } from "preact";

import { connect } from "../lib/unistore";
import { fetchIds, fetchStories } from "../actions";
import { itemsPerPage } from "../config";

function createRoute({ path, title, type }) {
  return {
    path,
    title,
    async action({ store, url }, { page = "1" }) {
      const {
        default: Stories
      } = await import("../components/Stories" /* webpackChunkName: "stories" */);

      const offset = page * itemsPerPage;

      const typeState = store.getState()[type];
      let ids = typeState.ids;

      if (ids.length) {
        store.setState({ currentStory: type });
      } else {
        if (!_CLIENT_) {
          ids = await fetchIds(type);
        } else {
          fetchIds(type).then(ids => {
            if (_CLIENT_) {
              fetchStories(type, offset, itemsPerPage)(ids);
            }
          });
        }
      }

      if (_CLIENT_ && ids.length && !typeState[page]) {
        fetchStories(type, offset, itemsPerPage)(ids);
      }

      function mapToProps(state) {
        const ids = state[type].ids.slice(offset - itemsPerPage, offset);
        const items = ids.map(id => state.items[id]).filter(i => !!i && !!i.id);
        return { ...state[type], items: items.length === ids.length ? items : [] };
      }

      const WrappedStories = connect(mapToProps)(props =>
        <Stories
          {...props}
          currentRoute={url}
          type={type}
          offset={offset}
          itemsPerPage={itemsPerPage}
        />
      );

      return {
        title,
        page,
        type,
        component: <WrappedStories />
      };
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
