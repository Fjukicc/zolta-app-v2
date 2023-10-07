"use client"
import { Layout } from "antd";
import React,{useState} from "react";
import AppNavbar from "@/components/Navbar";
import AppSidebar from "@/components/Sidebar";

const { Header, Sider, Content } = Layout;

const DashLayout = ({ children }) => {
  //colapse sidebar
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
      <Layout style={{ minHeight: "100vh", backgroundColor: "rgb(240, 242, 245)"}}>
      <Header className="border-b-2 shadow" style={headerStyle}>
        <AppNavbar setIsSidebarCollapsed={setIsSidebarCollapsed} isSidebarCollapsed={isSidebarCollapsed}/>
      </Header>
      <Layout hasSider>
        <Sider trigger={null} collapsible collapsed={isSidebarCollapsed} theme="light" style={siderStyle}>
          <AppSidebar/>
        </Sider>
        <Content style={contentStyle}>{children}</Content>
      </Layout>
    </Layout>
  );
};

const headerStyle = {
  textAlign: "center",
  color: "#000",
  height: 64,
  paddingInline: 50,
  lineHeight: "64px",
  backgroundColor: "rgb(240, 242, 245)",
};

const siderStyle = {
  textAlign: "center",
  lineHeight: "120px",
  color: "#000",
  backgroundColor: "rgb(240, 242, 245)",
};

const contentStyle = {
  textAlign: "center",
  minHeight: 120,
  lineHeight: "120px",
  backgroundColor: "rgb(240, 242, 245)",
};

export default DashLayout;
