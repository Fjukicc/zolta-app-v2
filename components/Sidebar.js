"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  AppstoreOutlined,
  ContainerOutlined,
  CalendarOutlined,
  MailOutlined,
  PieChartOutlined,
} from "@ant-design/icons";
import { MdOutlineHexagon } from "react-icons/md";
import { IoMdQrScanner } from "react-icons/io";
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
  getItem(
    <Link href={"/dashboard"}>Početna</Link>,
    "/dashboard",
    <PieChartOutlined />
  ),
  getItem(
    <Link href={"/dashboard/calendar-page"}>Kalendar</Link>,
    "/dashboard/calendar-page",
    <CalendarOutlined />
  ),
  // getItem("Invoices", "3", <ContainerOutlined />),
  getItem("Services", "4", <MailOutlined />, [
    getItem(
      <Link href={"/dashboard/services"}>Servisi</Link>,
      "/dashboard/services"
    ),
    getItem(
      <Link href={"/dashboard/service-categories"}>Kategorije Servisa</Link>,
      "/dashboard/service-categories"
    ),
  ]),
  getItem(
    <Link href={"/dashboard/rents"}>Rezervacije</Link>,
    "/dashboard/rents",
    <MdOutlineHexagon />
  ),
  // getItem(
  //   <Link href={"/dashboard/xray-scan"}>X-Ray</Link>,
  //   "/dashboard/xray-scan",
  //   <IoMdQrScanner />
  // ),
  // getItem("Navigation Two", "sub2", <AppstoreOutlined />, [
  //   getItem("Option 9", "9"),
  //   getItem("Option 10", "10"),
  //   getItem("Submenu", "sub3", null, [
  //     getItem("Option 11", "11"),
  //     getItem("Option 12", "12"),
  //   ]),
  // ]),
];

const AppSidebar = () => {
  const pathname = usePathname();
  //state variables
  const [current, setCurrent] = useState(pathname);

  React.useEffect(() => {
    if (pathname) {
      if (current !== pathname) {
        setCurrent(pathname);
      }
    }
  }, []);

  return (
    <Menu
      selectedKeys={[current]}
      mode="inline"
      theme="light"
      style={{ minHeight: "100%", backgroundColor: "rgb(240, 242, 245)" }}
      items={items}
    />
  );
};

export default AppSidebar;
