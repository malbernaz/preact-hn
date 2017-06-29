import { h, Component } from "preact";

import withStyles from "../../lib/withStyles";
import { watchList } from "../../actions";

import Wrapper from "../Wrapper";
import Card from "../Card";
import Spinner from "../Spinner";

import s from "./Stories.scss";

@withStyles(s)
export default class extends Component {
  async componentDidMount() {
    const { page, type } = this.props;
    this.unwatchList = watchList(type, page);
  }

  componentWillReceiveProps({ page, type }) {
    if (page !== this.props.page) {
      this.unwatchList();
      this.unwatchList = watchList(type, page);
    }
  }

  componentWillUnmount() {
    if (this.unwatchList) this.unwatchList();
  }

  render({ page, itemsFetched, [page]: items = [] }) {
    return (
      <Wrapper>
        {!itemsFetched && !items.length
          ? <Spinner />
          : <div id="animate" class={s.root}>
              {items.map((item, index) =>
                <Card
                  {...item}
                  key={`card-${item.id}`}
                  index={page * 30 + parseInt(index, 10) + 1 - 30}
                />
              )}
            </div>}
      </Wrapper>
    );
  }
}
