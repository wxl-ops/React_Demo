import React, { createContext } from "react";
const { Provider, Consumer } = createContext();
export default function A() {
  return (
    <div>
      <h1>我是A组件</h1>
      <Provider value={1}>
        <B />
      </Provider>
    </div>
  );
}
function B() {
  return (
    <div>
      <h3>我是B组件</h3>
      <C />
    </div>
  );
}
function C() {
  return (
    <div>
      我是C组件，拿到的值是：
      <Consumer>
        {(value) => {
          return value;
        }}
      </Consumer>
    </div>
  );
}
