import { h, Component } from "preact";
// import { debounce } from "decko";

import withStyles from "../../lib/withStyles";
import { watchList } from "../../lib/HNService";
import { fetchStories } from "../../actions";

import Pagination from "../Pagination";
import Wrapper from "../Wrapper";
import Card from "../Card";
import Spinner from "../Spinner";

import s from "./Stories.scss";

@withStyles(s)
export default class extends Component {
  async componentDidMount() {
    const { page, type } = this.props;
    this.unwatchList = watchList(type, fetchStories(type, page));
  }

  componentWillReceiveProps({ page, type }) {
    if (page !== this.props.page) {
      this.unwatchList();
      this.unwatchList = watchList(type, fetchStories(type, page));
    }
  }

  componentWillUnmount() {
    if (this.unwatchList) this.unwatchList();
  }

  render({ page, type, itemsFetched, [page]: items = [], ids }) {
    return (
      <Wrapper>
        <Pagination page={page} type={type} ids={ids} />
        {!itemsFetched && !items.length
          ? <Spinner />
          : <div class={s.root}>
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
