// 引入请求对象

import axios from 'axios';
import { history } from 'umi';
import { notification } from 'antd';
// 将后台服务统一前缀作为基本配置，设置之后调用this.$http()
axios.defaults.baseURL = '/public';

// 添加请求拦截器,所有在项目其他部分使用axios的地方都会触发拦截器的执行
axios.interceptors.request.use(
  function (config) {
    // console.log('拦截器执行')
    // console.log('请求的路径是',config.url)
    // 当用户登录之后会在sessionStorage中存token的值，token就会有值
    let token = sessionStorage.token;
    if (token) {
      // 通过jwt方式验证token的参数携带规则如下
      config.headers['token'] = token;
    }
    // 在发送请求之前做些什么
    return config;
  },
  function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  },
);

// 添加响应拦截器，所有在项目其他部分使用axios的地方都会触发拦截器的执行
axios.interceptors.response.use(
  function (response) {
    const res = response.data;
    // 对响应数据做点什么    // console.log(response);
    console.log();
    if (res.code == 200 || response.config.responseType === 'blob') {
      return res;
    } else {
      // 当请求失败时统一拦截进行提示
      if (res.code == 401) {
        notification['warning']({
          message: '错误',
          description: `登录超时，请重新登录`,
        });
        history.push('/login');
      } else {
        notification['error']({
          message: '错误',
          description: `${res.msg || 'Server error'}`,
        });
      }
      return false;
    }
  },
  function (error) {
    // 对响应错误做点什么
    notification['error']({
      message: '错误',
      description: `${error || 'Server error'}`,
    });
    return Promise.reject(error);
  },
);

export default axios;
