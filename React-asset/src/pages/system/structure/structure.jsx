import React, { useState, useEffect } from 'react';
import {
  Table,
  Radio,
  Divider,
  Button,
  Modal,
  Form,
  Input,
  Select,
  Tree,
  Space,
  InputNumber,
  Drawer,
  Popconfirm,
  Row,
  Col,
  Image,
} from 'antd';
import {
  DownOutlined,
  FrownOutlined,
  SmileOutlined,
  MehOutlined,
  FrownFilled,
} from '@ant-design/icons';
import { connect } from 'dva';
import Cselect from '@/components/cselect/cselect.jsx';
import Cupload from '@/components/cupload/cupload.jsx';

import './structure.less';
function structure(props) {
  //---------------------------------------------------------------------------------------------------
  const { dispatch, login } = props;
  const [structureData, setstructuredata] = useState({
    loading: false,
    visible: false,
    visiblestyle: '0px',
    childrenDrawer: false,
    modeltitle: '请选择节点',
    peopleinfo: {},
  });
  const handlesetstructuredata = (key, value) => {
    structureData[key] = value;
    setstructuredata({ ...structureData });
  };
  const [infoForm] = Form.useForm();
  const [addForm] = Form.useForm();
  useEffect(async () => {
    handleSearch();
    await dispatch({ type: 'process_set/processuserlist' });
  }, []);
  //---------------------------------------------------------------------------------------------------
  const handleSearch = async () => {
    handlesetstructuredata('loading', true);
    await dispatch({ type: 'structure/structurelistuser' });
    handlesetstructuredata('loading', false);
  };
  //新增
  const handleAdd = () => {
    handlesetstructuredata('childrenDrawer', true);
    handlesetstructuredata('visiblestyle', '-180px');
    addForm.setFieldsValue({
      fid: infoForm.getFieldsValue(true).id,
      fidname: infoForm.getFieldsValue(true).name,
    });
  };
  //详情
  const handleinfo = (index, infodata) => {
    handlesetstructuredata('visible', true);
    handlesetstructuredata('childrenDrawer', false);
    handlesetstructuredata('visiblestyle', '0px');
    handlesetstructuredata('modeltitle', `${infodata.node.name}详情`);
    let obj = {
      leader: infodata.node.leader,
      teamList: infodata.node.teamList,
    };
    handlesetstructuredata('peopleinfo', obj);
    infoForm.setFieldsValue({
      id: infodata.node.id,
      fid: infodata.node.fid,
      directorUid: infodata.node.directorUid,
      name: infodata.node.name,
      desc: infodata.node.desc,
    });
    getfidname(props.structure.list, infodata.node.fid);
  };
  //修改提交
  const oninfoFinish = async () => {
    handlesetstructuredata('loading', true);
    let data = infoForm.getFieldsValue(true);
    await dispatch({ type: 'structure/update', payload: data });
    handleClose();
    handlesetstructuredata('loading', false);
  };
  //新增提交
  const onaddFinish = async () => {
    handlesetstructuredata('loading', true);
    let data = addForm.getFieldsValue(true);
    await dispatch({ type: 'structure/inster', payload: data });
    handleClose();
    handlesetstructuredata('loading', false);
  };
  //删除
  const handleDelete = async () => {
    handlesetstructuredata('loading', true);
    let data = infoForm.getFieldsValue(true);
    data.isDel = true;
    await dispatch({ type: 'structure/delete', payload: data });
    handleClose();
    handleSearch();
    handlesetstructuredata('loading', false);
  };
  //---------------------------------------------------------------------------------------------------
  const getfidname = (list, fid) => {
    if (fid == 0) {
      infoForm.setFieldsValue({
        fidname: '根目录',
      });
      return;
    }
    list.forEach((item) => {
      if (fid == item.id) {
        infoForm.setFieldsValue({
          fidname: item.name,
        });
        return;
      } else if (item.childrenList) {
        getfidname(item.childrenList, fid);
      }
    });
  };
  const handleClose = (data) => {
    handleSearch();
    infoForm.resetFields();
    addForm.resetFields();
    handlesetstructuredata('visible', false);
    handlesetstructuredata('childrenDrawer', false);
    handlesetstructuredata('visiblestyle', '0px');
  };
  return (
    <div>
      <Tree
        className="tree"
        showIcon
        showLine={true}
        defaultExpandAll={true}
        switcherIcon={<DownOutlined />}
        treeData={props.structure.list}
        fieldNames={{ title: 'name', key: 'id', children: 'childrenList' }}
        onSelect={handleinfo}
      />
      <Drawer
        title={structureData.modeltitle}
        placement="right"
        width={1000}
        mask={false}
        closable={false}
        maskClosable={false}
        getContainer={false}
        style={{ position: 'absolute', right: structureData.visiblestyle }}
        visible={structureData.visible}
        extra={
          <Space>
            <Button onClick={handleClose}>关闭</Button>
            {React.$getmark('inster') ? (
              <Button
                type="primary"
                onClick={() => {
                  handleAdd();
                }}
              >
                新增子节点
              </Button>
            ) : null}
            {React.$getmark('delete') ? (
              <Popconfirm
                placement="topRight"
                title={`您确定要删除节点：${structureData.modeltitle}吗？`}
                cancelText="取消"
                okText="确定"
                onConfirm={() => {
                  handleDelete();
                }}
                okButtonProps={{ loading: structureData.loading }}
              >
                <Button type="primary" danger>
                  删除
                </Button>
              </Popconfirm>
            ) : null}
          </Space>
        }
      >
        <Row gutter={16}>
          <Col className="gutter-row" span={14}>
            {structureData.peopleinfo.leader ? (
              <div className="photoborder">
                <Divider orientation="left" plain>
                  主要负责人
                </Divider>
                <div>
                  <Image
                    width={100}
                    height={150}
                    src={`${process.env.UMI_ENV}${structureData.peopleinfo.leader.avatar}`}
                  />
                  <div className="imgname">
                    {structureData.peopleinfo.leader.nickname}
                  </div>
                </div>
                <Divider orientation="left" plain>
                  成员
                </Divider>
                <div style={{ width: '600px' }}>
                  {structureData.peopleinfo.teamList.map((item) => {
                    return (
                      <div style={{ float: 'left', margin: '0 10px' }}>
                        <Image
                          width={100}
                          height={150}
                          src={`${process.env.UMI_ENV}${item.avatar}`}
                        />
                        <div className="imgname">{item.nickname}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : null}
          </Col>
          <Col className="gutter-row" span={10}>
            <div className="formborder">
              <Form
                className="form"
                form={infoForm}
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                size="Default"
                autoComplete="off"
                onFinish={oninfoFinish}
              >
                <Form.Item
                  label="父节点"
                  name="fidname"
                  rules={[{ required: false, message: '' }]}
                >
                  <Input disabled />
                </Form.Item>
                <Form.Item
                  label="名称"
                  name="name"
                  rules={[{ required: true, message: '' }]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  label="部门负责人："
                  name="directorUid"
                  rules={[{ required: true, message: '部门负责人不能为空' }]}
                >
                  <Select placeholder={`请选择部门负责人：`} allowClear>
                    {props.process_set.userlist.map((item, index) => {
                      return (
                        <Select.Option value={item.id} key={index}>
                          {item.nickname}
                        </Select.Option>
                      );
                    })}
                  </Select>
                </Form.Item>
                <Form.Item
                  label="备注"
                  name="desc"
                  rules={[{ required: false, message: '' }]}
                >
                  <Input />
                </Form.Item>
              </Form>
              {React.$getmark('update') ? (
                <Button
                  className="submit"
                  type="primary"
                  loading={structureData.loading}
                  onClick={() => {
                    infoForm.submit();
                  }}
                >
                  修改
                </Button>
              ) : null}
            </div>
          </Col>
        </Row>
        <Drawer
          title="新建子节点"
          width={400}
          mask={false}
          closable={false}
          maskClosable={false}
          getContainer={false}
          style={{ position: 'absolute' }}
          visible={structureData.childrenDrawer}
          extra={
            <Space>
              <Button
                onClick={() => {
                  handlesetstructuredata('childrenDrawer', false);
                  handlesetstructuredata('visiblestyle', '0px');
                }}
              >
                关闭
              </Button>
            </Space>
          }
        >
          <Form
            className="form"
            form={addForm}
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            size="Default"
            autoComplete="off"
            onFinish={onaddFinish}
          >
            <Form.Item
              label="父节点"
              name="fidname"
              rules={[{ required: false, message: '' }]}
            >
              <Input disabled />
            </Form.Item>
            <Form.Item
              label="名称"
              name="name"
              rules={[{ required: true, message: '' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="部门负责人："
              name="directorUid"
              rules={[{ required: true, message: '部门负责人不能为空' }]}
            >
              <Select placeholder={`请选择部门负责人：`} allowClear>
                {props.process_set.userlist.map((item, index) => {
                  return (
                    <Select.Option value={item.id} key={index}>
                      {item.nickname}
                    </Select.Option>
                  );
                })}
              </Select>
            </Form.Item>
            <Form.Item
              label="备注"
              name="desc"
              rules={[{ required: false, message: '' }]}
            >
              <Input />
            </Form.Item>
          </Form>
          <Button
            className="submit"
            type="primary"
            loading={structureData.loading}
            onClick={() => {
              addForm.submit();
            }}
          >
            提交
          </Button>
        </Drawer>
      </Drawer>
    </div>
  );
}
export default connect(({ structure, process_set }) => {
  return { structure, process_set };
})(structure);
