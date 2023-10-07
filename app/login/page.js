import React from "react";
//layout
import LoginLayout from "@/antd-layout/LoginLayout";
//components
import LoginCard from "@/components/login-components/LoginCard";

const Login = () => {
  return (
    <LoginLayout>
      <LoginCard />
    </LoginLayout>
  );
};

export default Login;
