import React from "react";
import { NavLink, Outlet } from "react-router-dom";

export default function Home() {
  return (
    <div>
      <h3>我是Home的内容</h3>
      <div>
        <ul class="nav nav-tabs">
          <li>
            <NavLink class="list-group-item" to="news">
              News
            </NavLink>
          </li>
          <li>
            <NavLink class="list-group-item" to="message">
              Message
            </NavLink>
          </li>
        </ul>
        <Outlet />
      </div>
    </div>
  );
}
