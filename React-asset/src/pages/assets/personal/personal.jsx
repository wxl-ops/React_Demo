import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Modal,
  Space,
  Pagination,
  Popconfirm,
  Tabs,
  Row,
  Col,
  Menu,
  Descriptions,
  Form,
  Select,
  Input,
} from 'antd';
const { TabPane } = Tabs;
import { CloseCircleOutlined } from '@ant-design/icons';
import { connect } from 'dva';
import Cselect from '@/components/cselect/cselect.jsx';
import Cupload from '@/components/cupload/cupload.jsx';

// import './assets.less'
function department(props) {
  const columns = [
    {
      title: '序号',
      align: 'center',
      render: (text, row, index) => <div>{index + 1}</div>,
    },
    {
      title: '编号',
      dataIndex: 'number',
      prop: 'number',
      align: 'center',
      search: 'input',
    },
    {
      title: '类型',
      dataIndex: 'type',
      prop: 'type',
      align: 'center',
      render: (type) => (
        <span style={{ color: '#2db7f5' }}>
          {React.$getdictname(personalData.speciesmenu, type)}
        </span>
      ),
    },
    {
      title: '种类',
      dataIndex: 'typeTwo',
      prop: 'typeTwo',
      align: 'center',
      render: (typeTwo) => (
        <span style={{ color: '#2db7f5' }}>
          {React.$getdictname(personalData.speciestabs, typeTwo)}
        </span>
      ),
    },
    {
      title: '名称',
      dataIndex: 'name',
      prop: 'name',
      align: 'center',
      search: 'input',
    },
    {
      title: '原值',
      dataIndex: 'money',
      prop: 'money',
      align: 'center',
    },
    {
      title: '状态',
      dataIndex: 'status',
      prop: 'status',
      align: 'center',
      search: 'select',
      render: (status) => (
        <span style={{ color: '#2db7f5' }}>
          {React.$getdictname(statuslist, status)}
        </span>
      ),
    },
    {
      title: '入库时间',
      dataIndex: 'createTime',
      prop: 'createTime',
      align: 'center',
      render: (time) => <span>{React.$getformat(time)}</span>,
    },
    // {
    //   title: '当前所属人',
    //   dataIndex: 'username',
    //   prop: 'username',
    //   align: 'center',
    // },
    {
      title: '操作',
      fixed: 'right',
      key: 'x',
      width: 300,
      align: 'center',
      render: (row) => (
        <Space>
          {React.$getmark('view') ? (
            <Button
              type="dashed"
              onClick={() => {
                handleinfo(row);
              }}
            >
              查看
            </Button>
          ) : null}
          {React.$getmark('repair') ? (
            <Button
              type="dashed"
              onClick={() => {
                handlerepair(row);
              }}
            >
              报修
            </Button>
          ) : null}
          {React.$getmark('migration') ? (
            <Button
              type="dashed"
              onClick={() => {
                handlemigration(row);
              }}
            >
              迁移
            </Button>
          ) : null}

          {React.$getmark('delete') ? (
            <Popconfirm
              placement="topRight"
              title={`您确定回退资产：${row.name}吗？`}
              cancelText="取消"
              okText="确定"
              onConfirm={() => {
                handleDelete(row);
              }}
              okButtonProps={{ loading: personalData.loading }}
            >
              <Button type="dashed" danger>
                回退
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
      disabled: record.name === 'Disabled assets',
      name: record.name,
    }),
  };
  //---------------------------------------------------------------------------------------------------
  const { dispatch, login } = props;
  const [selectionType, setSelectionType] = useState('checkbox');
  const [personalData, setPersonal] = useState({
    modeltitle: '',
    modalVisible: false,
    loading: false,
    cascader: false,
    speciesmenu: [],
    speciestabs: [],
    assetsinfo: {},
  });
  const handlesetPersonal = (key, value) => {
    personalData[key] = value;
    setPersonal({ ...personalData });
  };
  const statuslist = [
    {
      name: '在库',
      value: 0,
    },
    {
      name: '被领用',
      value: 1,
    },
    {
      name: '被租赁',
      value: 2,
    },
    {
      name: '报修',
      value: 3,
    },
    {
      name: '报废',
      value: 4,
    },
  ];
  const dictlist = [statuslist];
  const [FormData, setFormData] = useState({
    pageNum: 1,
    pageSize: 10,
    type: null,
    typeTwo: null,
  });
  const handlesetFormData = (key, value) => {
    FormData[key] = value;
    setFormData({ ...FormData });
  };
  const [addForm] = Form.useForm();
  useEffect(async () => {
    await dispatch({ type: 'assets/getuserassets', payload: FormData });
    let res = await dispatch({ type: 'dict/info', payload: { fid: 8 } });
    if (res) {
      handlesetPersonal('speciesmenu', res);
      handlesetPersonal('type', res[0].value);
    }
  }, []);
  //---------------------------------------------------------------------------------------------------
  //查询
  const handleSearch = async (data) => {
    let obj = FormData;
    if (data) {
      obj = Object.assign(data, obj);
    }
    handlesetPersonal('loading', true);
    await dispatch({ type: 'assets/getuserassets', payload: obj });
    handlesetPersonal('loading', false);
  };
  //左侧菜单点击
  const handlemenuclick = async (data) => {
    handlesetPersonal('loading', true);
    handlesetFormData('type', data.key);
    let res = await dispatch({
      type: 'dict/info',
      payload: { fid: Number(data.key) },
    });
    if (res) {
      res.unshift({
        name: '全部',
        value: null,
      });
    }
    handlesetPersonal('speciestabs', res);
    handlesetFormData('typeTwo', res[0].value);
    handleSearch();
    handlesetPersonal('loading', false);
  };
  //上层tabs点击
  const handletabsclick = async (data) => {
    handlesetFormData('typeTwo', data);
    handleSearch();
  };
  //查看
  const handleinfo = async (data) => {
    handlesetPersonal('loading', true);
    handlesetPersonal('assetsinfo', data);
    handlesetPersonal('modeltitle', '资产详情');
    handlesetPersonal('modalVisible', true);
    handlesetPersonal('loading', false);
  };
  //报修
  const handlerepair = async (data) => {
    addForm.setFieldsValue({
      assetsId: Number(data.id),
    });
    handlesetPersonal('assetsinfo', data);
    handlesetPersonal('modeltitle', '资产报修');
    handlesetPersonal('modalVisible', true);
  };
  //迁移
  const handlemigration = async (data) => {
    await dispatch({ type: 'process_set/processuserlist' });
    addForm.setFieldsValue({
      assetsId: Number(data.id),
    });
    handlesetPersonal('assetsinfo', data);
    handlesetPersonal('modeltitle', '资产迁移');
    handlesetPersonal('modalVisible', true);
  };
  const onFinish = async () => {
    // 1领用，2租借，3保修，4迁移，5回退
    handlesetPersonal('loading', true);
    let obj = JSON.parse(JSON.stringify(addForm.getFieldsValue(true)));
    if (personalData.modeltitle == '资产报修') {
      obj.category = 3;
    } else if (personalData.modeltitle == '资产迁移') {
      obj.category = 4;
    }
    await dispatch({ type: 'assets_process/inster', payload: obj });
    handleClose();
    handlesetPersonal('loading', false);
  };
  //回退
  const handleDelete = async (data) => {
    // 1领用，2租借，3保修，4迁移，5回退
    handlesetPersonal('loading', true);
    let obj = {
      category: 5,
      assetsId: Number(data.id),
    };
    await dispatch({ type: 'assets_process/inster', payload: obj });
    handleSearch();
    handlesetPersonal('loading', false);
  };
  //---------------------------------------------------------------------------------------------------
  const handleClose = (data) => {
    handleSearch();
    addForm.resetFields();
    handlesetPersonal('modeltitle', '');
    handlesetPersonal('modalVisible', false);
    handlesetPersonal('cascader', false);
  };
  const handlePageSizeChange = (page, pageSize) => {
    handlesetFormData('pageNum', page);
    handlesetFormData('pageSize', pageSize);
    handleSearch();
  };

  return (
    <div>
      <Row gutter={16}>
        <Col span={3}>
          <Menu
            onClick={handlemenuclick}
            defaultSelectedKeys={personalData.type}
            defaultOpenKeys={personalData.type}
            mode="inline"
          >
            {personalData.speciesmenu.map((item) => {
              return <Menu.Item key={item.value}>{item.name}</Menu.Item>;
            })}
          </Menu>
        </Col>
        <Col span={21} className="mycol">
          <Cselect
            tablelist={columns}
            dictlist={dictlist}
            search={handleSearch}
          ></Cselect>
          {React.$getmark('export') ? (
            <Popconfirm
              placement="topRight"
              title={`您确定要导出所有资产信息吗？`}
              cancelText="取消"
              okText="确定"
              onConfirm={async () => {
                await dispatch({
                  type: 'cupload/exportassets',
                  payload: { type: '3' },
                });
              }}
              okButtonProps={{ loading: personalData.loading }}
            >
              <Button className="button" type="primary">
                资产明细导出{' '}
              </Button>
            </Popconfirm>
          ) : null}
          <Tabs
            type="card"
            onEdit={() => {}}
            onChange={handletabsclick}
            activeKey={FormData.typeTwo}
          >
            {personalData.speciestabs.map((item) => (
              <TabPane tab={item.name} key={item.value} closable={false} />
            ))}
          </Tabs>
          <Table
            // rowSelection={{
            //   type: selectionType,
            //   ...rowSelection,
            // }}
            columns={columns}
            dataSource={props.assets.userassetslist}
            loading={personalData.loading}
            pagination={{ position: ['none'] }}
            scroll={{ x: 1500, y: 570 }}
          />
          <Pagination
            className="pagination2"
            total={props.assets.page.totalSize}
            showTotal={(total) => `共 ${total} 条`}
            defaultCurrent={1}
            current={props.assets.page.pageNum}
            defaultPageSize={10}
            pageSize={props.assets.page.pageSize}
            onChange={handlePageSizeChange}
          />
        </Col>
      </Row>
      <Modal
        title={personalData.modeltitle}
        visible={personalData.modalVisible}
        onCancel={handleClose}
        width="50%"
        footer={null}
      >
        <Descriptions bordered column={2}>
          <Descriptions.Item label="类型">
            {React.$getdictname(
              personalData.speciesmenu,
              personalData.assetsinfo.type,
            )}
          </Descriptions.Item>
          <Descriptions.Item label="种类">
            {React.$getdictname(
              personalData.speciestabs,
              personalData.assetsinfo.typeTwo,
            )}
          </Descriptions.Item>
          <Descriptions.Item label="资产所属">
            {personalData.assetsinfo.organizationId}
          </Descriptions.Item>
          <Descriptions.Item label="编号">
            {personalData.assetsinfo.number}
          </Descriptions.Item>
          <Descriptions.Item label="名称">
            {personalData.assetsinfo.name}
          </Descriptions.Item>
          <Descriptions.Item label="规格">
            {personalData.assetsinfo.specifications}
          </Descriptions.Item>
          <Descriptions.Item label="制造商">
            {personalData.assetsinfo.manufacturer}
          </Descriptions.Item>
          <Descriptions.Item label="原值">
            {personalData.assetsinfo.money}
          </Descriptions.Item>
          <Descriptions.Item label="月折旧额">
            {personalData.assetsinfo.depreciation}
          </Descriptions.Item>
          <Descriptions.Item label="存放地点">
            {personalData.assetsinfo.position}
          </Descriptions.Item>
          <Descriptions.Item label="是否可租借">
            {personalData.assetsinfo.isLease == 1 ? '可租借' : '不可租借'}
          </Descriptions.Item>
        </Descriptions>
        <Form
          form={addForm}
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          size="small"
          autoComplete="off"
          onFinish={onFinish}
        >
          {personalData.modeltitle == '资产迁移' ? (
            <Form.Item
              label="迁移接收人："
              name="transferUid"
              rules={[{ required: true, message: '迁移接收人：不能为空' }]}
            >
              <Select placeholder={`请选择迁移接收人`} allowClear>
                {props.process_set.userlist.map((item, index) => {
                  return (
                    <Select.Option value={item.id} key={index}>
                      {item.nickname}
                    </Select.Option>
                  );
                })}
              </Select>
            </Form.Item>
          ) : personalData.modeltitle == '资产报修' ? (
            <Form.Item
              label="报修原因："
              name="desc"
              rules={[{ required: true, message: '报修原因不能为空' }]}
            >
              <Input />
            </Form.Item>
          ) : null}
        </Form>
        {personalData.modeltitle != '资产详情' ? (
          <Button
            type="primary"
            onClick={() => {
              addForm.submit();
            }}
            style={{ marginLeft: '90%' }}
          >
            提交
          </Button>
        ) : null}
      </Modal>
    </div>
  );
}
export default connect(({ assets, process_set }) => {
  return { assets, process_set };
})(department);
