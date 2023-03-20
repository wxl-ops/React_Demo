import React, { useState } from "react";
import { Navigate } from "react-router-dom";
export default function About() {
  const [count, setCount] = useState(0);
  return (
    <div>
      <h3>我是About的内容,{count}</h3>
      {(() => {
        if (count === 2) {
          return <Navigate to="/home" replace />;
        }
      })()}
      <button onClick={() => setCount(2)}>点我count=2</button>
    </div>
  );
}
