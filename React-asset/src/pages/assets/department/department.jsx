import React, { useState, useEffect, useRef } from 'react';
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
  Radio,
  InputNumber,
  Cascader,
  DatePicker,
  Alert,
} from 'antd';
const { TabPane } = Tabs;
import { CloseCircleOutlined } from '@ant-design/icons';
import { connect } from 'dva';
import Cselect from '@/components/cselect/cselect.jsx';
import Cupload from '@/components/cupload/cupload.jsx';
import moment from 'moment';

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
          {React.$getdictname(departmentData.speciesmenu, type)}
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
          {React.$getdictname(departmentData.speciestabs, typeTwo)}
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
      width: '180px',
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
              okButtonProps={{ loading: departmentData.loading }}
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
      disabled: record.name === 'Disabled assets',
      name: record.name,
    }),
  };
  //---------------------------------------------------------------------------------------------------
  const { dispatch, login } = props;
  const uploadRef = useRef();
  const [selectionType, setSelectionType] = useState('checkbox');
  const [departmentData, setDepartment] = useState({
    modeltitle: '',
    modalVisible: false,
    modelexcel: false,
    loading: false,
    cascader: false,
    speciesmenu: [],
    speciestabs: [],
  });
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
  const handlesetDepartment = (key, value) => {
    departmentData[key] = value;
    setDepartment({ ...departmentData });
  };
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
    await dispatch({ type: 'assets/getdepartment', payload: FormData });
    let res = await dispatch({ type: 'dict/info', payload: { fid: 8 } });
    if (res) {
      handlesetDepartment('speciesmenu', res);
      handlesetDepartment('type', res[0].value);
    }
  }, []);
  //---------------------------------------------------------------------------------------------------
  //查询
  const handleSearch = async (data) => {
    let obj = FormData;
    if (data) {
      obj = Object.assign(data, obj);
    }
    handlesetDepartment('loading', true);
    await dispatch({ type: 'assets/getdepartment', payload: obj });
    handlesetDepartment('loading', false);
  };
  //左侧菜单点击
  const handlemenuclick = async (data) => {
    handlesetDepartment('loading', true);
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
    handlesetDepartment('speciestabs', res);
    handlesetFormData('typeTwo', res[0].value);
    handleSearch();
    handlesetDepartment('loading', false);
  };
  //上层tabs点击
  const handletabsclick = async (data) => {
    handlesetFormData('typeTwo', data);
    handleSearch();
  };
  // const handletabsadd = async () => {
  //     await dispatch({ type: 'dict/inster', payload: data })
  // }
  //新增
  const handleAdd = (data) => {
    handlesetDepartment('modeltitle', '新增');
    handlesetDepartment('modalVisible', true);
  };
  //查看
  const handleinfo = async (data) => {
    handlesetDepartment('loading', true);
    let formdata = JSON.parse(JSON.stringify(data));
    if (typeof formdata.startTime === 'string') {
      formdata.startTime = moment(formdata.startTime);
    }
    addForm.setFieldsValue(formdata);
    handlesetDepartment('modeltitle', '资产详情');
    handlesetDepartment('modalVisible', true);
    handlesetDepartment('loading', false);
  };
  //修改
  const handleChange = async (data) => {
    handlesetDepartment('loading', true);
    // let res = await dispatch({ type: 'assets/info', payload: { id: data.id } });
    let formdata = JSON.parse(JSON.stringify(data));
    if (typeof formdata.startTime === 'string') {
      formdata.startTime = moment(formdata.startTime);
    }
    addForm.setFieldsValue(formdata);
    handlesetDepartment('modeltitle', '修改');
    handlesetDepartment('modalVisible', true);
    handlesetDepartment('loading', false);
  };
  //提交
  const onFinish = async (value) => {
    handlesetDepartment('loading', true);
    let data = JSON.parse(JSON.stringify(addForm.getFieldsValue(true)));
    // data = Object.assign(data, uploadData);
    if (data.startTime) {
      let time = new Date(Date.parse(data.startTime));
      let YY = time.getFullYear();
      let MM = time.getMonth() + 1;
      let DD = time.getDate();
      data.startTime = `${YY}-${MM}-${DD}`;
    }
    if (data.id) {
      await dispatch({ type: 'assets/update', payload: data });
    } else {
      await dispatch({ type: 'assets/inster', payload: data });
    }
    handleClose();
    handlesetDepartment('loading', false);
  };
  //删除
  const handleDelete = async (data) => {
    handlesetDepartment('loading', true);
    data.isDel = true;
    await dispatch({ type: 'assets/delete', payload: data });
    handleSearch();
    handlesetDepartment('loading', false);
  };
  //---------------------------------------------------------------------------------------------------
  const handletypechange = async (value) => {
    let res = await dispatch({
      type: 'dict/info',
      payload: { fid: Number(value) },
    });
    handlesetDepartment('speciestabs', res);
  };
  const handleradiochange = async (e) => {
    if (e.target.value == 3) {
      await dispatch({ type: 'structure/structurelist' });
      addForm.setFieldsValue({ organizationId: '' });
      handlesetDepartment('cascader', true);
    }
  };
  const handleClose = (data) => {
    handleSearch();
    addForm.resetFields();
    handlesetDepartment('modalVisible', false);
    handlesetDepartment('modelexcel', false);
    handlesetDepartment('cascader', false);
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
            defaultSelectedKeys={departmentData.type}
            defaultOpenKeys={departmentData.type}
            mode="inline"
          >
            {departmentData.speciesmenu.map((item) => {
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
          {React.$getmark('scrap') ? (
            <Button className="button" type="primary">
              资产报废
            </Button>
          ) : null}
          {React.$getmark('export') ? (
            <Popconfirm
              placement="topRight"
              title={`您确定要导出所有资产信息吗？`}
              cancelText="取消"
              okText="确定"
              onConfirm={async () => {
                await dispatch({
                  type: 'cupload/exportassets',
                  payload: { type: '2' },
                });
              }}
              okButtonProps={{ loading: departmentData.loading }}
            >
              <Button className="button" type="primary">
                资产明细导出{' '}
              </Button>
            </Popconfirm>
          ) : null}
          {React.$getmark('deletes') ? (
            <Button className="button" type="primary">
              批量删除
            </Button>
          ) : null}
          {React.$getmark('insters') ? (
            <Button
              className="button"
              type="primary"
              onClick={() => {
                handlesetDepartment('modelexcel', true);
              }}
            >
              批量导入
            </Button>
          ) : null}
          {React.$getmark('inster') ? (
            <Button className="button" type="primary" onClick={handleAdd}>
              新增
            </Button>
          ) : null}
          <Tabs
            type="editable-card"
            onEdit={() => {}}
            onChange={handletabsclick}
            activeKey={FormData.typeTwo}
          >
            {departmentData.speciestabs.map((item) => (
              <TabPane tab={item.name} key={item.value} closable={false} />
            ))}
          </Tabs>
          <Table
            // rowSelection={{
            //   type: selectionType,
            //   ...rowSelection,
            // }}
            columns={columns}
            dataSource={props.assets.departmentlist}
            loading={departmentData.loading}
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
        title={departmentData.modeltitle}
        visible={departmentData.modalVisible}
        onCancel={handleClose}
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
            label="类型"
            name="type"
            rules={[{ required: true, message: '类型不能为空' }]}
          >
            <Select
              placeholder="请选择类型"
              allowClear
              onChange={handletypechange}
            >
              {departmentData.speciesmenu.map((item, index) => {
                return (
                  <Select.Option value={item.value} key={index}>
                    {item.name}
                  </Select.Option>
                );
              })}
            </Select>
          </Form.Item>
          <Form.Item
            label="种类"
            name="typeTwo"
            rules={[{ required: true, message: '类别不能为空' }]}
          >
            <Select placeholder="请选择种类" allowClear>
              {departmentData.speciestabs.map((item, index) => {
                return (
                  <Select.Option value={item.value} key={index}>
                    {item.name}
                  </Select.Option>
                );
              })}
            </Select>
          </Form.Item>
          <Form.Item
            label="资产所属"
            name="organizationId"
            rules={[{ required: true, message: '资产所属不能为空' }]}
          >
            {departmentData.cascader ? (
              <div>
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
                  style={{ width: '90%', marginRight: '8px' }}
                />
                <CloseCircleOutlined
                  onClick={() => {
                    handlesetDepartment('cascader', false);
                  }}
                />
              </div>
            ) : (
              <Radio.Group onChange={handleradiochange}>
                <Radio value={1}>集团资产部</Radio>
                <Radio value={999999}>本部门</Radio>
                {/* <Radio value={3}>其他</Radio> */}
              </Radio.Group>
            )}
          </Form.Item>
          <Form.Item
            label="编号"
            name="number"
            rules={[{ required: true, message: '编号不能为空' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="名称"
            name="name"
            rules={[{ required: true, message: '名称不能为空' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="规格"
            name="specifications"
            rules={[{ required: true, message: '规格不能为空' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="制造商"
            name="manufacturer"
            rules={[{ required: true, message: '制造商不能为空' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="原值"
            name="money"
            rules={[{ required: true, message: '原值不能为空' }]}
          >
            <InputNumber />
          </Form.Item>
          <Form.Item
            label="月折旧额"
            name="depreciation"
            rules={[{ required: true, message: '月折旧额不能为空' }]}
          >
            <InputNumber />
          </Form.Item>
          <Form.Item
            label="开始使用时间"
            name="startTime"
            rules={[{ required: true, message: '月折旧额不能为空' }]}
          >
            <DatePicker format="YYYY/MM/DD" />
          </Form.Item>
          <Form.Item
            label="存放地点"
            name="position"
            rules={[{ required: true, message: '存放地点不能为空' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="是否可租借"
            name="isLease"
            rules={[{ required: true, message: '是否可租借不能为空' }]}
          >
            <Radio.Group>
              <Radio value={1}>可租借</Radio>
              <Radio value={0}>不可租借</Radio>
            </Radio.Group>
          </Form.Item>
        </Form>
        {departmentData.modeltitle == '修改' ||
        departmentData.modeltitle == '新增' ? (
          <Button
            style={{ float: 'right', marginTop: '-20px' }}
            onClick={() => {
              addForm.submit();
            }}
          >
            提交
          </Button>
        ) : null}
      </Modal>
      <Modal
        title="批量导入"
        visible={departmentData.modelexcel}
        footer={null}
        onCancel={handleClose}
        width="450px"
      >
        <Cupload
          prop="avatar"
          type="excel"
          text="目前仅支持固定资产的批量导入。严禁上传公司资料或其他带文件"
          exceluploadsuccess={handleClose}
        />
        <Alert
          message="没有导入模板怎么办？"
          type="warning"
          showIcon
          action={
            <Button
              size="small"
              type="link"
              block
              onClick={async () => {
                await dispatch({ type: 'cupload/downloadFile' });
              }}
            >
              下载导入模板
            </Button>
          }
        />
      </Modal>
    </div>
  );
}
export default connect(({ assets, structure }) => {
  return { assets, structure };
})(department);
