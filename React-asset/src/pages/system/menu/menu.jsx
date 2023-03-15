import React, { useState, useEffect } from 'react';
import {
  Table,
  Radio,
  Button,
  Modal,
  Form,
  Input,
  Select,
  Space,
  Pagination,
  InputNumber,
  Switch,
  Popconfirm,
  Tag,
} from 'antd';
import {
  FolderOutlined,
  FileTextOutlined,
  PicCenterOutlined,
  ApiOutlined,
} from '@ant-design/icons';
import { connect } from 'dva';
import Cselect from '@/components/cselect/cselect.jsx';
import Cupload from '@/components/cupload/cupload.jsx';

import './menu.less';
function menu(props) {
  const columns = [
    {
      title: '序号',
      align: 'center',
      render: (text, row, index) => <div>{index + 1}</div>,
    },
    {
      title: '类型',
      dataIndex: 'status',
      prop: 'status',
      align: 'center',
      render: (status) =>
        status == 1 ? (
          <Tag icon={<FileTextOutlined />} color="#87d068">
            菜单
          </Tag>
        ) : status == 2 ? (
          <Tag icon={<PicCenterOutlined />} color="gold">
            按钮
          </Tag>
        ) : status == 3 ? (
          <Tag icon={<FolderOutlined />} color="#108ee9">
            文件夹
          </Tag>
        ) : (
          <Tag icon={<ApiOutlined />} color="purple">
            接口
          </Tag>
        ),
    },
    {
      title: '名称',
      dataIndex: 'name',
      prop: 'name',
      align: 'center',
    },
    {
      title: '显示状态',
      dataIndex: 'isShow',
      prop: 'isShow',
      align: 'center',
      render: (isShow) => (isShow ? <span>显示</span> : <span>隐藏</span>),
    },
    {
      title: 'path/mark',
      dataIndex: 'math',
      prop: 'math',
      align: 'center',
      width: 280,
    },
    {
      title: '相关接口',
      dataIndex: 'path',
      prop: 'path',
      align: 'center',
    },
    {
      title: '顺序',
      dataIndex: 'sort',
      prop: 'sort',
      width: 80,
      align: 'center',
    },
    {
      title: '状态',
      dataIndex: 'isDisable',
      prop: 'isDisable',
      width: 100,
      align: 'center',
      render: (isDisable, row) => (
        <span>
          {React.$getmark('update') ? (
            <Switch
              checkedChildren="启用"
              unCheckedChildren="停用"
              defaultChecked={isDisable}
              onChange={() => {
                handleSwitchchange(row);
              }}
            />
          ) : isDisable ? (
            <span style={{ color: '#2db7f5' }}>已启用</span>
          ) : (
            <span style={{ color: '#f50' }}>已停用</span>
          )}
        </span>
      ),
    },
    {
      title: '操作',
      fixed: 'right',
      key: 'x',
      width: 280,
      align: 'center',
      render: (row) => (
        <Space>
          {React.$getmark('inster') ? (
            row.status == 1 || row.status == 3 ? (
              <Button
                type="dashed"
                onClick={() => {
                  handleAdd(row);
                }}
              >
                {' '}
                新增
              </Button>
            ) : null
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
              title={`您确定要删除：${row.name}吗？`}
              cancelText="取消"
              okText="确定"
              onConfirm={() => {
                handleDelete(row);
              }}
              okButtonProps={{ loading: menuData.loading }}
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
      disabled: record.name === 'Disabled menu',
      name: record.name,
    }),
  };
  //---------------------------------------------------------------------------------------------------
  const { dispatch, menu } = props;
  const [selectionType, setSelectionType] = useState('checkbox');
  const [menuData, setmenudata] = useState({
    modalVisible: false,
    loading: false,
    modeltitle: '',
  });
  const handlesetmenudata = (key, value) => {
    menuData[key] = value;
    setmenudata({ ...menuData });
  };
  const [addForm] = Form.useForm();
  useEffect(async () => {
    handleSearch();
  }, []);
  //---------------------------------------------------------------------------------------------------
  //搜索
  const handleSearch = async (data) => {
    handlesetmenudata('loading', true);
    await dispatch({ type: 'menu/getcataloguelist', payload: { isScreen: 0 } });
    handlesetmenudata('loading', false);
  };
  //新增
  const handleAdd = (data) => {
    if (data) {
      addForm.setFieldsValue({
        fid: data.id,
      });
    } else {
      addForm.setFieldsValue({
        fid: '0',
      });
    }
    addForm.setFieldsValue({
      isDisable: true,
      isShow: true,
      isLimit: 0,
      sort: 1,
    });
    handlesetmenudata('modeltitle', '新增');
    handlesetmenudata('modalVisible', true);
  };
  //修改
  const handleChange = (data) => {
    addForm.setFieldsValue(data);
    handlesetmenudata('modeltitle', '修改');
    handlesetmenudata('modalVisible', true);
  };
  //提交
  const onFinish = async () => {
    handlesetmenudata('loading', true);
    let data = addForm.getFieldsValue(true);
    if (data.id) {
      await dispatch({ type: 'menu/update', payload: data });
    } else {
      await dispatch({ type: 'menu/inster', payload: data });
    }
    handleClose();
    handlesetmenudata('loading', false);
  };
  //删除
  const handleDelete = async (data) => {
    handlesetmenudata('loading', true);
    data.isDel = true;
    await dispatch({ type: 'menu/delete', payload: data });
    handleSearch();
    handlesetmenudata('loading', false);
  };
  //启/停用
  const handleSwitchchange = async (data) => {
    handlesetmenudata('loading', true);
    data.isDisable = !data.isDisable;
    await dispatch({ type: 'menu/update', payload: data });
    handleSearch();
    handlesetmenudata('loading', false);
  };
  //---------------------------------------------------------------------------------------------------
  const handleClose = (data) => {
    handleSearch();
    addForm.resetFields();
    handlesetmenudata('modalVisible', false);
  };

  return (
    <div>
      {React.$getmark('deletes') ? (
        <Button className="button" type="primary">
          批量删除
        </Button>
      ) : null}
      {React.$getmark('inster') ? (
        <Button
          className="button"
          type="primary"
          onClick={() => {
            handleAdd();
          }}
        >
          新增
        </Button>
      ) : null}
      <Table
        rowSelection={{
          type: selectionType,
          ...rowSelection,
        }}
        loading={menuData.loading}
        childrenColumnName="childrenList"
        columns={columns}
        dataSource={props.menu.list}
        pagination={{ position: ['none'] }}
        scroll={{ y: 570 }}
      />
      <Modal
        title={menuData.modeltitle}
        visible={menuData.modalVisible}
        maskClosable={false}
        onCancel={handleClose}
        cancelButtonProps={{ loading: menuData.loading }}
        onOk={() => {
          addForm.submit();
        }}
        okButtonProps={{ loading: menuData.loading }}
        okText="提交"
      >
        <Form
          className="form"
          form={addForm}
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          initialValues={{ remember: true }}
          size="small"
          autoComplete="off"
          onFinish={onFinish}
        >
          <Form.Item
            label="类型"
            name="status"
            rules={[{ required: true, message: '类型不能为空' }]}
          >
            <Radio.Group size="middle">
              <Radio.Button value="3" className="radio">
                文件夹
              </Radio.Button>
              <Radio.Button value="1" className="radio">
                菜单
              </Radio.Button>
              <Radio.Button value="2" className="radio">
                按钮
              </Radio.Button>
              <Radio.Button value="4" className="radio">
                接口
              </Radio.Button>
            </Radio.Group>
          </Form.Item>
          <Form.Item
            label="父节点Id"
            name="fid"
            rules={[{ required: true, message: '父节点不能为空' }]}
          >
            <Input disabled />
          </Form.Item>
          <Form.Item
            label="名称"
            name="name"
            rules={[{ required: true, message: '名称不能为空' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="path/mark"
            name="math"
            rules={[{ required: false, message: 'path/mark不能为空' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="相关接口"
            name="path"
            rules={[{ required: false, message: 'path/mark不能为空' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="备注"
            name="dsa"
            rules={[{ required: false, message: '' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="排序"
            name="sort"
            rules={[{ required: true, message: '排序不能为空' }]}
          >
            <InputNumber min={1} max={100} keyboard={true} />
          </Form.Item>
          <Form.Item
            label="状态"
            name="isDisable"
            rules={[{ required: true, message: '状态不能为空' }]}
          >
            <Select style={{ width: 120 }}>
              <Option value={true}>启动</Option>
              <Option value={false}>停用</Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="显示状态"
            name="isShow"
            rules={[{ required: true, message: '显示状态不能为空' }]}
          >
            <Select style={{ width: 120 }}>
              <Option value={true}>显示</Option>
              <Option value={false}>隐藏</Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="是否需要判断"
            name="isLimit"
            rules={[{ required: true, message: '是否需要判断不能为空' }]}
          >
            <Select style={{ width: 120 }}>
              <Option value={0}>需要</Option>
              <Option value={1}>不需要</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
export default connect(({ menu }) => {
  return { menu };
})(menu);
