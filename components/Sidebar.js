"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  CalendarOutlined,
  LogoutOutlined,
  HomeOutlined,
  UserOutlined,
  SettingOutlined,
  MessageOutlined,
} from "@ant-design/icons";
import { MdOutlineHexagon, MdOutlineRoomService } from "react-icons/md";
import { CgUser } from "react-icons/cg";
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
    <HomeOutlined />
  ),
  getItem(
    <Link href={"/dashboard/calendar-page"}>Kalendar</Link>,
    "/dashboard/calendar-page",
    <CalendarOutlined />
  ),
  getItem(
    <Link href={"/dashboard/rents"}>Rezervacije</Link>,
    "/dashboard/rents",
    <MdOutlineHexagon />
  ),
  getItem(
    <Link href={"/dashboard/users"}>Korisnici</Link>,
    "/dashboard/users",
    <UserOutlined />
  ),
  getItem(
    <Link href={"/dashboard/messages"}>Poruke</Link>,
    "/dashboard/messages",
    <MessageOutlined />
  ),
  getItem("Servisi", "4", <MdOutlineRoomService />, [
    getItem(
      <Link href={"/dashboard/services"}>Lista Servisa</Link>,
      "/dashboard/services"
    ),
    getItem(
      <Link href={"/dashboard/service-categories"}>Kategorije Servisa</Link>,
      "/dashboard/service-categories"
    ),
  ]),
  getItem(
    <Link href={"/dashboard/employess"}>Zaposlenici</Link>,
    "/dashboard/employess",
    <CgUser />
  ),
  getItem(
    <Link href={"/dashboard/settings"}>Postavke</Link>,
    "/dashboard/settings",
    <SettingOutlined />
  ),
  getItem(<div>Logout</div>, "/dashboard/logout", <LogoutOutlined />),
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
