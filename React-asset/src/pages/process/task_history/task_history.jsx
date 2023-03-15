import React, { useState, useEffect } from 'react'
import { Table, Button, Modal, Form, Input, Select, Space, Tabs, Row, Col, Menu, Popconfirm } from 'antd';
const { TabPane } = Tabs;
import { AppstoreOutlined, BarsOutlined } from '@ant-design/icons';
import { connect } from 'dva';
import Cselect from '@/components/cselect/cselect.jsx'
import Cupload from '@/components/cupload/cupload.jsx'

function task_history(props) {
    const columns = [
        {
            title: '序号',
            align: "center",
            render: (text, row, index) => (
                <div>{index + 1}</div>
            )
        },
        {
            title: '流程名称',
            dataIndex: 'name',
            prop: "name",
            align: "center",
        },
        {
            title: '状态',
            dataIndex: 'role_id',
            prop: "role_id",
            align: "center",
        },
        {
            title: '编辑人',
            dataIndex: 'phone',
            prop: "phone",
            align: "center",
        },
        {
            title: '是否设定',
            dataIndex: 'role_id',
            prop: "role_id",
            align: "center",
        },
        {
            title: '操作',
            fixed: 'right',
            key: 'x',
            width: 280,
            align: "center",
            render: (row) => (
                <Space>
                    <Button type="dashed" onClick={() => { handleChange(row) }}>
                        查看
                    </Button>
                    <Button type="dashed" onClick={() => { handleChange(row) }}>
                        编辑
                    </Button >
                    <Popconfirm
                        placement="topRight"
                        title={`您确定要删除账号：${row.nickname}吗？`}
                        cancelText="取消"
                        okText="确定"
                        onConfirm={() => { handleDelete(row) }}
                        okButtonProps={{ loading: process_setData.loading }}
                    >
                        <Button type="dashed" danger>
                            删除
                        </Button>
                    </Popconfirm>
                </Space>
            )
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
        defaultActiveKey: "1",
        defaultSelectedKeys: "2",
    })
    const handlesetprocess_setdata = (key, value) => {
        process_setData[key] = value;
        setprocess_setdata({ ...process_setData })
    }
    useEffect(async () => {
        await dispatch({ type: 'process_set/processlist' })
        let res = await dispatch({ type: 'dict/info', payload: { fid: 23 } })
        handlesetprocess_setdata('processtype', res)
    }, [])
    const [addForm] = Form.useForm();
    //---------------------------------------------------------------------------------------------------
    const handleSearch = async (data) => {
        handlesetprocess_setdata('loading', true)
        let res = await dispatch({ type: 'dict/info', payload: { fid: 25 } })
        handlesetprocess_setdata('processtypeinfo', res)
        handlesetprocess_setdata('loading', false)
    }
    const handletabs = (data) => {
        handlesetprocess_setdata('defaultActiveKey', data)
        handleSearch(data)
    }
    const handlemenuclick = (data) => {
        handlesetprocess_setdata('defaultSelectedKeys', data.key)
        handleSearch()
    }
    //新增
    const handleAdd = (data) => {
        handlesetprocess_setdata('modeltitle', "新增")
        handlesetprocess_setdata('modalVisible', true)
    }
   
    //---------------------------------------------------------------------------------------------------
    const handleClose = (data) => {
        handlesetprocess_setdata('modalVisible', false)
    }

    return (
        <div>
            <Row gutter={16}>
                {/* <Col span={3}>
                    <Menu
                        onClick={handlemenuclick}
                        defaultSelectedKeys={process_setData.defaultSelectedKeys}
                        defaultOpenKeys={['sub1']}
                        mode="inline"
                    >
                        {
                            props.task_history.list.map(item => {
                                return (<Menu.Item key={item.id}>{item.name}</Menu.Item>)
                            })
                        }
                    </Menu>
                </Col> */}
                <Col span={24}>
                    <Tabs defaultActiveKey={process_setData.defaultActiveKey} centered onChange={(e) => { handletabs(e) }}>
                        {
                            process_setData.processtype.map(item => {
                                return (
                                    <TabPane tab={<span> <BarsOutlined /> {item.name} </span>} key={item.id} />
                                )
                            })
                        }
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
            <Modal title="Basic Modal" visible={process_setData.modalVisible} onOk={() => { addForm.submit() }} onCancel={handleClose}>
                <Form
                    className='form'
                    form={addForm}
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    initialValues={{ remember: true }}
                    size="small"
                    autoComplete="off"
                >
                    <Form.Item
                        label="流程名称"
                        name="username"
                        rules={[{ required: true, message: '角色名称不能为空' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="类型"
                        name="username"
                        rules={[{ required: false, message: '' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="用途"
                        name="dsa"
                        rules={[{ required: false, message: '' }]}
                    >
                    </Form.Item>
                </Form>
            </Modal>
        </div >
    )
}
export default connect(({ task_history }) => {
    return { task_history }
})(task_history)
