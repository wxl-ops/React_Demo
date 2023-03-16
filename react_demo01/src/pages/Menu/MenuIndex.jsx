import React, { useState } from "react";
import {
  LaptopOutlined,
  NotificationOutlined,
  UserOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
} from "@ant-design/icons";
import { Layout, Menu, theme } from "antd";
import "./Menu.scss";
import { Outlet, useNavigate } from "react-router-dom";
// import { Route,Routes,Navigate, useNavigate } from 'react-router-dom';
// import MenuContent from './MenuContent/MenuContent';
const { Header, Sider, Content } = Layout;
// const items1 = ['1', '2', '3'].map((key) => ({
//   key,
//   label: `nav ${key}`,
// }));
const desc = [
  {
    name: "人员信息管理",
    option: [
      { title: "第一项", path: "/menu/first" },
      { title: "第二项", path: "/menu/second" },
      { title: "第三项", path: "/menu/third" },
      { title: "第四项", path: "/menu/fouth" },
    ],
  },
  {
    name: "产品信息管理",
    option: [
      { title: "第一项", path: "/menu/first" },
      { title: "第二项", path: "/menu/first" },
      { title: "第三项", path: "/menu/first" },
      { title: "第四项", path: "/menu/first" },
    ],
  },
  {
    name: "房屋信息管理",
    option: [
      { title: "第一项", path: "/menu/first" },
      { title: "第二项", path: "/menu/first" },
      { title: "第三项", path: "/menu/first" },
      { title: "第四项", path: "/menu/first" },
    ],
  },
];
const items2 = [UserOutlined, LaptopOutlined, NotificationOutlined].map(
  (icon, index) => {
    const key = String(index + 1);
    return {
      key: `sub${key}`,
      icon: React.createElement(icon),
      label: desc[index].name,
      children: new Array(4).fill(null).map((_, j) => {
        return {
          key: desc[index].option[j].path,
          label: desc[index].option[j].title,
        };
      }),
    };
  }
);
// const PARAMS = "params";
const SEARCH = "search";
export default function MenuIndex(props) {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const navigate = useNavigate();
  const handleClick = (e) => {
    navigate(e.key + `?search=${SEARCH}`);
    // navigate(e.key + "/" + PARAMS);
  };
  return (
    <Layout>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="logo" />
        <Menu
          onClick={handleClick}
          mode="inline"
          defaultSelectedKeys={["sub1"]}
          defaultOpenKeys={["sub1"]}
          style={{
            height: "100%",
            borderRight: 0,
          }}
          items={items2}
        />
      </Sider>
      <Layout className="site-layout">
        <Header
          style={{
            padding: 0,
            background: colorBgContainer,
          }}
        >
          {React.createElement(
            collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
            {
              className: "trigger",
              onClick: () => setCollapsed(!collapsed),
            }
          )}
        </Header>
        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
