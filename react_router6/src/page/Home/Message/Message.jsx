import React from "react";
import { Link, Outlet } from "react-router-dom";
let message = [
  { id: "001", title: "古诗", content: "好诗好诗" },
  { id: "002", title: "音乐", content: "美妙美妙" },
  { id: "003", title: "菜谱", content: "回味回味" },
];
export default function Message() {
  return (
    <div>
      <ul>
        {message.map((item) => {
          const { id, title, content } = item;
          return (
            <li key={item.id}>
              <Link to={`details`} state={item}>
                {item.title}
              </Link>
              &nbsp;&nbsp;
            </li>
          );
        })}
      </ul>
      <Outlet />
    </div>
  );
}
