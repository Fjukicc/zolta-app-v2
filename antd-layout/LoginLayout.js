"use client";
import { Layout, theme } from "antd";
import LoginNavbar from "@/components/login-components/LoginNavbar";

const { Header, Content } = Layout;

const LoginLayout = ({ children }) => {
  return (
    <Layout
      style={{ minHeight: "100vh", backgroundColor: "rgb(240, 242, 245)" }}
    >
      <Header className="border-b-2" style={headerStyle}>
        <LoginNavbar />
      </Header>
      <Content
        className="flex justify-center items-center"
        style={contentStyle}
      >
        {children}
      </Content>
    </Layout>
  );
};

const headerStyle = {
  display: "flex",
  alignItems: "center",
  textAlign: "center",
  height: 64,
  paddingInline: 50,
  lineHeight: "64px",
  backgroundColor: "rgb(240, 242, 245)",
};

const contentStyle = {
  textAlign: "center",
  minHeight: 120,
  lineHeight: "120px",
  color: "#fff",
};

export default LoginLayout;
