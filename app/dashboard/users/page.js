import React from "react";
import DashLayout from "@/antd-layout/DashLayout";
import Users from "@/components/users";

const page = () => {
  return (
    <DashLayout>
      <Users />
    </DashLayout>
  );
};

export default page;
