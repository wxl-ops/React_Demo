import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  Space,
  Tabs,
  Row,
  Col,
  Menu,
  Popconfirm,
} from 'antd';
const { TabPane } = Tabs;
import {
  AppstoreOutlined,
  BarsOutlined,
  MinusCircleOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { connect } from 'dva';
import Cselect from '@/components/cselect/cselect.jsx';
import Cupload from '@/components/cupload/cupload.jsx';

import './process_set.less';

function process_set(props) {
  const columns = [
    {
      title: '序号',
      align: 'center',
      render: (text, row, index) => <div>{index + 1}</div>,
    },
    {
      title: '流程名称',
      dataIndex: 'name',
      prop: 'name',
      align: 'center',
    },
    {
      title: '编辑人',
      dataIndex: 'nickname',
      prop: 'nickname',
      align: 'center',
    },
    {
      title: '备注',
      dataIndex: 'desc',
      prop: 'desc',
      align: 'center',
    },
    {
      title: '是否设定',
      dataIndex: 'infoid',
      prop: 'infoid',
      align: 'center',
      render: (text) =>
        text ? (
          <span style={{ color: '#2db7f5' }}>已设定</span>
        ) : (
          <span>未设定</span>
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
          {React.$getmark('view') ? (
            <Button
              type="dashed"
              onClick={() => {
                handleView(row);
              }}
            >
              查看
            </Button>
          ) : null}
          {React.$getmark('inster') ? (
            !row.infoid ? (
              <Button
                type="dashed"
                onClick={() => {
                  handleChange(row);
                }}
              >
                编辑{' '}
              </Button>
            ) : null
          ) : null}
          {React.$getmark('delete') ? (
            row.infoid ? (
              <Popconfirm
                placement="topRight"
                title={`您确定要删除${row.name}流程吗？`}
                cancelText="取消"
                okText="确定"
                onConfirm={() => {
                  handleDelete(row);
                }}
                okButtonProps={{ loading: process_setData.loading }}
              >
                <Button type="dashed" danger>
                  删除
                </Button>
              </Popconfirm>
            ) : null
          ) : null}
        </Space>
      ),
    },
  ];
  //---------------------------------------------------------------------------------------------------
  const { dispatch, login } = props;
  const [selectionType, setSelectionType] = useState('checkbox');
  const [process_setData, setprocess_setdata] = useState({
    loading: false,
    modalVisible: false,
    processtype: [],
    processtypeinfo: [],
    tabskey: 25,
    menukeys: 2,
    processType: '',
  });
  const handlesetprocess_setdata = (key, value) => {
    process_setData[key] = value;
    setprocess_setdata({ ...process_setData });
  };
  useEffect(async () => {
    await dispatch({ type: 'process_set/processlist' });
    let res = await dispatch({ type: 'dict/info', payload: { fid: 23 } });
    await dispatch({ type: 'process_set/processuserlist' });
    handlesetprocess_setdata('processtype', res);
  }, []);
  const [addForm] = Form.useForm();
  //---------------------------------------------------------------------------------------------------
  const handleSearch = async (data) => {
    handlesetprocess_setdata('loading', true);
    let res = await dispatch({
      type: 'dict/info',
      payload: { fid: process_setData.tabskey },
    });
    let payload = {
      type: process_setData.tabskey,
      organizationId: process_setData.menukeys,
      pageNum: '1',
      pageSize: '10',
      res,
    };
    let listdata = await dispatch({ type: 'process_set/list', payload });
    handlesetprocess_setdata('processtypeinfo', listdata);
    handlesetprocess_setdata('loading', false);
  };
  //流程类型点击
  const handletabs = (data) => {
    handlesetprocess_setdata('tabskey', data);
    handleSearch();
  };
  //组织结构点击
  const handlemenuclick = (data) => {
    handlesetprocess_setdata('menukeys', data.key);
    handleSearch();
  };
  //查看
  const handleView = async (data) => {
    handlesetprocess_setdata('loading', true);
    addForm.setFieldsValue(data);
    handlesetprocess_setdata('modeltitle', data.name);
    handlesetprocess_setdata('modeltype', '查看');
    handlesetprocess_setdata('modalVisible', true);
    handlesetprocess_setdata('loading', false);
  };
  //编辑
  const handleChange = async (data) => {
    handlesetprocess_setdata('loading', true);
    handlesetprocess_setdata('modeltitle', data.name);
    handlesetprocess_setdata('processType', data.value);
    handlesetprocess_setdata('modalVisible', true);
    handlesetprocess_setdata('loading', false);
  };
  //提交
  const onFinish = async (value) => {
    handlesetprocess_setdata('loading', true);
    let data = addForm.getFieldsValue(true);
    data.type = process_setData.tabskey;
    data.processType = process_setData.processType;
    data.organizationId = process_setData.menukeys;
    await dispatch({ type: 'process_set/inster', payload: data });
    handleClose();
    handlesetprocess_setdata('loading', false);
  };
  //删除
  const handleDelete = async (data) => {
    handlesetprocess_setdata('loading', true);
    await dispatch({ type: 'process_set/delete', payload: data });
    handleSearch();
    handlesetprocess_setdata('loading', false);
  };
  //---------------------------------------------------------------------------------------------------
  const handleClose = (data) => {
    handleSearch();
    addForm.resetFields();
    handlesetprocess_setdata('modeltype', '');
    handlesetprocess_setdata('modalVisible', false);
  };

  return (
    <div>
      <Row gutter={16}>
        <Col span={3}>
          <Menu
            onClick={handlemenuclick}
            menukeys={process_setData.menukeys}
            defaultOpenKeys={['sub1']}
            mode="inline"
          >
            {props.process_set.list.map((item) => {
              return <Menu.Item key={item.id}>{item.name}</Menu.Item>;
            })}
          </Menu>
        </Col>
        <Col span={21}>
          <Tabs
            tabskey={process_setData.tabskey}
            centered
            onChange={(e) => {
              handletabs(e);
            }}
          >
            {process_setData.processtype.map((item) => {
              return (
                <TabPane
                  tab={
                    <span>
                      {' '}
                      <BarsOutlined /> {item.name}{' '}
                    </span>
                  }
                  key={item.id}
                />
              );
            })}
          </Tabs>
          <Table
            columns={columns}
            dataSource={process_setData.processtypeinfo}
            loading={process_setData.loading}
            pagination={{ position: ['none'] }}
            scroll={{ y: 570 }}
          />
        </Col>
      </Row>
      <Modal
        title={process_setData.modeltitle}
        visible={process_setData.modalVisible}
        footer={null}
        onCancel={handleClose}
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
          <Form.List
            name="approvalUids"
            rules={[
              {
                validator: async (_, names) => {
                  if (!names || names.length < 1) {
                    return Promise.reject(new Error('审批人不能少于一人'));
                  }
                },
              },
            ]}
          >
            {(fields, { add, remove }, { errors }) => (
              <>
                {fields.map((field, index) => (
                  <Form.Item
                    label={index === 0 ? '流程审批人：' : index + 1}
                    required={false}
                    key={field.key}
                  >
                    <Form.Item
                      {...field}
                      validateTrigger={['onChange', 'onBlur']}
                      // rules={[
                      //     {
                      //         required: true,
                      //         whitespace: true,
                      //         message: "请选择审批人",
                      //     },
                      // ]}
                      noStyle
                    >
                      <Select
                        placeholder={`请选择第${index + 1}审批人`}
                        allowClear
                        style={{ width: '70%' }}
                      >
                        {props.process_set.userlist.map((item, index) => {
                          return (
                            <Option value={item.id} key={index}>
                              {item.nickname}
                            </Option>
                          );
                        })}
                      </Select>
                    </Form.Item>
                    {fields.length > 1 ? (
                      <MinusCircleOutlined
                        className="dynamic-delete-button"
                        onClick={() => remove(field.name)}
                      />
                    ) : null}
                  </Form.Item>
                ))}
                {process_setData.modeltype != '查看' ? (
                  <Form.Item>
                    <Button
                      className="addbutton"
                      type="dashed"
                      onClick={() => add()}
                      icon={<PlusOutlined />}
                    >
                      添加审批人
                    </Button>
                    <Form.ErrorList errors={errors} />
                  </Form.Item>
                ) : null}
              </>
            )}
          </Form.List>
          <Form.Item
            label="流程接收人："
            name="receiveUid"
            rules={[{ required: true, message: '角色名称不能为空' }]}
          >
            <Select placeholder={`请选择流程接收人`} allowClear>
              {props.process_set.userlist.map((item, index) => {
                return (
                  <Option value={item.id} key={index}>
                    {item.nickname}
                  </Option>
                );
              })}
            </Select>
          </Form.Item>
          <Form.Item
            label="备注："
            name="desc"
            rules={[{ required: false, message: '"备注不能为空' }]}
          >
            <Input />
          </Form.Item>
        </Form>
        {process_setData.modeltype != '查看' ? (
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
export default connect(({ process_set }) => {
  return { process_set };
})(process_set);
