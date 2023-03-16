import React, { useRef } from "react";
// eslint-disable-next-line no-unused-vars
import store from "../../redux/store";
import {
  incrementAction,
  decrementAction,
  asyncIncrementAction,
} from "../../redux/count_action";
export default function Count() {
  const refSelect = useRef(null);
  const count = store.getState();
  const increment = () => {
    const value = refSelect.current.value;
    store.dispatch(incrementAction(value));
  };
  const decrement = () => {
    const value = refSelect.current.value;
    store.dispatch(decrementAction(value));
  };
  const incrementIfOdd = () => {
    const value = refSelect.current.value;
    if (count % 2) {
      store.dispatch(incrementAction(value));
    }
  };
  const incrementAsync = () => {
    const value = refSelect.current.value;
    store.dispatch(asyncIncrementAction(value, 1000));
  };
  return (
    <div>
      <h2>{store.getState()}</h2>
      <select ref={refSelect}>
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
      </select>
      &nbsp;
      <button onClick={increment}>+</button>&nbsp;
      <button onClick={decrement}>-</button>&nbsp;
      <button onClick={incrementIfOdd}>当前求和为奇数再加</button>&nbsp;
      <button onClick={incrementAsync}>异步加</button>&nbsp;
    </div>
  );
}
