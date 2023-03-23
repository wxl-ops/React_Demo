import React from 'react';
import Style from './index.less';
import { useLocation, useRouteMatch, useParams } from 'umi';
export default function ContentTwo(props) {
  console.log('￥￥￥￥￥', useParams());
  console.log('@@@@@', props.history);
  console.log('$$$$$', props.match);
  console.log('$$$$$', props.location);
  return (
    <div className={Style.content}>
      <h2>Content</h2>
      {/* <h2>路由传参为：{}</h2> */}
    </div>
  );
}
