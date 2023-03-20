import React from "react";
// eslint-disable-next-line no-unused-vars
// import LazyLoad from "./components/_2lazyLoad";
// import A from "./components/_4Context";
import Parent from "./components/_5RenderProps";
// import UseState from "./components/_3Hook/UseState";
// import UseEffect from "./components/_3Hook/UseEffect";
export default function App(props) {
  return (
    <div>
      {/* <LazyLoad /> */}
      {/* <UseState /> */}
      {/* <UseEffect root={props.root} /> */}
      {/* <A /> */}
      <Parent />
    </div>
  );
}
