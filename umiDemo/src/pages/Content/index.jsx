import React from 'react';
import Style from './index.less';
import { Button } from 'antd';
import { history, NavLink, useHistory, useLocation } from 'umi';
export default function Content(props) {
  // document.addEventListener('click', () => {
  //   console.log(1);
  // });
  console.log('￥￥￥￥￥', useLocation());
  console.log('@@@@@', props.history);
  console.log('$$$$$', props.match);
  console.log('$$$$$', props.location);
  const handleToNewPage = () => {
    console.log(1);
    history.push('/contentTwo');
  };
  return (
    <div className={Style.content}>
      <h2>Content</h2>
      <NavLink to={{ pathname: '/contentThird', state: { id: 'hello' } }}>
        点我跳转content页面
      </NavLink>
      <button onClick={handleToNewPage}>点我跳转contentTwo页面</button>
    </div>
  );
}
