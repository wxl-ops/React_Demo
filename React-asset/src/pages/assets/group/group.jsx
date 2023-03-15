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
  Descriptions,
  DatePicker,
  Alert,
} from 'antd';
const { TabPane } = Tabs;
import { CloseCircleOutlined } from '@ant-design/icons';
import { connect } from 'dva';
import Cselect from '@/components/cselect/cselect.jsx';
import Cupload from '@/components/cupload/cupload.jsx';
import moment from 'moment';
import './group.less';
function group(props) {
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
          {React.$getdictname(groupData.speciesmenu, type)}
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
          {React.$getdictname(groupData.speciestabs, typeTwo)}
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
          {React.$getmark('binding') ? (
            row.uid != 0 ? (
              FormData.type == 14 ? (
                <Popconfirm
                  placement="topRight"
                  title={`您确定要解除绑定资产：${row.name}吗？`}
                  cancelText="取消"
                  okText="确定"
                  onConfirm={() => {
                    handlehandleBinding(row, true);
                  }}
                  okButtonProps={{ loading: groupData.loading }}
                >
                  <Button type="dashed" danger>
                    {' '}
                    解除绑定{' '}
                  </Button>
                </Popconfirm>
              ) : null
            ) : null
          ) : null}
          {React.$getmark('binding') ? (
            row.uid == 0 ? (
              FormData.type == 14 ? (
                <Button
                  type="dashed"
                  onClick={() => {
                    handleinfo(row);
                  }}
                >
                  {' '}
                  用户绑定{' '}
                </Button>
              ) : null
            ) : null
          ) : null}
          {React.$getmark('view') ? (
            <Button
              type="dashed"
              onClick={() => {
                handleinfo(row, 1);
              }}
            >
              {' '}
              查看{' '}
            </Button>
          ) : null}
          {React.$getmark('update') ? (
            <Button
              type="dashed"
              onClick={() => {
                handleChange(row);
              }}
            >
              {' '}
              修改{' '}
            </Button>
          ) : null}
          {React.$getmark('delete') ? (
            <Popconfirm
              placement="topRight"
              title={`您确定要删除资产：${row.name}吗？`}
              cancelText="取消"
              okText="确定"
              onConfirm={() => {
                handleDelete(row);
              }}
              okButtonProps={{ loading: groupData.loading }}
            >
              <Button type="dashed" danger>
                {' '}
                删除{' '}
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
  const uploadRef2 = useRef();
  const uploadRef3 = useRef();
  const uploadRef4 = useRef();
  const uploadRef5 = useRef();
  const uploadRef6 = useRef();
  const uploadRef7 = useRef();
  const uploadRef8 = useRef();
  const uploadRefexcel = useRef();
  const [selectionType, setSelectionType] = useState('checkbox');
  const [groupData, setGroup] = useState({
    modeltitle: '',
    modeltitle2: '',
    modalVisible: false,
    modalVisible2: false,
    modelexcel: false,
    loading: false,
    cascader: false,
    speciesmenu: [],
    speciestabs: [],
    assetsinfo: {},
  });
  const handlesetGroup = (key, value) => {
    groupData[key] = value;
    setGroup({ ...groupData });
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
  const [uploadData, setUpload] = useState({
    img: '',
    bugFile: '',
    checkFile: '',
    installFile: '',
    transferFile: '',
    dealFile: '',
    allocationFile: '',
    clearFile: '',
  });
  const handlesetUpload = (key, value) => {
    uploadData[key] = value;
    setUpload({ ...uploadData });
  };
  const [addForm] = Form.useForm();
  const [addForm2] = Form.useForm();
  useEffect(async () => {
    await dispatch({ type: 'assets/groupassets', payload: FormData });
    await dispatch({ type: 'structure/structurelist' });
    let res = await dispatch({ type: 'dict/info', payload: { fid: 8 } });
    if (res) {
      handlesetGroup('speciesmenu', res);
      handlesetGroup('type', res[0].value);
    }
  }, []);
  //---------------------------------------------------------------------------------------------------
  //查询
  const handleSearch = async (data) => {
    let obj = FormData;
    if (data) {
      obj = Object.assign(data, obj);
    }
    handlesetGroup('loading', true);
    await dispatch({ type: 'assets/groupassets', payload: obj });
    handlesetGroup('loading', false);
  };
  //左侧菜单点击
  const handlemenuclick = async (data) => {
    handlesetGroup('loading', true);
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
    handlesetGroup('speciestabs', res);
    handlesetFormData('typeTwo', res[0].value);
    handleSearch();
    handlesetGroup('loading', false);
  };
  //上层tabs点击
  const handletabsclick = async (data) => {
    handlesetFormData('typeTwo', data);
    handleSearch();
  };
  // const handletabsadd = async () => {
  //     await dispatch({ type: 'dict/inster', payload: data })
  // }
  //资产详情
  const handleinfo = async (data, index) => {
    handlesetGroup('loading', true);
    handlesetGroup('assetsinfo', data);
    if (index == 1) {
      handlesetGroup('modeltitle2', '资产查看');
    } else {
      await dispatch({ type: 'process_set/processuserlist' });
      addForm2.setFieldsValue({
        assetsId: data.id,
      });
      handlesetGroup('modeltitle2', '用户绑定');
    }
    handlesetGroup('modalVisible2', true);
    handlesetGroup('loading', false);
  };
  //用户绑定
  const handlehandleBinding = async (data, index) => {
    handlesetGroup('loading', true);
    let obj = JSON.parse(JSON.stringify(addForm2.getFieldsValue(true)));
    if (!index) {
      obj.type = 1;
    } else {
      obj.assetsId = data.id;
      obj.type = 2;
    }
    await dispatch({ type: 'assets/binding', payload: obj });
    handleClose();
    handlesetGroup('loading', false);
  };
  //新增
  const handleAdd = (data) => {
    handlesetGroup('modeltitle', '新增');
    handlesetGroup('modalVisible', true);
  };
  //修改
  const handleChange = (data) => {
    handlesetGroup('loading', true);
    let formdata = JSON.parse(JSON.stringify(data));
    if (typeof formdata.startTime === 'string') {
      formdata.startTime = moment(formdata.startTime);
    }
    addForm.setFieldsValue(formdata);
    handlesetUpload('img', formdata.img);
    handlesetUpload('bugFile', formdata.bugFile);
    handlesetUpload('checkFile', formdata.checkFile);
    handlesetUpload('installFile', formdata.installFile);
    handlesetUpload('transferFile', formdata.transferFile);
    handlesetUpload('dealFile', formdata.dealFile);
    handlesetUpload('allocationFile', formdata.allocationFile);
    handlesetUpload('clearFile', formdata.clearFile);
    handlesetGroup('modeltitle', '修改');
    handlesetGroup('modalVisible', true);
    handlesetGroup('loading', false);
  };
  //提取文件
  const handlegetuploadlist = async (fileobj) => {
    handlesetUpload(Object.keys(fileobj)[0], fileobj[Object.keys(fileobj)[0]]);
    if (Object.keys(fileobj)[0] == 'clearFile') {
      onFinish();
    }
  };
  //提交
  const onFinish = async () => {
    handlesetGroup('loading', true);
    let data = JSON.parse(JSON.stringify(addForm.getFieldsValue(true)));
    data = Object.assign(data, uploadData);
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
    handlesetGroup('loading', false);
  };
  //删除
  const handleDelete = async (data) => {
    handlesetGroup('loading', true);
    data.isDel = true;
    await dispatch({ type: 'assets/delete', payload: data });
    handleSearch();
    handlesetGroup('loading', false);
  };
  //---------------------------------------------------------------------------------------------------
  const handletypechange = async (value) => {
    let res = await dispatch({
      type: 'dict/info',
      payload: { fid: Number(value) },
    });
    handlesetGroup('speciestabs', res);
  };
  const handleradiochange = async (e) => {
    if (e.target.value == 3) {
      addForm.setFieldsValue({ organizationId: '' });
      handlesetGroup('cascader', true);
    }
  };
  const handleClose = (data) => {
    handleSearch();
    addForm.resetFields();
    handlesetUpload('img', '');
    handlesetUpload('bugFile', '');
    handlesetUpload('checkFile', '');
    handlesetUpload('installFile', '');
    handlesetUpload('transferFile', '');
    handlesetUpload('dealFile', '');
    handlesetUpload('allocationFile', '');
    handlesetUpload('clearFile', '');
    handlesetGroup('modalVisible', false);
    handlesetGroup('modalVisible2', false);
    handlesetGroup('modelexcel', false);
    handlesetGroup('cascader', false);
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
            defaultSelectedKeys={[groupData.type]}
            defaultOpenKeys={[groupData.type]}
            mode="inline"
          >
            {groupData.speciesmenu.map((item) => {
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
                  payload: { type: '1' },
                });
              }}
              okButtonProps={{ loading: groupData.loading }}
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
                handlesetGroup('modelexcel', true);
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
            {groupData.speciestabs.map((item) => (
              <TabPane tab={item.name} key={item.value} closable={false} />
            ))}
          </Tabs>
          <Table
            // rowSelection={{
            //   type: selectionType,
            //   ...rowSelection,
            // }}
            columns={columns}
            dataSource={props.assets.grouplist}
            loading={groupData.loading}
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
        title={groupData.modeltitle}
        visible={groupData.modalVisible}
        destroyOnClose={true}
        width="70%"
        onOk={() => {
          addForm.submit();
        }}
        okButtonProps={{
          loading: groupData.loading,
        }}
        onCancel={handleClose}
      >
        <Form
          form={addForm}
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          size="small"
          autoComplete="off"
          onFinish={() => {
            uploadRef.current.submit();
            uploadRef2.current.submit();
            uploadRef3.current.submit();
            uploadRef4.current.submit();
            uploadRef5.current.submit();
            uploadRef6.current.submit();
            uploadRef7.current.submit();
            uploadRef8.current.submit();
          }}
        >
          <Row gutter={15}>
            <Col span={10}>
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
                  {groupData.speciesmenu.map((item, index) => {
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
                  {groupData.speciestabs.map((item, index) => {
                    return (
                      <Select.Option value={item.value} key={index}>
                        {item.name}
                      </Select.Option>
                    );
                  })}
                </Select>
              </Form.Item>
              {groupData.cascader ? (
                <div>
                  <Form.Item
                    label="资产所属"
                    name="organizationId"
                    rules={[{ required: true, message: '资产所属不能为空' }]}
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
                      style={{ width: '90%', marginRight: '8px' }}
                    />
                  </Form.Item>
                  <CloseCircleOutlined
                    className="closeCircleOutlined"
                    onClick={() => {
                      handlesetGroup('cascader', false);
                    }}
                  />
                </div>
              ) : (
                <Form.Item
                  label="资产所属"
                  name="organizationId"
                  rules={[{ required: true, message: '资产所属不能为空' }]}
                >
                  <Radio.Group onChange={handleradiochange}>
                    <Radio value={1}>集团资产部</Radio>
                    {/* <Radio value={999999}>本部门</Radio> */}
                    <Radio value={3}>其他</Radio>
                  </Radio.Group>
                </Form.Item>
              )}
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
            </Col>
            <Col span={7}>
              <Form.Item
                label="图片"
                name="img"
                rules={[{ required: false, message: '存放地点不能为空' }]}
              >
                <Cupload
                  ref={uploadRef}
                  submit={handlegetuploadlist}
                  prop="img"
                  fileList={uploadData.img}
                ></Cupload>
              </Form.Item>
              <Form.Item
                label="申购单"
                name="bugFile"
                rules={[{ required: false, message: '存放地点不能为空' }]}
              >
                <Cupload
                  ref={uploadRef2}
                  submit={handlegetuploadlist}
                  prop="bugFile"
                  fileList={uploadData.bugFile}
                ></Cupload>
              </Form.Item>
              <Form.Item
                label="验收单"
                name="checkFile"
                rules={[{ required: false, message: '存放地点不能为空' }]}
              >
                <Cupload
                  ref={uploadRef3}
                  submit={handlegetuploadlist}
                  prop="checkFile"
                  fileList={uploadData.checkFile}
                ></Cupload>
              </Form.Item>
              <Form.Item
                label="安装验收报告"
                name="installFile"
                rules={[{ required: false, message: '存放地点不能为空' }]}
              >
                <Cupload
                  ref={uploadRef4}
                  submit={handlegetuploadlist}
                  prop="installFile"
                  fileList={uploadData.installFile}
                ></Cupload>
              </Form.Item>
            </Col>
            <Col span={7}>
              <Form.Item
                label="转固单"
                name="transferFile"
                rules={[{ required: false, message: '存放地点不能为空' }]}
              >
                <Cupload
                  ref={uploadRef5}
                  submit={handlegetuploadlist}
                  prop="transferFile"
                  fileList={uploadData.transferFile}
                ></Cupload>
              </Form.Item>
              <Form.Item
                label="处置申请单"
                name="dealFile"
                rules={[{ required: false, message: '存放地点不能为空' }]}
              >
                <Cupload
                  ref={uploadRef6}
                  submit={handlegetuploadlist}
                  prop="dealFile"
                  fileList={uploadData.dealFile}
                ></Cupload>
              </Form.Item>
              <Form.Item
                label="调拨单"
                name="allocationFile"
                rules={[{ required: false, message: '存放地点不能为空' }]}
              >
                <Cupload
                  ref={uploadRef7}
                  submit={handlegetuploadlist}
                  prop="allocationFile"
                  fileList={uploadData.allocationFile}
                ></Cupload>
              </Form.Item>
              <Form.Item
                label="清理单"
                name="clearFile"
                rules={[{ required: false, message: '存放地点不能为空' }]}
              >
                <Cupload
                  ref={uploadRef8}
                  submit={handlegetuploadlist}
                  prop="clearFile"
                  fileList={uploadData.clearFile}
                ></Cupload>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
      <Modal
        title={groupData.modeltitle2}
        visible={groupData.modalVisible2}
        onCancel={handleClose}
        width="50%"
        footer={null}
      >
        <Descriptions bordered column={2}>
          <Descriptions.Item label="类型">
            {React.$getdictname(
              groupData.speciesmenu,
              groupData.assetsinfo.type,
            )}
          </Descriptions.Item>
          <Descriptions.Item label="种类">
            {React.$getdictname(
              groupData.speciestabs,
              groupData.assetsinfo.typeTwo,
            )}
          </Descriptions.Item>
          <Descriptions.Item label="资产所属">
            {groupData.assetsinfo.organizationId}
          </Descriptions.Item>
          <Descriptions.Item label="编号">
            {groupData.assetsinfo.number}
          </Descriptions.Item>
          <Descriptions.Item label="名称">
            {groupData.assetsinfo.name}
          </Descriptions.Item>
          <Descriptions.Item label="规格">
            {groupData.assetsinfo.specifications}
          </Descriptions.Item>
          <Descriptions.Item label="制造商">
            {groupData.assetsinfo.manufacturer}
          </Descriptions.Item>
          <Descriptions.Item label="原值">
            {groupData.assetsinfo.money}
          </Descriptions.Item>
          <Descriptions.Item label="月折旧额">
            {groupData.assetsinfo.depreciation}
          </Descriptions.Item>
          <Descriptions.Item label="存放地点">
            {groupData.assetsinfo.position}
          </Descriptions.Item>
          <Descriptions.Item label="是否可租借">
            {groupData.assetsinfo.isLease == 1 ? '可租借' : '不可租借'}
          </Descriptions.Item>
        </Descriptions>
        <Form
          form={addForm2}
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          size="small"
          autoComplete="off"
          onFinish={handlehandleBinding}
        >
          {groupData.modeltitle2 == '用户绑定' ? (
            <Form.Item
              label="资产绑定人："
              name="uid"
              rules={[{ required: true, message: '迁移接收人：不能为空' }]}
            >
              <Select placeholder={`请选择资产绑定人：`} allowClear>
                {props.process_set.userlist.map((item, index) => {
                  return (
                    <Select.Option value={item.id} key={index}>
                      {item.nickname}
                    </Select.Option>
                  );
                })}
              </Select>
            </Form.Item>
          ) : null}
        </Form>
        {groupData.modeltitle2 == '用户绑定' ? (
          <Button
            type="primary"
            onClick={() => {
              addForm2.submit();
            }}
            style={{ marginLeft: '90%' }}
          >
            提交
          </Button>
        ) : null}
      </Modal>
      <Modal
        title="批量导入"
        visible={groupData.modelexcel}
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
export default connect(({ assets, process_set, structure }) => {
  return { assets, process_set, structure };
})(group);
