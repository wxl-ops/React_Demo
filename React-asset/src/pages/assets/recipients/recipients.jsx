import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  Space,
  Pagination,
  Popconfirm,
  Tabs,
  Row,
  Col,
  Menu,
  Badge,
  Descriptions,
} from 'antd';
const { TabPane } = Tabs;
import { CloseCircleOutlined } from '@ant-design/icons';
import { connect } from 'dva';
import Cselect from '@/components/cselect/cselect.jsx';
import Cupload from '@/components/cupload/cupload.jsx';

// import './assets.less'
function recipients(props) {
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
          {React.$getdictname(recipientsData.speciesmenu, type)}
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
          {React.$getdictname(recipientsData.speciestabs, typeTwo)}
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
      width: '200px',
      render: (time) => <span>{React.$getformat(time)}</span>,
    },
    {
      title: '当前所属人',
      dataIndex: 'username',
      prop: 'username',
      align: 'center',
    },
    {
      title: '操作',
      fixed: 'right',
      key: 'x',
      width: 300,
      align: 'center',
      render: (row) => (
        <Space>
          {React.$getmark('inster') ? (
            <Button
              onClick={() => {
                handleinfo(row);
              }}
              type="dashed"
            >
              申请领用
            </Button>
          ) : null}
        </Space>
      ),
    },
  ];
  const columns2 = [
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
    },
    {
      title: '类型',
      dataIndex: 'type',
      prop: 'type',
      align: 'center',
    },
    {
      title: '种类',
      dataIndex: 'typeTwo',
      prop: 'typeTwo',
      align: 'center',
    },
    {
      title: '名称',
      dataIndex: 'name',
      prop: 'name',
      align: 'center',
    },
    {
      title: '状态',
      dataIndex: 'role_id',
      prop: 'role_id',
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
          <Button
            type="dashed"
            onClick={() => {
              handleDelete(row);
            }}
          >
            取消
          </Button>
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
  const [recipientsData, setRecipients] = useState({
    modeltitle: '',
    modalVisible: false,
    loading: false,
    cascader: false,
    speciesmenu: [],
    speciestabs: [],
    assetslist: [],
    assetsinfo: {},
  });
  const handlesetRecipients = (key, value) => {
    recipientsData[key] = value;
    setRecipients({ ...recipientsData });
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
    await dispatch({ type: 'assets/getassetsall', payload: FormData });
    let res = await dispatch({ type: 'dict/info', payload: { fid: 8 } });
    if (res) {
      handlesetRecipients('speciesmenu', res);
      handlesetRecipients('type', res[0].value);
    }
  }, []);
  //---------------------------------------------------------------------------------------------------
  //查询
  const handleSearch = async (data) => {
    let obj = FormData;
    if (data) {
      obj = Object.assign(data, obj);
    }
    handlesetRecipients('loading', true);
    await dispatch({ type: 'assets/getassetsall', payload: obj });
    handlesetRecipients('loading', false);
  };
  //左侧菜单点击
  const handlemenuclick = async (data) => {
    handlesetRecipients('loading', true);
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
    handlesetRecipients('speciestabs', res);
    handlesetFormData('typeTwo', res[0].value);
    handleSearch();
    handlesetRecipients('loading', false);
  };
  //上层tabs点击
  const handletabsclick = async (data) => {
    handlesetFormData('typeTwo', data);
    handleSearch();
  };
  //查看
  const handleinfo = async (data) => {
    handlesetRecipients('loading', true);
    handlesetRecipients('assetsinfo', data);
    handlesetRecipients('modeltitle', '资产详情');
    handlesetRecipients('modalVisible', true);
    handlesetRecipients('loading', false);
  };
  //新增
  const handleAdd = (data) => {
    let arr = JSON.parse(JSON.stringify(recipientsData.assetslist));
    let index = arr.findIndex((item) => {
      return item.id == data.id;
    });
    if (index == -1) {
      arr.push(data);
      handlesetRecipients('assetslist', arr);
    }
  };
  //取消
  const handleDelete = async (data) => {
    let arr = JSON.parse(JSON.stringify(recipientsData.assetslist));
    arr.forEach((item, index) => {
      if (item.id === data.id) {
        arr.splice(index, 1);
      }
    });
    handlesetRecipients('assetslist', arr);
  };
  //提交
  const onFinish = async (data) => {
    handlesetRecipients('loading', true);
    let obj = {
      category: 1,
      // assetsId: recipientsData.assetslist.map(item => {
      //     return item.id
      // })
      assetsId: Number(recipientsData.assetsinfo.id),
    };
    await dispatch({ type: 'assets_process/inster', payload: obj });
    handleClose();
    handlesetRecipients('loading', false);
  };
  //---------------------------------------------------------------------------------------------------
  const handletypechange = async (value) => {
    let res = await dispatch({
      type: 'dict/info',
      payload: { fid: Number(value) },
    });
    handlesetRecipients('speciestabs', res);
  };
  const handleradiochange = async (e) => {
    if (e.target.value == 3) {
      await dispatch({ type: 'structure/structurelist' });
      addForm.setFieldsValue({ organizationId: '' });
      handlesetRecipients('cascader', true);
    }
  };
  const handleClose = (data) => {
    handleSearch();
    addForm.resetFields();
    handlesetRecipients('modalVisible', false);
    handlesetRecipients('cascader', false);
    handlesetRecipients('assetsinfo', {});
  };
  const handlePageSizeChange = (page, pageSize) => {
    console.log(page, pageSize);
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
            defaultSelectedKeys={recipientsData.type}
            defaultOpenKeys={recipientsData.type}
            mode="inline"
          >
            {recipientsData.speciesmenu.map((item) => {
              return <Menu.Item key={item.value}>{item.name}</Menu.Item>;
            })}
          </Menu>
        </Col>
        <Col span={21} className="mycol">
          <Cselect tablelist={columns} search={handleSearch}></Cselect>
          {/* <Badge count={recipientsData.assetslist.length} className="button">
            <Button
              type="primary"
              onClick={() => {
                handlesetRecipients('modalVisible', true);
              }}
            >
              已选择
            </Button>
          </Badge> */}
          <Tabs
            type="card"
            onChange={handletabsclick}
            activeKey={FormData.typeTwo}
          >
            {recipientsData.speciestabs.map((item) => (
              <TabPane tab={item.name} key={item.value} closable={false} />
            ))}
          </Tabs>
          <Table
            columns={columns}
            dataSource={props.assets.recipientlist}
            loading={recipientsData.loading}
            pagination={{ position: ['none'] }}
            scroll={{ y: 570 }}
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
        title={recipientsData.modeltitle}
        visible={recipientsData.modalVisible}
        onCancel={handleClose}
        width="50%"
        footer={null}
      >
        <Descriptions bordered column={2}>
          <Descriptions.Item label="类型">
            {React.$getdictname(
              recipientsData.speciesmenu,
              recipientsData.assetsinfo.type,
            )}
          </Descriptions.Item>
          <Descriptions.Item label="种类">
            {React.$getdictname(
              recipientsData.speciestabs,
              recipientsData.assetsinfo.typeTwo,
            )}
          </Descriptions.Item>
          <Descriptions.Item label="资产所属">
            {recipientsData.assetsinfo.username}
          </Descriptions.Item>
          <Descriptions.Item label="编号">
            {recipientsData.assetsinfo.number}
          </Descriptions.Item>
          <Descriptions.Item label="名称">
            {recipientsData.assetsinfo.name}
          </Descriptions.Item>
          <Descriptions.Item label="规格">
            {recipientsData.assetsinfo.specifications}
          </Descriptions.Item>
          <Descriptions.Item label="制造商">
            {recipientsData.assetsinfo.manufacturer}
          </Descriptions.Item>
          <Descriptions.Item label="原值">
            {recipientsData.assetsinfo.money}
          </Descriptions.Item>
          <Descriptions.Item label="月折旧额">
            {recipientsData.assetsinfo.depreciation}
          </Descriptions.Item>
          <Descriptions.Item label="存放地点">
            {recipientsData.assetsinfo.position}
          </Descriptions.Item>
          <Descriptions.Item label="是否可租借">
            {recipientsData.assetsinfo.isLease == 1 ? '可租借' : '不可租借'}
          </Descriptions.Item>
        </Descriptions>
        <div style={{ height: '20px' }}>
          <Popconfirm
            placement="topRight"
            title={`您确定要申请领用资产：${recipientsData.assetsinfo.name}吗？`}
            cancelText="取消"
            okText="确定"
            onConfirm={() => {
              onFinish();
            }}
            okButtonProps={{ loading: recipientsData.loading }}
          >
            <Button type="dashed" style={{ float: 'right' }}>
              确认申请
            </Button>
          </Popconfirm>
        </div>
      </Modal>
      {/* <Modal
        title="已选择领用的资产"
        width={'70%'}
        visible={recipientsData.modalVisible}
        onOk={onFinish}
        onCancel={handleClose}
      >
        <Table
          rowSelection={{ type: selectionType, ...rowSelection }}
          columns={columns2}
          dataSource={recipientsData.assetslist}
          loading={recipientsData.loading}
          pagination={{ position: ['none'] }}
          scroll={{ y: 570 }}
        />
      </Modal> */}
    </div>
  );
}
export default connect(({ assets, structure }) => {
  return { assets, structure };
})(recipients);
