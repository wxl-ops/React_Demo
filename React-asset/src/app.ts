import { history } from 'umi';
import React from 'react';
import { notification } from 'antd';
import mark from '@/utils/mark.js';
import format from '@/utils/format.js';
import dictname from '@/utils/dictname.js';
import './app.less';
React.$getmark = mark.getmark;
React.$getformat = format.getformat;
React.$getdictname = dictname.getdictname;

export const onRouteChange = async ({ location, routes, action }: any) => {
  // console.log(document.hidden);

  let rolearr = JSON.parse(sessionStorage.getItem('rolearr'));
  let whitelist = ['/login', '/system', '/system/home'];
  let allowlist = whitelist.concat(rolearr);
  if (location.pathname === '/') {
    history.push('/login');
  } else {
    let token = sessionStorage.getItem('token');
    if (!token) {
      history.push('/login');
    } else {
      let index = allowlist.indexOf(location.pathname);
      if (index == -1) {
        let arr = [
          'topLeft',
          'topRight',
          'bottomLeft',
          'bottomRight',
          'bottom',
          'top',
          'topLeft',
          'topRight',
          'bottomLeft',
          'bottomRight',
          'bottom',
          'top',
        ];
        arr.forEach((item) => {
          notification['error']({
            message: `警告`,
            description: `你没有权限就别乱跑啦`,
            placement: item,
          });
        });
        history.push('/login');
      }
    }
  }
};
