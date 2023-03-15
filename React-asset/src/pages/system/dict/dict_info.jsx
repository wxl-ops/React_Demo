import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Space,
  Pagination,
  PageHeader,
  InputNumber,
  Popconfirm,
} from 'antd';
import { connect } from 'dva';
import Cselect from '@/components/cselect/cselect.jsx';
import Cupload from '@/components/cupload/cupload.jsx';

function dictinfo(props) {
  const columns = [
    {
      title: '序号',
      align: 'center',
      render: (text, row, index) => <div>{index + 1}</div>,
    },
    {
      title: '详情名称（dictLabel）',
      dataIndex: 'name',
      prop: 'name',
    },
    {
      title: '数值（dictValue）',
      dataIndex: 'value',
      prop: 'value',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      prop: 'createTime',
      render: (time) => <span>{React.$getformat(time)}</span>,
    },
    {
      title: '创建人',
      dataIndex: 'username',
      prop: 'username',
    },
    {
      title: '备注',
      dataIndex: 'desc',
      prop: 'desc',
    },
    {
      title: '操作',
      fixed: 'right',
      key: 'x',
      width: 280,
      render: (row) => (
        <Space>
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
              title={`您确定要删除账号：${row.name}吗？`}
              cancelText="取消"
              okText="确定"
              onConfirm={() => {
                handleDelete(row);
              }}
              okButtonProps={{ loading: dictinfoData.loading }}
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
      disabled: record.name === 'Disabled dictinfo',
      name: record.name,
    }),
  };
  //---------------------------------------------------------------------------------------------------
  const { dispatch, login } = props;
  const [selectionType, setSelectionType] = useState('checkbox');
  const [dictinfoData, setdictinfodata] = useState({
    fid: '',
    name: '',
    modeltitle: '',
    modalVisible: false,
    loading: false,
  });
  const handlesetdictinfodata = (key, value) => {
    dictinfoData[key] = value;
    setdictinfodata({ ...dictinfoData });
  };
  const [addForm] = Form.useForm();
  useEffect(async () => {
    handlesetdictinfodata('fid', Number(props.location.query.id));
    handlesetdictinfodata('name', props.location.query.name);
    handleSearch();
  }, []);
  //---------------------------------------------------------------------------------------------------

  const handleSearch = async (data) => {
    handlesetdictinfodata('loading', true);
    await dispatch({ type: 'dict/info', payload: dictinfoData });
    handlesetdictinfodata('loading', false);
  };
  //新增
  const handleAdd = (data) => {
    addForm.setFieldsValue({ fid: dictinfoData.fid });
    handlesetdictinfodata('modeltitle', '新增');
    handlesetdictinfodata('modalVisible', true);
  };
  //修改
  const handleChange = async (data) => {
    addForm.setFieldsValue(data);
    handlesetdictinfodata('modeltitle', '修改');
    handlesetdictinfodata('modalVisible', true);
  };
  //提交
  const onFinish = async (value) => {
    handlesetdictinfodata('loading', true);
    let data = addForm.getFieldsValue(true);
    if (data.id) {
      await dispatch({ type: 'dict/update', payload: data });
    } else {
      await dispatch({ type: 'dict/inster', payload: data });
    }
    handleClose();
    handlesetdictinfodata('loading', false);
  };
  //删除
  const handleDelete = async (data) => {
    handlesetdictinfodata('loading', true);
    data.isDel = true;
    await dispatch({ type: 'dict/delete', payload: data });
    handleSearch();
    handlesetdictinfodata('loading', false);
  };

  //---------------------------------------------------------------------------------------------------
  const handleClose = (data) => {
    handleSearch();
    addForm.resetFields();
    handlesetdictinfodata('modalVisible', false);
  };
  const handlePageSizeChange = (page, pageSize) => {
    handlesetdictinfodata('pageNum', page);
    handlesetdictinfodata('pageSize', pageSize);
    handleSearch();
  };

  return (
    <div>
      <PageHeader
        className="site-page-header"
        onBack={() => props.history.go(-1)}
        title={dictinfoData.name}
        subTitle="字典详情"
      />
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
      </div>
      <Table
        rowSelection={{
          type: selectionType,
          ...rowSelection,
        }}
        columns={columns}
        dataSource={props.dict.list}
        loading={dictinfoData.loading}
        pagination={{ position: ['none'] }}
        scroll={{ y: 570 }}
      />
      <Modal
        title={dictinfoData.modeltitle}
        visible={dictinfoData.modalVisible}
        onOk={() => {
          addForm.submit();
        }}
        onCancel={handleClose}
      >
        <Form
          className="form"
          form={addForm}
          labelCol={{ span: 10 }}
          wrapperCol={{ span: 14 }}
          initialValues={{ remember: true }}
          size="small"
          autoComplete="off"
          onFinish={onFinish}
        >
          <Form.Item
            label="字典名称"
            name="fid"
            rules={[{ required: false, message: '' }]}
          >
            <Input disabled />
          </Form.Item>
          <Form.Item
            label="详情名称（dictLabel）"
            name="name"
            rules={[{ required: true, message: '字典项名称不能为空' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="数值（dictValue）"
            name="value"
            rules={[{ required: true, message: '字典项名称不能为空' }]}
          >
            <InputNumber min={0} max={100} keyboard={true} />
          </Form.Item>
          <Form.Item
            label="备注"
            name="desc"
            rules={[{ required: false, message: '' }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
export default connect(({ dict }) => {
  return { dict };
})(dictinfo);
