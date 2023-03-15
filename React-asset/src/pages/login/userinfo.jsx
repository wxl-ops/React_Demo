import React, { useState, useEffect, useRef } from 'react';
import {
  Divider,
  Button,
  Form,
  Input,
  Select,
  Space,
  Image,
  Drawer,
  Menu,
  Avatar,
  Dropdown,
} from 'antd';
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  AlignLeftOutlined,
  UnorderedListOutlined,
  UserOutlined,
  DownOutlined,
} from '@ant-design/icons';
import { connect } from 'dva';
import Cupload from '@/components/cupload/cupload.jsx';
import { history } from 'umi';

function userinfo(props) {
  //---------------------------------------------------------------------------------------------------
  const { dispatch, login } = props;
  const uploadRef = useRef();
  const [userData, setUserdata] = useState({
    visible: false,
    loading: false,
    pageNum: 1,
    pageSize: 10,
  });
  const handlesetUserdata = (key, value) => {
    userData[key] = value;
    setUserdata({ ...userData });
  };
  const [uploadData, setUpload] = useState({
    avatar: '',
  });
  const handlesetUpload = (key, value) => {
    uploadData[key] = value;
    setUpload({ ...uploadData });
  };
  const [addForm] = Form.useForm();
  const usermenu = (
    <Menu>
      <Menu.Divider />
      <Menu.Item
        key="2"
        onClick={() => {
          hanldeUserinfo();
        }}
      >
        <span>个人中心</span>
      </Menu.Item>
      <Menu.Item
        key="3"
        onClick={() => {
          hanldeExit();
        }}
      >
        <span>退出</span>
      </Menu.Item>
    </Menu>
  );
  //---------------------------------------------------------------------------------------------------
  //提取文件
  const handlegetuploadlist = async (fileobj) => {
    handlesetUpload(Object.keys(fileobj)[0], fileobj[Object.keys(fileobj)[0]]);
    if (Object.keys(fileobj)[0] == 'avatar') {
      onFinish();
    }
  };
  //提交
  const onFinish = async () => {
    handlesetUserdata('loading', true);
    let data = addForm.getFieldsValue(true);
    data = Object.assign(data, uploadData);
    await dispatch({ type: 'user/update', payload: data });
    handlesetUserdata('loading', false);
  };
  // -----------------------------------------------------------------------------------------------------------
  const hanldeExit = (data) => {
    history.push('/login');
  };
  const hanldeUserinfo = () => {
    let data = JSON.parse(sessionStorage.getItem('userinfo'));
    data.password = '******';
    addForm.setFieldsValue(data);
    handlesetUpload('avatar', data.avatar);
    handlesetUserdata('visible', true);
  };
  return (
    <div>
      <Space>
        <Avatar
          src={`${process.env.UMI_ENV}${props.login.userinfo.avatar}`}
          style={{ backgroundColor: '#87d068' }}
        />
        <Dropdown
          overlay={usermenu}
          placement="bottomRight"
          arrow
          className="dropdown"
        >
          <a className="ant-dropdown-link">
            {props.login.userinfo.organizationName}_
            {props.login.userinfo.nickname}
            <DownOutlined />
          </a>
        </Dropdown>
      </Space>
      <Drawer
        title="个人中心"
        placement="right"
        width={600}
        onClose={() => {
          handlesetUserdata('visible', false);
        }}
        visible={userData.visible}
      >
        <Form
          className="form"
          form={addForm}
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          initialValues={{ remember: true }}
          size="small"
          autoComplete="off"
          onFinish={() => {
            uploadRef.current.submit();
          }}
        >
          <Form.Item
            label="头像"
            name="avatar"
            rules={[{ required: false, message: '用户名不能为空' }]}
          >
            <Cupload
              ref={uploadRef}
              submit={handlegetuploadlist}
              prop="avatar"
              fileList={uploadData.avatar}
            ></Cupload>
          </Form.Item>
          <Form.Item
            label="用户名"
            name="username"
            rules={[{ required: true, message: '用户名不能为空' }]}
          >
            <Input disabled={true} />
          </Form.Item>
          <Form.Item
            label="密码"
            name="password"
            rules={[{ required: true, message: '密码不能为空' }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            label="姓名"
            name="nickname"
            rules={[{ required: true, message: '姓名不能为空' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="电话"
            name="phone"
            rules={[{ required: false, message: '电话不能为空' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="邮箱"
            name="email"
            rules={[{ required: false, message: '邮箱不能为空' }]}
          >
            <Input />
          </Form.Item>
        </Form>
        <div className="modelfoot">
          <Space style={{ float: 'right' }}>
            <Button
              type="primary"
              onClick={() => {
                addForm.submit();
              }}
            >
              提交
            </Button>
          </Space>
        </div>
      </Drawer>
    </div>
  );
}
export default connect(({ login, userinfo }) => {
  return { login, userinfo };
})(userinfo);
