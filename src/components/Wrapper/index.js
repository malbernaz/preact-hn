import withStyles from "../../lib/withStyles";

import s from "./Wrapper.scss";

export default withStyles(s)(({ children }) =>
  <div class={s.container}>
    <div class={s.root} id="transition-element">
      {children}
    </div>
  </div>
);
