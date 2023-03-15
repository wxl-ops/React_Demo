import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Carousel } from 'antd';
import { connect } from 'dva';
import { UserOutlined, KeyOutlined } from '@ant-design/icons';
import login_logo from '@/assets/logo/login_logo.png';
import login1 from '@/assets/image/login1.jpg';
import login2 from '@/assets/image/login2.jpg';
import login3 from '@/assets/image/login3.jpg';
import login4 from '@/assets/image/login4.jpg';

import './login.less';
function login(props) {
  const { dispatch, login } = props;
  const [loading, setloading] = useState(false);
  useEffect(() => {
    sessionStorage.setItem('tabslist', []);
    sessionStorage.setItem('userinfo', {});
    sessionStorage.setItem('rolelist', []);
  }, []);
  const onFinish = async (values) => {
    setloading(true);
    let res = await dispatch({ type: 'login/login', payload: values });
    if (res) {
      props.history.push('/system/home');
    }
    setloading(false);
  };
  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };
  return (
    <div>
      <Carousel className="bg" autoplay dotPosition="right">
        <div>
          <img src={login2} alt="" className="bgimg" />
        </div>
        <div>
          <img src={login3} alt="" className="bgimg" />
        </div>
        <div>
          <img src={login4} alt="" className="bgimg" />
        </div>
        <div>
          <img src={login1} alt="" className="bgimg" />
        </div>
      </Carousel>
      <div>
        <img src={login_logo} alt="" className="logo" />
        <span className="logospan">(国营754厂)</span>
      </div>
      <div className="zhuangshi"></div>
      <div className="loginborder">
        <div className="textlogo">登录</div>
        <div className="textlogozhuangshi"></div>
        <Form
          name="basic"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            style={{ color: '#fff' }}
            name="username"
            rules={[{ required: true, message: '用户名不能为空' }]}
          >
            <Input
              placeholder="用户名："
              prefix={<UserOutlined />}
              bordered={true}
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: '密码不能为空' }]}
          >
            <Input.Password
              placeholder="密码："
              prefix={<KeyOutlined />}
              bordered={true}
            />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              className="submitbut"
            >
              登录
            </Button>
          </Form.Item>
        </Form>
        <span className="footer">
          ©2022 天津光电集团有限公司_研发中心R & D Center
        </span>
      </div>
    </div>
  );
}
export default connect(({ login }) => {
  return { login };
})(login);
