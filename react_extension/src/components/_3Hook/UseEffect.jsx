import React, { useEffect, useState } from "react";
export default function UseEffect(props) {
  const [count, setCount] = useState(0);
  const handleAdd = () => {
    // setCount(count + 1);
    setCount((count) => count + 1);
  };
  useEffect(() => {
    const timer = setInterval(() => {
      setCount((count) => count + 1);
    }, 500);
    return () => {
      clearInterval(timer);
    };
  }, []);
  const handleDeath = () => {
    props.root.unmount();
  };
  return (
    <div>
      <h2>当前和为：{count}</h2>
      <button onClick={handleAdd}>点我加一</button>
      <button onClick={handleDeath}>点我销毁组件</button>
    </div>
  );
}
