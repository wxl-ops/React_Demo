import { defineConfig } from 'umi';
import React from 'react';
import router from './src/routes';
export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  history: {
    type: 'hash',
  },
  // base: "/asd/",
  publicPath: '/photovoltaic/',
  runtimePublicPath: true,
  routes: router,
  fastRefresh: {},
  proxy: {
    '/public': {
      // target: process.env.SOCKET_SERVER,
      // target: 'http://192.168.2.200:10000/assets/',
      target: 'http://192.168.2.130:10002',
      // target: 'http://192.168.2.121:10002',
      secure: false,
      changeOrigin: true,
      pathRewrite: { '/public': '' },
    },
  },
});
