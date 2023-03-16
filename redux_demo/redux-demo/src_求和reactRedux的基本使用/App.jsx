import React from "react";
import Count from "./containers/Count/Count";
import store from "./redux/store";

export default function App() {
  return (
    <div>
      <Count store={store} />
    </div>
  );
}
