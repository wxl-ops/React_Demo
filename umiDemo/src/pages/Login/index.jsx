import React from 'react';
import { Button } from 'antd';
import { history, Link } from 'umi';
export default function Login() {
  const handleLogin = () => {
    console.log(1);
    history.push('/content');
  };
  return (
    <div>
      <button onClick={handleLogin}>点击登录！！</button>
      {/* <Link to="/content">登录</Link> */}
    </div>
  );
}
