import createStore from "./lib/unistore";

const initialState = _CLIENT_
  ? window.__INITIAL_STATE__
  : ["top", "new", "show", "ask", "job"].reduce((acc, t) => ({ ...acc, [t]: { ids: [] } }), {
      currentStory: "top",
      items: {},
      users: {},
      itemsFetched: false,
      animateOnFirstRender: false
    });

const store = createStore(initialState);

if (_CLIENT_) window.store = store;

export default store;
