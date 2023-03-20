export default {
  '/api': {
    //要代理的真实服务器
    target: 'https://localhost:9001',
    https: true,
    changeOrigin: true,
    pathRewrite: { '^/api': '' },
  },
};
