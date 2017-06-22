import { h } from "preact";

import withStyles from "../../lib/withStyles";

import Wrapper from "../../components/Wrapper";

import s from "./NotFound.scss";

export default withStyles(s)(() =>
  <Wrapper>
    <h1 class={s.root}>not found</h1>
  </Wrapper>
);
