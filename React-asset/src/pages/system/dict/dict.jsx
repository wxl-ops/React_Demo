import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Space,
  Pagination,
  Popconfirm,
} from 'antd';
import { connect } from 'dva';
import Cselect from '@/components/cselect/cselect.jsx';
import Cupload from '@/components/cupload/cupload.jsx';

function dict(props) {
  const columns = [
    {
      title: '序号',
      align: 'center',
      render: (text, row, index) => <div>{index + 1}</div>,
    },
    {
      title: '字典项名称',
      align: 'center',
      render: (row) => (
        <Button
          type="link"
          onClick={() => {
            handleGodictinfo(row);
          }}
        >
          {row.name}
        </Button>
      ),
    },
    {
      title: '字典项标识',
      dataIndex: 'id',
      prop: 'id',
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
      title: '备注',
      dataIndex: 'desc',
      prop: 'desc',
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
              okButtonProps={{ loading: dictData.loading }}
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
      disabled: record.name === 'Disabled dict',
      name: record.name,
    }),
  };
  //---------------------------------------------------------------------------------------------------
  const { dispatch, login } = props;
  const [selectionType, setSelectionType] = useState('checkbox');
  const [dictData, setdictdata] = useState({
    modeltitle: '',
    modalVisible: false,
    loading: false,
    pageNum: 1,
    pageSize: 10,
  });
  const handlesetdictdata = (key, value) => {
    dictData[key] = value;
    setdictdata({ ...dictData });
  };
  const [addForm] = Form.useForm();
  useEffect(async () => {
    handleSearch();
  }, []);
  //---------------------------------------------------------------------------------------------------

  const handleSearch = async (data) => {
    let obj = dictData;
    if (data) {
      obj = Object.assign(data, obj);
    }
    handlesetdictdata('loading', true);
    await dispatch({ type: 'dict/getdictlist', payload: obj });
    handlesetdictdata('loading', false);
  };
  //新增
  const handleAdd = (data) => {
    addForm.setFieldsValue({ fid: 0 });
    handlesetdictdata('modeltitle', '新增');
    handlesetdictdata('modalVisible', true);
  };
  //修改
  const handleChange = async (data) => {
    addForm.setFieldsValue(data);
    handlesetdictdata('modeltitle', '修改');
    handlesetdictdata('modalVisible', true);
  };
  //提交
  const onFinish = async (value) => {
    handlesetdictdata('loading', true);
    let data = addForm.getFieldsValue(true);
    if (data.id) {
      await dispatch({ type: 'dict/update', payload: data });
    } else {
      await dispatch({ type: 'dict/inster', payload: data });
    }
    handleClose();
    handlesetdictdata('loading', false);
  };
  //删除
  const handleDelete = async (data) => {
    handlesetdictdata('loading', true);
    data.isDel = true;
    await dispatch({ type: 'dict/delete', payload: data });
    handleSearch();
    handlesetdictdata('loading', false);
  };
  //字典项详情
  const handleGodictinfo = (data) => {
    props.history.push({
      pathname: '/system/dict_info',
      query: { id: data.id, name: data.name },
    });
  };
  //---------------------------------------------------------------------------------------------------
  const handleClose = (data) => {
    handleSearch();
    addForm.resetFields();
    handlesetdictdata('modalVisible', false);
  };
  const handlePageSizeChange = (page, pageSize) => {
    handlesetdictdata('pageNum', page);
    handlesetdictdata('pageSize', pageSize);
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
        columns={columns}
        dataSource={props.dict.list}
        loading={dictData.loading}
        pagination={{ position: ['none'] }}
        scroll={{ y: 570 }}
      />
      <Pagination
        className="pagination"
        total={props.dict.page.totalSize}
        showTotal={(total) => `共 ${total} 条`}
        defaultCurrent={1}
        current={props.dict.page.pageNum}
        defaultPageSize={10}
        pageSize={props.dict.page.pageSize}
        onChange={handlePageSizeChange}
      />
      <Modal
        title={dictData.modeltitle}
        visible={dictData.modalVisible}
        maskClosable={false}
        onCancel={handleClose}
        cancelButtonProps={{ loading: dictData.loading }}
        onOk={() => {
          addForm.submit();
        }}
        okButtonProps={{ loading: dictData.loading }}
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
            label="父类"
            name="fid"
            rules={[{ required: false, message: '' }]}
          >
            <Input disabled />
          </Form.Item>
          <Form.Item
            label="字典项名称"
            name="name"
            rules={[{ required: true, message: '字典项名称不能为空' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="备注"
            name=" "
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
})(dict);
