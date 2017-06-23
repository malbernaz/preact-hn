import { h, Component } from "preact";

/** Creates a new store, which is a tiny evented state container.
 *  @example
 *    let store = createStore();
 *    store.subscribe( state => console.log(state) );
 *    store.setState({ a: 'b' });   // logs { a: 'b' }
 *    store.setState({ c: 'd' });   // logs { c: 'd' }
 */
export default function createStore(state = {}) {
  let listeners = [];

  return {
    setState(update) {
      state = { ...state, ...update };
      listeners.forEach(f => f(state));
    },
    subscribe(f) {
      listeners.push(f);
    },
    unsubscribe(f) {
      let i = listeners.indexOf(f);
      listeners.splice(i, !!~i);
    },
    getState() {
      return state;
    }
  };
}

/** Wire a component up to the store. Passes state as props, re-renders on change.
 *  @param {Function|Array|String} mapStateToProps  A function (or any `select()` argument) mapping of store state to prop values.
 *  @example
 *    const Foo = connect('foo,bar')( ({ foo, bar }) => <div /> )
 *  @example
 *    @connect( state => ({ foo: state.foo, bar: state.bar }) )
 *    export class Foo { render({ foo, bar }) { } }
 */
export function connect(mapToProps) {
  return Child =>
    class extends Component {
      state = this.getProps();
      update = () => {
        let mapped = this.getProps();
        if (!shallowEqual(mapped, this.state)) {
          this.setState(mapped);
        }
      };
      getProps() {
        let state = (this.context.store && this.context.store.getState()) || {};
        return mapToProps(state);
      }
      componentWillMount() {
        this.context.store.subscribe(this.update);
      }
      componentWillUnmount() {
        this.context.store.unsubscribe(this.update);
      }
      render(props, state, context) {
        return <Child store={context.store} {...props} {...state} />;
      }
    };
}

/** Returns a boolean indicating if all keys and values match between two objects. */
function shallowEqual(a, b) {
  for (let i in a) if (a[i] !== b[i]) return false;
  for (let i in b) if (!(i in a)) return false;
  return true;
}
