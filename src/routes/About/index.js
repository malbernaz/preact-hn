import About from "./About";

export default {
  path: "/about",
  action() {
    return {
      title: "about",
      component: <About />
    };
  }
};
