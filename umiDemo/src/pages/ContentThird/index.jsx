import React from 'react';
import Style from './index.less';
import { NavLink, history, Link } from 'umi';
export default function ContentThird(props) {
  console.log('@@@@@', props.history);
  console.log('$$$$$', props.match);
  console.log('$$$$$', props.location);
  const handleToNewPage = () => {
    console.log(1);
    history.push('/contentTwo');
  };
  // document.addEventListener('click', () => {
  //   history.push('/contentTwo/2');
  // });
  return (
    <div>
      <h2>Content</h2>
      <Link to="/contentTwo/2" replace>
        点我跳转contentTwo页面
      </Link>
      <NavLink to="/content?id=2">点我跳转content页面</NavLink>
      <button onClick={handleToNewPage}>点我跳转contentTwo页面</button>
    </div>
  );
}
