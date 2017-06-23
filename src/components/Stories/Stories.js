import { h, Component } from "preact";

import withStyles from "../../lib/withStyles";
import { fetchIdsByType, fetchItems } from "../../lib/HNService";

import Wrapper from "../Wrapper";
import Card from "../Card";
import Spinner from "../Spinner";

import s from "./Stories.scss";

@withStyles(s)
export default class extends Component {
  state = { items: [] };

  componentDidMount() {
    this.fetchItems();
  }

  componentWillReceiveProps() {
    this.fetchItems();
  }

  fetchItems = async () => {
    try {
      const { type } = this.props;

      const ids = await fetchIdsByType(type);

      const items = await fetchItems(ids);

      this.setState({ items });
    } catch (err) {
      console.error(err); // eslint-disable-line no-console
    }
  };

  render(props, { items }) {
    return (
      <Wrapper>
        {!items.length
          ? <Spinner />
          : <div class={s.root}>
              {items.map((item, index) =>
                <Card {...item} key={`card-${item.id}`} index={index + 1} />
              )}
            </div>}
      </Wrapper>
    );
  }
}
