import React from "react";
// import { useParams } from "react-router-dom";
import { useSearchParams, useLocation } from "react-router-dom";
import qs from "qs";

export default function Details() {
  // const params = useParams();
  // console.log(params);
  const searchL = useLocation();
  console.log(searchL);
  // console.log(qs.parse(searchL.search.slice(1)));
  // const [search, setSearch] = useSearchParams();
  return (
    <div>
      <ul>
        <li>消息编号：{searchL.state.id}</li>
        <li>消息编号：{searchL.state.id}</li>
        <li>消息编号：{searchL.state.id}</li>
        {/* <li>消息编号：{search.get("id")}</li>
        <li>消息编号：{search.get("title")}</li>
        <li>消息编号：{search.get("content")}</li> */}
        {/* <li>消息编号：{params.id}</li>
        <li>消息编号：{params.title}</li>
        <li>消息编号：{params.content}</li> */}
      </ul>
    </div>
  );
}
