import React from 'react';
import { connect } from 'dva';
import { useState, useEffect } from 'react';
import {
  Layout,
  Menu,
  Tabs,
  Button,
  Avatar,
  Dropdown,
  Space,
  ConfigProvider,
} from 'antd'; // 布局容器 导航菜单
import zh_CN from 'antd/lib/locale-provider/zh_CN';
const { TabPane } = Tabs;
const { SubMenu } = Menu; // 子菜单
const { Header, Content, Sider, Footer } = Layout; // 顶部布局， 内容部分， 侧边栏
import AnimatedRouter from 'react-animated-router'; //我们的AnimatedRouter组件
import 'react-animated-router/animate.css'; //引入默认的动画样式定义
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  AlignLeftOutlined,
  UnorderedListOutlined,
  UserOutlined,
  DownOutlined,
} from '@ant-design/icons';

import logo from '@/assets/logo/logo.png';
import './index.less'; // 样式
import menu from '@/routes'; // 配置的菜单项

import Userinfo from '@/pages/login/userinfo.jsx';

function myLayout(props) {
  const { dispatch, login } = props;
  function gettab(math) {
    let tabslist = JSON.parse(sessionStorage.getItem('tabslist'));
    if (math) {
      if (math.split('/').length > 2) {
        let obj = {};
        let role = [];
        //寻找相对应菜单的data
        props.login.menulist.forEach((m_item) => {
          if (m_item.math == math) {
            obj = { ...m_item };
          }
        });
        //放进循环tabs的数组里
        if (tabslist.length) {
          let index = tabslist.findIndex((item) => item.math == math);
          if (index == -1) tabslist.push(obj);
        } else {
          tabslist = [obj];
        }
        //获取按钮权限
        if (obj.childrenList) {
          let markarr = obj.childrenList.map((item) => {
            if (item.status == 2 && item.isDisable) {
              return item.math;
            }
          });
          sessionStorage.setItem('markarr', JSON.stringify(markarr));
        } else {
          sessionStorage.setItem('markarr', JSON.stringify([]));
        }
        sessionStorage.setItem('tabslist', JSON.stringify(tabslist));
      }
    }
    handlesetlayoutdata('tabslist', tabslist);
  }
  function getMenuItem(menu) {
    // 获取菜单项
    return menu.map((item) => {
      if (
        item.childrenList &&
        item.status == 3 &&
        item.isShow &&
        item.isDisable
      ) {
        // 有多级菜单时
        return (
          <SubMenu
            key={item.math}
            title={item.name}
            icon={<UnorderedListOutlined />}
          >
            {getMenuItem(item.childrenList)}
          </SubMenu>
        );
      } else {
        return item.isShow && item.isDisable ? (
          <Menu.Item key={item.math} icon={<AlignLeftOutlined />}>
            {' '}
            {item.name}
          </Menu.Item>
        ) : null;
      }
    });
  }
  //--------------------------------------------------------------------------------------------
  useEffect(async () => {
    let tabslist = sessionStorage.getItem('tabslist');
    let rolelist = sessionStorage.getItem('rolelist');
    await dispatch({ type: 'login/getuserinfo' });
    if (!tabslist) {
      sessionStorage.setItem('tabslist', '[]');
    }
    if (!rolelist) {
      await dispatch({ type: 'login/myrolelist' });
    }
    gettab();
    handlesetlayoutdata('activeKey', props.history.location.pathname);
  }, []);
  const [layoutData, setlayoutdata] = useState({
    userinfo: {},
    collapsed: false,
    activeKey: '',
    tabslist: [],
    visible: false,
  });
  const handlesetlayoutdata = (key, value) => {
    layoutData[key] = value;
    setlayoutdata({ ...layoutData });
  };
  //--------------------------------------------------------------------------------------------
  const handleClick = (e) => {
    let path;
    e.key ? (path = e.key) : (path = e);
    gettab(path);
    props.history.push(path);
    handlesetlayoutdata('activeKey', path);
  };
  const handleTabsedit = (item) => {
    if (item) {
      if (item == props.history.location.pathname) {
        props.history.push('/system');
      }
      layoutData.tabslist.splice(
        layoutData.tabslist.findIndex((find) => find.math == item),
        1,
      );
    } else {
      props.history.push('/system');
      layoutData.tabslist = [];
      handlesetlayoutdata('activeKey', '');
    }
    setlayoutdata({ ...layoutData });
    sessionStorage.setItem('tabslist', JSON.stringify(layoutData.tabslist));
  };
  //--------------------------------------------------------------------------------------------
  const getcollapsed = () => {
    handlesetlayoutdata('collapsed', !layoutData.collapsed);
  };

  return (
    <ConfigProvider locale={zh_CN}>
      <Layout>
        <Sider
          className="sider"
          trigger={null}
          collapsible
          collapsed={layoutData.collapsed}
        >
          <div className="menu_header">
            <img src={logo} width={layoutData.collapsed ? '50px' : '150px'} />
          </div>
          <Menu
            onClick={handleClick}
            style={{ height: 925 }}
            defaultSelectedKeys={['1']}
            defaultOpenKeys={['sub1']}
            mode="inline"
            selectedKeys={[layoutData.activeKey]}
          >
            {getMenuItem(props.login.rolelist)}
          </Menu>
        </Sider>
        <Layout className="site-layout">
          <Header className="Header">
            {layoutData.collapsed ? (
              <MenuUnfoldOutlined
                className="Header_icon"
                onClick={getcollapsed}
              />
            ) : (
              <MenuFoldOutlined
                className="Header_icon"
                onClick={getcollapsed}
              />
            )}
            <div className="usercenter">
              <Userinfo></Userinfo>
            </div>
          </Header>
          <Content
            className="content"
            // className="site-layout-background"
            style={{
              margin: '24px 16px',
              padding: 24,
              minHeight: 280,
              position: 'relative',
            }}
          >
            <Tabs
              className="tabs"
              hideAdd
              type="editable-card"
              onChange={handleClick}
              activeKey={layoutData.activeKey}
              onEdit={handleTabsedit}
              tabBarExtraContent={
                layoutData.tabslist.length ? (
                  <Button
                    onClick={() => {
                      handleTabsedit();
                    }}
                  >
                    关闭所有页面
                  </Button>
                ) : null
              }
            >
              {layoutData.tabslist.map((item) => {
                return <TabPane tab={item.name} key={item.math}></TabPane>;
              })}
            </Tabs>
            <AnimatedRouter>{props.children}</AnimatedRouter>
          </Content>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
}
// export default myLayout
export default connect(({ login }) => {
  return { login };
})(myLayout);
