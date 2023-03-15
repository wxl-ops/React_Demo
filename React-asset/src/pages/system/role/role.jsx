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
  TreeSelect,
  Cascader,
} from 'antd';
import { connect } from 'dva';
import Cselect from '@/components/cselect/cselect.jsx';
import Cupload from '@/components/cupload/cupload.jsx';

function role(props) {
  const columns = [
    {
      title: '序号',
      align: 'center',
      render: (text, row, index) => <div>{index + 1}</div>,
    },
    {
      title: '角色名称',
      dataIndex: 'name',
      prop: 'name',
      align: 'center',
      search: 'input',
    },
    {
      title: '角色简介',
      dataIndex: 'desc',
      prop: 'desc',
      align: 'center',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      prop: 'createTime',
      align: 'center',
      render: (time) => <span>{React.$getformat(time)}</span>,
    },
    {
      title: '创建人',
      dataIndex: 'username',
      prop: 'username',
      align: 'center',
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
              title={`您确定要删除：${row.name}吗？`}
              cancelText="取消"
              okText="确定"
              onConfirm={() => {
                handleDelete(row);
              }}
              okButtonProps={{ loading: roleData.loading }}
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
      disabled: record.name === 'Disabled role',
      name: record.name,
    }),
  };
  //---------------------------------------------------------------------------------------------------
  const { dispatch, login } = props;
  const [selectionType, setSelectionType] = useState('checkbox');
  const [roleData, setroledata] = useState({
    modeltitle: '',
    modalVisible: false,
    loading: false,
    pageNum: 1,
    pageSize: 10,
  });
  const handlesetroledata = (key, value) => {
    roleData[key] = value;
    setroledata({ ...roleData });
  };
  const [addForm] = Form.useForm();
  useEffect(async () => {
    await dispatch({ type: 'menu/getcataloguelist', payload: { isScreen: 1 } });
    handleSearch();
  }, []);
  //---------------------------------------------------------------------------------------------------
  const handleSearch = async (data) => {
    let obj = roleData;
    if (data) {
      obj = Object.assign(data, obj);
    }
    handlesetroledata('loading', true);
    await dispatch({ type: 'role/getrolelistforpage', payload: obj });
    handlesetroledata('loading', false);
  };
  //新增
  const handleAdd = (data) => {
    handlesetroledata('modeltitle', '新增');
    handlesetroledata('modalVisible', true);
  };
  //修改
  const handleChange = (data) => {
    if (data.catalogueIds) {
      data.catalogueIds = data.catalogueIds.split(',').map((item) => {
        return { value: Number(item) };
      });
    } else {
      data.catalogueIds = [];
    }
    addForm.setFieldsValue(data);
    handlesetroledata('modeltitle', '修改');
    handlesetroledata('modalVisible', true);
  };
  //查看
  const handleview = (data) => {
    data.catalogueIds = data.catalogueIds.split(',').map((item) => {
      return { value: Number(item) };
    });
    addForm.setFieldsValue(data);
    handlesetroledata('modeltitle', '查看');
    handlesetroledata('modalVisible', true);
  };
  //提交
  const onFinish = async () => {
    handlesetroledata('loading', true);
    let data = addForm.getFieldsValue(true);
    if (data.id) {
      await dispatch({ type: 'role/update', payload: data });
    } else {
      await dispatch({ type: 'role/inster', payload: data });
    }
    handleClose();
    handlesetroledata('loading', false);
  };
  //删除
  const handleDelete = async (data) => {
    handlesetroledata('loading', true);
    data.isDel = true;
    await dispatch({ type: 'role/delete', payload: data });
    handleSearch();
    handlesetroledata('loading', false);
  };
  //---------------------------------------------------------------------------------------------------
  const handleClose = (data) => {
    handleSearch();
    addForm.resetFields();
    handlesetroledata('modalVisible', false);
  };
  const handlePageSizeChange = (page, pageSize) => {
    handlesetroledata('pageNum', page);
    handlesetroledata('pageSize', pageSize);
    handleSearch();
  };
  return (
    <div>
      <Cselect tablelist={columns} search={handleSearch}></Cselect>
      {React.$getmark('deletes') ? (
        <Button className="button" type="primary">
          批量删除
        </Button>
      ) : null}
      {React.$getmark('inster') ? (
        <Button className="button" type="primary" onClick={handleAdd}>
          新增
        </Button>
      ) : null}
      <Table
        rowSelection={{
          type: selectionType,
          ...rowSelection,
        }}
        columns={columns}
        dataSource={props.role.list}
        loading={roleData.loading}
        pagination={{ position: ['none'] }}
        scroll={{ y: 570 }}
      />
      <Pagination
        className="pagination"
        total={props.role.page.totalSize}
        showTotal={(total) => `共 ${total} 条`}
        defaultCurrent={1}
        current={props.role.page.pageNum}
        defaultPageSize={10}
        pageSize={props.role.page.pageSize}
        onChange={handlePageSizeChange}
      />
      <Modal
        title={roleData.modeltitle}
        visible={roleData.modalVisible}
        onCancel={handleClose}
        maskClosable={false}
        footer={null}
      >
        <Form
          className="form"
          form={addForm}
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          size="small"
          autoComplete="off"
          onFinish={onFinish}
        >
          <Form.Item
            label="角色名称"
            name="name"
            rules={[{ required: true, message: '角色名称不能为空' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="备注"
            name="desc"
            rules={[{ required: false, message: '' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="权限"
            name="catalogueIds"
            rules={[{ required: false, message: '' }]}
          >
            <TreeSelect
              treeData={props.menu.list}
              fieldNames={{
                label: 'name',
                value: 'id',
                children: 'childrenList',
              }}
              treeCheckable={true}
              treeCheckStrictly={true}
              showCheckedStrategy="SHOW_ALL"
              placeholder="请选择权限"
            />
          </Form.Item>
        </Form>
        {roleData.modeltitle != '查看' ? (
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
export default connect(({ role, menu }) => {
  return { role, menu };
})(role);
