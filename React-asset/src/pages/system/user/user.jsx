import React, { useState, useEffect, useRef } from 'react';
import {
  Table,
  Radio,
  Divider,
  Button,
  Modal,
  Form,
  Input,
  Select,
  Cascader,
  Space,
  Pagination,
  Popconfirm,
  Image,
} from 'antd';
import { connect } from 'dva';
import Cselect from '@/components/cselect/cselect.jsx';
import Cupload from '@/components/cupload/cupload.jsx';

import './user.less';
function user(props) {
  const columns = [
    {
      title: '序号',
      align: 'center',
      render: (text, row, index) => <div>{index + 1}</div>,
    },
    {
      title: '组织机构',
      dataIndex: 'organizationName',
      prop: 'organizationName',
      temp: 'organizationId',
      align: 'center',
      search: 'cascader',
    },
    {
      title: '头像',
      dataIndex: 'avatar',
      prop: 'avatar',
      align: 'center',
      render: (avatar) =>
        avatar ? (
          <Image width={70} src={`${process.env.UMI_ENV}${avatar}`} />
        ) : null,
    },
    {
      title: '姓名',
      dataIndex: 'nickname',
      prop: 'nickname',
      align: 'center',
    },
    {
      title: '用户名',
      dataIndex: 'username',
      prop: 'username',
      align: 'center',
    },
    {
      title: '角色',
      dataIndex: 'roleName',
      prop: 'roleName',
      temp: 'roleId',
      align: 'center',
      search: 'select',
    },
    {
      title: '电话',
      dataIndex: 'phone',
      prop: 'phone',
      align: 'center',
      search: 'input',
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      prop: 'email',
      align: 'center',
      search: 'input',
    },
    {
      title: '操作',
      fixed: 'right',
      key: 'x',
      width: 280,
      align: 'center',
      render: (row) => (
        <Space>
          {React.$getmark('view') ? (
            <Button
              type="dashed"
              onClick={() => {
                handleview(row);
              }}
            >
              查看
            </Button>
          ) : null}
          {React.$getmark('update') ? (
            <Button
              type="dashed"
              onClick={() => {
                handleChange(row);
              }}
            >
              修改
            </Button>
          ) : null}
          {React.$getmark('delete') ? (
            <Popconfirm
              placement="topRight"
              title={`您确定要删除账号：${row.nickname}吗？`}
              cancelText="取消"
              okText="确定"
              onConfirm={() => {
                handleDelete(row);
              }}
              okButtonProps={{ loading: userData.loading }}
            >
              <Button type="dashed" danger>
                删除
              </Button>
            </Popconfirm>
          ) : null}
        </Space>
      ),
    },
  ];
  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      console.log(
        `selectedRowKeys: ${selectedRowKeys}`,
        'selectedRows: ',
        selectedRows,
      );
    },
    getCheckboxProps: (record) => ({
      disabled: record.name === 'Disabled User',
      name: record.name,
    }),
  };
  const dictlist = [props.structure.list, props.role.list];
  //---------------------------------------------------------------------------------------------------
  const { dispatch, login } = props;
  const uploadRef = useRef();
  const [selectionType, setSelectionType] = useState('checkbox');
  const [userData, setUserdata] = useState({
    modeltitle: '',
    modalVisible: false,
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
  useEffect(async () => {
    await dispatch({ type: 'structure/structurelist' });
    await dispatch({ type: 'role/getrolelist' });
    handleSearch();
  }, []);
  //---------------------------------------------------------------------------------------------------

  const handleSearch = async (data) => {
    let obj = userData;
    if (data) {
      obj = Object.assign(data, obj);
    }
    handlesetUserdata('loading', true);
    await dispatch({ type: 'user/getuserlist', payload: obj });
    handlesetUserdata('loading', false);
  };
  //新增
  const handleAdd = (data) => {
    handlesetUserdata('modeltitle', '新增');
    handlesetUserdata('modalVisible', true);
  };
  //修改
  const handleChange = async (data) => {
    handlesetUserdata('loading', true);
    let res = await dispatch({ type: 'user/info', payload: { id: data.id } });
    addForm.setFieldsValue(res);
    handlesetUpload('avatar', res.avatar);
    handlesetUserdata('modeltitle', '修改');
    handlesetUserdata('modalVisible', true);
    handlesetUserdata('loading', false);
  };
  //查看
  const handleview = async (data) => {
    handlesetUserdata('loading', true);
    let res = await dispatch({ type: 'user/info', payload: { id: data.id } });
    addForm.setFieldsValue(res);
    handlesetUpload('avatar', res.avatar);
    handlesetUserdata('modeltitle', '查看');
    handlesetUserdata('modalVisible', true);
    handlesetUserdata('loading', false);
  };
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
    if (data.id) {
      await dispatch({ type: 'user/update', payload: data });
    } else {
      await dispatch({ type: 'user/inster', payload: data });
    }
    handleClose();
    handlesetUserdata('loading', false);
  };
  //删除
  const handleDelete = async (data) => {
    handlesetUserdata('loading', true);
    data.isDel = true;
    await dispatch({ type: 'user/delete', payload: data });
    handleSearch();
    handlesetUserdata('loading', false);
  };
  //---------------------------------------------------------------------------------------------------
  const handleClose = (data) => {
    handleSearch();
    addForm.resetFields();
    handlesetUpload('avatar', '');
    handlesetUserdata('modalVisible', false);
  };
  const handlePageSizeChange = (page, pageSize) => {
    handlesetUserdata('pageNum', page);
    handlesetUserdata('pageSize', pageSize);
    handleSearch();
  };

  return (
    <div>
      <Cselect
        tablelist={columns}
        dictlist={dictlist}
        search={handleSearch}
      ></Cselect>
      {React.$getmark('export') ? (
        <Button className="button" type="primary">
          批量导出
        </Button>
      ) : null}
      {React.$getmark('deletes') ? (
        <Button className="button" type="primary">
          {' '}
          批量删除{' '}
        </Button>
      ) : null}
      {React.$getmark('insters') ? (
        <Button className="button" type="primary">
          {' '}
          批量导入{' '}
        </Button>
      ) : null}
      {React.$getmark('inster') ? (
        <Button className="button" type="primary" onClick={handleAdd}>
          {' '}
          新增{' '}
        </Button>
      ) : null}
      <Table
        rowSelection={{
          type: selectionType,
          ...rowSelection,
        }}
        columns={columns}
        dataSource={props.user.list}
        loading={userData.loading}
        pagination={{ position: ['none'] }}
        scroll={{ y: 570 }}
      />
      <Pagination
        className="pagination"
        total={props.user.page.totalSize}
        showTotal={(total) => `共 ${total} 条`}
        defaultCurrent={1}
        current={props.user.page.pageNum}
        defaultPageSize={10}
        pageSize={props.user.page.pageSize}
        onChange={handlePageSizeChange}
      />
      <Modal
        title={userData.modeltitle}
        visible={userData.modalVisible}
        destroyOnClose={true}
        onCancel={handleClose}
        footer={null}
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
            label="组织机构"
            name="organizationIds"
            rules={[{ required: true, message: '用户名不能为空' }]}
          >
            <Cascader
              changeOnSelect
              expandTrigger="hover"
              placeholder="请选择组织机构"
              options={props.structure.list}
              fieldNames={{
                label: 'name',
                value: 'id',
                children: 'childrenList',
              }}
            />
          </Form.Item>
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
            <Input disabled={userData.modeltitle == '修改' ? true : false} />
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
          <Form.Item
            label="角色"
            name="roleId"
            rules={[{ required: true, message: '角色不能为空' }]}
          >
            <Select placeholder="请选择角色" allowClear>
              {props.role.list.map((item, index) => {
                return (
                  <Option value={item.id} key={index}>
                    {item.name}
                  </Option>
                );
              })}
            </Select>
          </Form.Item>
        </Form>
        {userData.modeltitle != '查看' ? (
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
        ) : null}
      </Modal>
    </div>
  );
}
export default connect(({ user, role, structure }) => {
  return { user, role, structure };
})(user);
