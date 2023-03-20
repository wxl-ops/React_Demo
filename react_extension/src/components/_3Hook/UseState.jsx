import React, { useState } from "react";

export default function UseState() {
  const [count, setCount] = useState(0);
  const handleAdd = () => {
    // setCount(count + 1);
    setCount((count) => count + 1);
  };
  return (
    <div>
      <h2>当前和为：{count}</h2>
      <button onClick={handleAdd}>点我加一</button>
    </div>
  );
}
