import React from "react";

export default function Parent() {
  return (
    <div>
      <h1>我是A组件</h1>
      <Son render={(name) => <GrandSon name={name} />}>你好我是儿子</Son>
    </div>
  );
}
function Son(props) {
  const name = "xiaoming";
  return (
    <div>
      <h3>我是B组件</h3>
      {props.render(name)}
    </div>
  );
}
function GrandSon(props) {
  return <div>我是C组件，拿到的值是：{props.name}</div>;
}
