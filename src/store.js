import createStore from "./lib/unistore";

const initialState = _CLIENT_
  ? window.__INITIAL_STATE__
  : ["top", "new", "show", "ask", "job"].reduce((acc, t) => ({ ...acc, [t]: {} }), {
      currentStory: "top",
      itemsFetched: false
    });

const store = createStore(initialState);

if (_CLIENT_) window.store = store;

export default store;
