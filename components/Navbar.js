"use client";
import Image from "next/image";
import logo from "../public/assets/logo.PNG";
import { Avatar, Dropdown } from "antd";
import Link from "next/link";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import PrimaryIconButton from "./buttons/PrimaryIconButton";

const items = [
  {
    label: (
      <Link style={{ width: 144 }} href={"/"}>
        Home
      </Link>
    ),
    key: "0",
  },
  {
    label: <Link href={"/dashboards"}>Settings</Link>,
    key: "1",
  },
  {
    type: "divider",
  },
  {
    label: <Link href={"/login"}>Log Out</Link>,
    key: "3",
  },
];

export default function AppNavbar({
  setIsSidebarCollapsed,
  isSidebarCollapsed,
}) {
  const onToggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };
  return (
    <div className="w-full flex flex-row h-full items-center justify-between">
      <div className="flex flex-row">
        <Image
          className="cursor-pointer ml-2"
          src={logo}
          width={150}
          height={75}
          alt="Logo"
        />
        <PrimaryIconButton
          icon={
            isSidebarCollapsed ? <MenuUnfoldOutlined size={32}/> : <MenuFoldOutlined size={32} />
          }
          onClick={onToggleSidebar}
        />
      </div>

      {/* <img id="avatarButton" type="button" data-dropdown-toggle="userDropdown" data-dropdown-placement="bottom-start" class="w-10 h-10 rounded-full cursor-pointer" src="/docs/images/people/profile-picture-5.jpg" alt="User dropdown"> */}
      <Dropdown
        placement="bottomRight"
        arrow
        menu={{ items }}
        trigger={["click"]}
      >
        <Avatar
          className="hover:opacity-95 cursor-pointer"
          style={{ backgroundColor: "#7265e6", verticalAlign: "middle" }}
          size="large"
          gap={5}
        >
          Andro
        </Avatar>
      </Dropdown>
    </div>
  );
}
