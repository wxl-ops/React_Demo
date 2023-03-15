import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Modal,
  Space,
  Tabs,
  Row,
  Col,
  Menu,
  Popconfirm,
  Descriptions,
  Card,
  Timeline,
  Form,
  Input,
  Radio,
  Tag,
  Pagination,
} from 'antd';
const { TabPane } = Tabs;
import {
  BarsOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  SyncOutlined,
  LoadingOutlined,
  LoginOutlined,
} from '@ant-design/icons';
import { connect } from 'dva';
import Cselect from '@/components/cselect/cselect.jsx';
import Cupload from '@/components/cupload/cupload.jsx';

function task(props) {
  const columns = [
    {
      title: '序号',
      align: 'center',
      render: (text, row, index) => <div>{index + 1}</div>,
    },
    {
      title: '流程名称',
      dataIndex: 'category',
      prop: 'category',
      align: 'center',
      search: 'select',
      render: (category) => (
        <span style={{ color: '#2db7f5' }}>{getcategory(category)}</span>
      ),
    },
    {
      title: '资产名称',
      dataIndex: 'assetsName',
      prop: 'assetsName',
      align: 'center',
      search: 'input',
    },
    {
      title: '申请人',
      dataIndex: 'userName',
      prop: 'userName',
      align: 'center',
    },
    {
      title: '申请时间',
      dataIndex: 'createTime',
      prop: 'createTime',
      align: 'center',
      render: (time) => <span>{React.$getformat(time)}</span>,
    },
    {
      title: '状态',
      dataIndex: 'type',
      prop: 'type',
      align: 'center',
      search: 'select',
      render: (type) =>
        type == 0 ? (
          <Tag icon={<LoadingOutlined />} color="default">
            未审批
          </Tag>
        ) : type == 1 ? (
          <Tag icon={<SyncOutlined spin />} color="processing">
            审批中
          </Tag>
        ) : type == 2 ? (
          <Tag icon={<CheckCircleOutlined />} color="success">
            已完成
          </Tag>
        ) : type == 3 ? (
          <Tag icon={<CloseCircleOutlined />} color="error">
            已驳回
          </Tag>
        ) : type == 4 ? (
          <Tag icon={<ExclamationCircleOutlined />} color="warning">
            已撤回
          </Tag>
        ) : (
          <Tag icon={<LoginOutlined />} color="purple">
            接收中
          </Tag>
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
                handleInfo(row);
              }}
            >
              查看
            </Button>
          ) : null}
          {React.$getmark('approval') ? (
            taskData.defaultActiveKey == 2 ? (
              row.type == 0 || row.type == 1 ? (
                <Button
                  type="dashed"
                  onClick={() => {
                    handleInfo(row, 1);
                  }}
                >
                  审批
                </Button>
              ) : null
            ) : null
          ) : null}
          {React.$getmark('receive') ? (
            taskData.defaultActiveKey == 2 ? (
              row.type == 5 ? (
                <Button
                  type="dashed"
                  onClick={() => {
                    handleInfo(row, 2);
                  }}
                >
                  接收
                </Button>
              ) : null
            ) : null
          ) : null}
          {React.$getmark('delete') ? (
            taskData.defaultActiveKey == 1 ? (
              row.type == 0 ? (
                <Popconfirm
                  placement="topRight"
                  title={`您确定要撤销申请吗？`}
                  cancelText="取消"
                  okText="确定"
                  onConfirm={() => {
                    handleDelete(row);
                  }}
                  okButtonProps={{ loading: taskData.loading }}
                >
                  <Button type="dashed" danger>
                    撤销
                  </Button>
                </Popconfirm>
              ) : null
            ) : null
          ) : null}
        </Space>
      ),
    },
  ];
  //---------------------------------------------------------------------------------------------------
  const { dispatch, login } = props;
  const [selectionType, setSelectionType] = useState('checkbox');
  const [taskData, settaskData] = useState({
    loading: false,
    modalVisible: false,
    modaltitle: '',
    defaultActiveKey: '1',
    pageNum: 1,
    pageSize: 10,
  });
  const handlesettaskData = (key, value) => {
    taskData[key] = value;
    settaskData({ ...taskData });
  };
  const [FormData, setFormData] = useState({
    info: {},
    processinfo: [],
    dictlist: [],
  });
  const dictlist = [
    FormData.dictlist,
    [
      {
        name: '未审批',
        dictValue: 0,
      },
      {
        name: '审批中',
        dictValue: 1,
      },
      {
        name: '已完成',
        dictValue: 2,
      },
      {
        name: '已驳回',
        dictValue: 3,
      },
      {
        name: '已撤回',
        dictValue: 4,
      },
      {
        name: '接收中',
        dictValue: 5,
      },
    ],
  ];
  const handlesetFormData = (key, value) => {
    FormData[key] = value;
    setFormData({ ...FormData });
  };
  const [addForm] = Form.useForm();
  useEffect(async () => {
    let res = await dispatch({ type: 'dict/info', payload: { fid: 25 } });
    if (res) {
      handlesetFormData('dictlist', res);
    }
    handleSearch();
  }, []);
  //---------------------------------------------------------------------------------------------------
  const handletabs = (data) => {
    handlesettaskData('defaultActiveKey', data);
    handleSearch();
  };
  const handleSearch = async (data) => {
    let obj = taskData;
    if (data) {
      obj = Object.assign(data, obj);
    }
    handlesettaskData('loading', true);
    if (taskData.defaultActiveKey == 1) {
      await dispatch({ type: 'task/getmylist', payload: obj });
    } else {
      await dispatch({ type: 'task/gettasklist', payload: obj });
    }
    handlesettaskData('loading', false);
  };
  const handleDelete = async (data) => {
    handlesettaskData('loading', true);
    await dispatch({ type: 'assets_process/delete', payload: { id: data.id } });
    handlesettaskData('loading', false);
    handleSearch();
  };
  const handleInfo = async (data, index) => {
    handlesettaskData('loading', true);
    addForm.setFieldsValue({
      id: data.id,
      applyId: data.id,
    });
    let infores = await dispatch({
      type: 'assets_process/info',
      payload: { id: data.id },
    });
    let processinfores = await dispatch({
      type: 'assets_process/processinfo',
      payload: { applyId: data.id },
    });
    handlesetFormData('info', infores);
    handlesetFormData('processinfo', processinfores);
    if (index == 1) {
      handlesettaskData('modaltitle', '流程审批');
    } else if (index == 2) {
      handlesettaskData('modaltitle', '流程接收');
    } else {
      handlesettaskData('modaltitle', '流程详情');
    }
    handlesettaskData('modalVisible', true);
    handlesettaskData('loading', false);
  };
  //提交：审批/接收
  const onFinish = async (filelist) => {
    handlesettaskData('loading', true);
    let data = addForm.getFieldsValue(true);
    data.assetsName = FormData.info.assetsName;
    if (taskData.modaltitle == '流程审批') {
      await dispatch({ type: 'assets_process/examine', payload: data });
    } else {
      await dispatch({ type: 'assets_process/receive', payload: data });
    }
    handleClose();
    handlesettaskData('loading', false);
  };
  const handleReceive = async () => {
    handlesettaskData('loading', true);
    await dispatch({ type: 'assets_process/receive', payload: data });
    handleClose();
    handlesettaskData('loading', false);
  };
  //---------------------------------------------------------------------------------------------------
  const getcategory = (category) => {
    let categorytext;
    FormData.dictlist.forEach((item) => {
      if (item.value == category) {
        categorytext = item.name;
      }
    });
    return categorytext;
  };
  const handleClose = (data) => {
    handleSearch();
    addForm.resetFields();
    handlesettaskData('modalVisible', false);
  };
  const handlePageSizeChange = (page, pageSize) => {
    handlesettaskData('pageNum', page);
    handlesettaskData('pageSize', pageSize);
    handleSearch();
  };
  return (
    <div>
      <Tabs
        defaultActiveKey={taskData.defaultActiveKey}
        centered
        onChange={(e) => {
          handletabs(e);
        }}
      >
        <TabPane
          tab={
            React.$getmark('apply') ? (
              <span>
                <BarsOutlined /> 我的申请{' '}
              </span>
            ) : null
          }
          key="1"
        />
        <TabPane
          tab={
            React.$getmark('task') ? (
              <span>
                <BarsOutlined /> 我的任务{' '}
              </span>
            ) : null
          }
          key="2"
        />
      </Tabs>
      <Cselect
        tablelist={columns}
        dictlist={dictlist}
        search={handleSearch}
      ></Cselect>
      <Table
        columns={columns}
        dataSource={props.task.list}
        loading={taskData.loading}
        pagination={{ position: ['none'] }}
        scroll={{ y: 570 }}
      />
      <Pagination
        className="pagination"
        total={props.task.page.totalSize}
        showTotal={(total) => `共 ${total} 条`}
        defaultCurrent={1}
        current={props.task.page.pageNum}
        defaultPageSize={10}
        pageSize={props.task.page.pageSize}
        onChange={handlePageSizeChange}
      />
      <Modal
        title={taskData.modaltitle}
        width="50%"
        onCancel={handleClose}
        visible={taskData.modalVisible}
        footer={null}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Descriptions column={2}>
              <Descriptions.Item label="资产名称">
                {FormData.info.assetsName}
              </Descriptions.Item>
              <Descriptions.Item label="申请时间">
                {React.$getformat(FormData.info.createTime)}
              </Descriptions.Item>
              <Descriptions.Item label="当前状态">
                {FormData.info.type == 0 ? (
                  <Tag icon={<LoadingOutlined />} color="default">
                    未审批
                  </Tag>
                ) : FormData.info.type == 1 ? (
                  <Tag icon={<SyncOutlined spin />} color="processing">
                    审批中
                  </Tag>
                ) : FormData.info.type == 2 ? (
                  <Tag icon={<CheckCircleOutlined />} color="success">
                    已完成
                  </Tag>
                ) : FormData.info.type == 3 ? (
                  <Tag icon={<CloseCircleOutlined />} color="error">
                    已驳回
                  </Tag>
                ) : FormData.info.type == 4 ? (
                  <Tag icon={<ExclamationCircleOutlined />} color="warning">
                    已撤回
                  </Tag>
                ) : (
                  <Tag icon={<LoginOutlined />} color="purple">
                    接收中
                  </Tag>
                )}
              </Descriptions.Item>
              <Descriptions.Item label="申请类型">
                {getcategory(FormData.info.category)}
              </Descriptions.Item>

              {FormData.info.category == 2 ? (
                <Descriptions.Item label="租借时间">
                  {React.$getformat(FormData.info.leaseStartTime)} 至
                  {React.$getformat(FormData.info.leaseEndTime)}
                </Descriptions.Item>
              ) : null}
              {FormData.info.category == 3 ? (
                <Descriptions.Item label="报修原因">
                  {FormData.info.desc}
                </Descriptions.Item>
              ) : null}
              {FormData.info.category == 4 ? (
                <Descriptions.Item label="迁移人">
                  {FormData.info.transferName}
                </Descriptions.Item>
              ) : null}
            </Descriptions>
          </Col>
          <Col span={12}>
            <Timeline>
              {FormData.processinfo
                ? FormData.processinfo.map((item, index) => {
                    return (
                      <Timeline.Item color="green" key={index}>
                        <Card hoverable style={{ width: 340 }}>
                          <Descriptions column={1}>
                            <Descriptions.Item label="审批人">
                              {item.userName}
                            </Descriptions.Item>
                            <Descriptions.Item label="审批时间">
                              {React.$getformat(item.createTime)}
                            </Descriptions.Item>
                            <Descriptions.Item label="审批人意见">
                              {item.desc}
                            </Descriptions.Item>
                          </Descriptions>
                        </Card>
                      </Timeline.Item>
                    );
                  })
                : null}
              <Timeline.Item color="#00CCFF">
                <Descriptions column={2}>
                  <Descriptions.Item label="接收人">
                    {FormData.info.receiveName}
                  </Descriptions.Item>
                </Descriptions>
              </Timeline.Item>
            </Timeline>
          </Col>
        </Row>
        <div className="modelfoot">
          <Form
            className="form"
            layout="inline"
            form={addForm}
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 17 }}
            size="small"
            autoComplete="off"
            onFinish={onFinish}
            style={{
              float: 'left',
            }}
          >
            {taskData.modaltitle == '流程审批' ? (
              <Form.Item
                label="审批意见"
                name="desc"
                rules={[{ required: true, message: '审批意见不能为空' }]}
              >
                <Input />
              </Form.Item>
            ) : null}
            {taskData.modaltitle == '流程审批' ? (
              <Form.Item
                label="是否通过"
                name="status"
                rules={[{ required: true, message: '是否通过不能为空' }]}
              >
                <Radio.Group>
                  <Radio value={1}>同意</Radio>
                  <Radio value={2}>驳回</Radio>
                </Radio.Group>
              </Form.Item>
            ) : null}
            {taskData.modaltitle == '流程接收' ? (
              <Form.Item
                label="接受备注"
                name="desc"
                rules={[{ required: false, message: '审批意见不能为空' }]}
              >
                <Input />
              </Form.Item>
            ) : null}
          </Form>
          <Space style={{ float: 'right' }}>
            {taskData.modaltitle == '流程审批' ? (
              <Button
                onClick={() => {
                  addForm.submit();
                }}
              >
                审批
              </Button>
            ) : taskData.modaltitle == '流程接收' ? (
              <Button
                onClick={() => {
                  addForm.submit();
                }}
              >
                接收
              </Button>
            ) : null}
          </Space>
        </div>
      </Modal>
    </div>
  );
}
export default connect(({ task }) => {
  return { task };
})(task);
