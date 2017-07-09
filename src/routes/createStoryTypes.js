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
        default: ListView
      } = await import("../components/ListView" /* webpackChunkName: "listview" */);

      const offset = page * itemsPerPage;

      if (_CLIENT_) {
        const fetchStoriesByType = fetchStories(type, offset, itemsPerPage);
        const { [type]: typeState, items } = store.getState();
        let { ids } = typeState;

        if (ids.length) {
          store.setState({ currentStory: type });

          const itemsExist = ids
            .slice(offset - itemsPerPage, offset)
            .some(id => typeof items[id] !== "undefined");

          if (!itemsExist) {
            fetchStoriesByType(ids);
          }
        } else {
          fetchIds(type).then(ids => fetchStoriesByType(ids));
        }
      } else {
        await fetchIds(type);
      }

      function mapToProps(state) {
        const ids = state[type].ids.slice(offset - itemsPerPage, offset);
        const items = ids.map(id => state.items[id]).filter(i => !!i && !!i.id);
        return { ...state[type], items: items.length === ids.length ? items : [] };
      }

      const WrappedStories = connect(mapToProps)(props =>
        <ListView
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
