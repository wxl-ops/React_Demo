import { defineConfig } from 'umi';
import routes from './routes.ts';
import theme from './theme.js';
import proxy from './proxy.ts';
export default defineConfig({
  proxy, //引入反向代理
  nodeModulesTransform: {
    // none不会编译node-modules目录下的依赖文件，如果是all属性就会编译，兼容性好，但是速度慢
    type: 'none',
  },
  routes: routes,
  // 快速编译，让浏览器快速的刷新，并且可以保持组件状态（保持数据，因为平常保存代码网页会刷新，状态丢失，使用这个配置项就不会丢失状态），同时编辑提供及时反馈。
  fastRefresh: {},
  devServer: {
    port: 8081, //.env里面权限更高一些
    //https:true,启用https安全访问，于对应协议服务器通讯
  },
  title: 'UMI3', //配置标题
  // favicon: '本地地址或线上地址'//使用本地的图片需要放到public文件中
  // umi默认打包会把所有文件分别打包成html,css,js文件。首屏压力很大，这时候就需要按需加载来缓解了
  dynamicImport: {
    loading: '@/components/Loading',
  }, //使用这个配置项就会出现分包文件

  mountElementId: 'app', //umi主页默认id为root，如果需要修改就要使用这个配置。
  // 自定义antd主题风格
  theme,
});
