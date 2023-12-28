import React from "react";
import DashLayout from "@/antd-layout/DashLayout";
import Employees from "@/components/employees";

const page = () => {
  return (
    <DashLayout>
      <Employees />
    </DashLayout>
  );
};

export default page;
