import { Component } from "preact";

import withStyles from "../../lib/withStyles";
import { watchList } from "../../actions";

import Wrapper from "../Wrapper";
import Card from "../Card";
import Spinner from "../Spinner";

import s from "./ListView.scss";

@withStyles(s)
export default class extends Component {
  async componentDidMount() {
    const { offset, type } = this.props;
    this.unwatchList = watchList(type, offset);
  }

  componentWillReceiveProps({ offset, type }) {
    if (offset !== this.props.offset) {
      this.unwatchList();
      this.unwatchList = watchList(type, offset);
    }
  }

  componentWillUnmount() {
    const { store, animateOnFirstRender } = this.props;
    if (this.unwatchList) this.unwatchList();
    if (!animateOnFirstRender) {
      store.setState({ animateOnFirstRender: true });
    }
  }

  render({ offset, itemsPerPage, itemsFetched, items = [], animateOnFirstRender }) {
    return (
      <Wrapper>
        {!itemsFetched && !items.length
          ? <div class={s.spinnerContainer}>
              <Spinner />
            </div>
          : <div class={`${s.root} ${!animateOnFirstRender ? s.disableAnimation : ""}`}>
              {items.map((item, index) =>
                <Card
                  {...item}
                  key={`card-${item.id}`}
                  index={offset + parseInt(index, 10) + 1 - itemsPerPage}
                />
              )}
            </div>}
      </Wrapper>
    );
  }
}
