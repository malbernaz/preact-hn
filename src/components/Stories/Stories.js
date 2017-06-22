import { h } from "preact";

import withStyles from "../../lib/withStyles";

import Wrapper from "../Wrapper";
import Card from "../Card";
import Spinner from "../Spinner";

import s from "./Stories.scss";

const thirty = Array.from(Array(30)).map((i, index) => index + 1);

export default withStyles(s)(() =>
  <Wrapper>
    {!Spinner
      ? <Spinner />
      : <div class={s.root}>
          {thirty.map(i => <Card key={`card-${i}`} index={i} />)}
        </div>}
  </Wrapper>
);
