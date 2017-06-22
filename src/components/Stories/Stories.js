import { h } from "preact";

import withStyles from "../../lib/withStyles";

import Wrapper from "../Wrapper";
import Card from "../Card";

import s from "./Stories.scss";

const twenty = Array.from(Array(20)).map((i, index) => index + 1);

export default withStyles(s)(() =>
  <Wrapper>
    <div class={s.root}>
      {twenty.map(i => <Card key={`card-${i}`} />)}
    </div>
  </Wrapper>
);
