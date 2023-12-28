"use client";
import { Layout } from "antd";
import React, { useEffect, useState } from "react";
import AppNavbar from "@/components/Navbar";
import AppSidebar from "@/components/Sidebar";

const { Header, Sider, Content } = Layout;

const DashLayout = ({ children }) => {
  //colapse sidebar
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(null);

  useEffect(() => {
    let is_collapsed = localStorage.getItem("sidebarCollapsed");
    if (is_collapsed === "true" || is_collapsed === "false") {
      setIsSidebarCollapsed(is_collapsed === "true" ? true : false);
    } else {
      setIsSidebarCollapsed(true);
      localStorage.setItem("sidebarCollapsed", true);
    }
  }, []);

  useEffect(() => {
    if (isSidebarCollapsed !== null) {
      localStorage.setItem("sidebarCollapsed", isSidebarCollapsed);
    }
  }, [isSidebarCollapsed]);

  return (
    <Layout
      style={{ minHeight: "100vh", backgroundColor: "rgb(240, 242, 245)" }}
    >
      <Header className="border-b-2 shadow" style={headerStyle}>
        <AppNavbar
          setIsSidebarCollapsed={setIsSidebarCollapsed}
          isSidebarCollapsed={isSidebarCollapsed}
        />
      </Header>
      <Layout hasSider>
        {isSidebarCollapsed !== null && (
          <Sider
            trigger={null}
            collapsible
            collapsed={isSidebarCollapsed}
            theme="light"
            style={siderStyle}
          >
            <AppSidebar />
          </Sider>
        )}
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
