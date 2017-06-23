import { h, Component } from "preact";

import withStyles from "../../lib/withStyles";
import { fetchIdsByType, fetchItems, watchList } from "../../lib/HNService";

import Wrapper from "../Wrapper";
import Card from "../Card";
import Spinner from "../Spinner";

import s from "./Stories.scss";

@withStyles(s)
export default class extends Component {
  componentDidMount() {
    this.initialize(this.props.type);
  }

  componentWillUnmount() {
    if (this.unwatchList) this.unwatchList();
  }

  setTypeState(state) {
    const { type, store } = this.props;
    store.setState({ [type]: { ...store.getState()[type], ...state } });
  }

  async initialize(type) {
    const ids = await fetchIdsByType(type);
    this.setTypeState({ ids });
    this.fetchItems(ids);
    this.unwatchList = watchList(type, this.fetchItems);
  }

  fetchItems = async ids => {
    const { page } = this.props;
    const offset = page * 30;
    try {
      const items = await fetchItems(ids.slice(offset - 30, offset));
      this.setTypeState({ [page]: items, itemsFetched: true });
    } catch (err) {
      console.error(err); // eslint-disable-line no-console
    }
  };

  render({ page, itemsFetched, ...rest }) {
    return (
      <Wrapper>
        {!itemsFetched
          ? <Spinner />
          : <div class={s.root}>
              {rest[page].map((item, index) =>
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
