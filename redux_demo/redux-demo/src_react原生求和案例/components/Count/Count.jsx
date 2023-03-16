import React, { useRef, useState } from "react";
// eslint-disable-next-line no-unused-vars
import store from "../../redux/store";
export default function Count() {
  const refSelect = useRef(null);
  const [count, setCount] = useState(0);
  const increment = () => {
    const value = refSelect.current.value;
    setCount(count + value * 1);
  };
  const decrement = () => {
    const value = refSelect.current.value;
    setCount(count - value * 1);
  };
  const incrementIfOdd = () => {
    const value = refSelect.current.value;
    if (count % 2) {
      setCount(count + value * 1);
    }
  };
  const incrementAsync = () => {
    const value = refSelect.current.value;
    setTimeout(() => {
      setCount(count + value * 1);
    }, 1000);
  };
  return (
    <div>
      <h2>{count}</h2>
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
