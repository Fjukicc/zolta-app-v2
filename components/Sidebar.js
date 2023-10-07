import React from "react";
import Link from "next/link";
import {
  AppstoreOutlined,
  ContainerOutlined,
  CalendarOutlined,
  MailOutlined,
  PieChartOutlined,
} from "@ant-design/icons";
import { Menu } from "antd";

function getItem(label, key, icon, children, type) {
  return {
    key,
    icon,
    children,
    label,
    type,
  };
}

const items = [
  getItem(<Link href={"/dashboard"}>Home</Link>, "1", <PieChartOutlined />),
  getItem(<Link href={"/dashboard/calendar-page"}>Calendar</Link>, "2", <CalendarOutlined />),
  getItem("Option 3", "3", <ContainerOutlined />),
  getItem("Navigation One", "sub1", <MailOutlined />, [
    getItem("Option 5", "5"),
    getItem("Option 6", "6"),
    getItem("Option 7", "7"),
    getItem("Option 8", "8"),
  ]),
  getItem("Navigation Two", "sub2", <AppstoreOutlined />, [
    getItem("Option 9", "9"),
    getItem("Option 10", "10"),
    getItem("Submenu", "sub3", null, [
      getItem("Option 11", "11"),
      getItem("Option 12", "12"),
    ]),
  ]),
];

const AppSidebar = () => {
  return (
    <Menu
      defaultSelectedKeys={["1"]}
      defaultOpenKeys={["sub1"]}
      mode="inline"
      theme="light"
      style={{minHeight: "100%",  backgroundColor: "rgb(240, 242, 245)"}}
      items={items}
    />
  );
};

export default AppSidebar;
