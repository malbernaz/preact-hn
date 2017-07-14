import withStyles from "../../lib/withStyles";
import { connect } from "../../lib/unistore";

import Header from "../Header";
import Pagination from "../Pagination";

import s from "./Root.scss";

const mapToProps = state => ({
  ids: state[state.currentStory].ids
});

export default withStyles(s)(
  connect(mapToProps)(({ children, currentRoute, notFound, routes, page, type, ids }) =>
    <div class={s.root}>
      <Header currentRoute={currentRoute} routes={routes} notFound={notFound} />
      <Pagination page={page} type={type} ids={ids} />
      {children}
    </div>
  )
);
