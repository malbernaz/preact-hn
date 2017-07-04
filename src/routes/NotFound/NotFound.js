import { h } from "preact";

import withStyles from "../../lib/withStyles";

import Wrapper from "../../components/Wrapper";

import s from "./NotFound.scss";

export default withStyles(s)(({ url, message }) =>
  <Wrapper>
    <div class={s.root}>
      <h1>404</h1>
      <h2>not found</h2>
      {message
        ? <span>
            {message}
          </span>
        : <span>
            <code>{url}</code> does not exist
          </span>}
    </div>
  </Wrapper>
);
