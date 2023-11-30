import React from "react";
//components
import UserTeeth from "@/components/users/user-details/UserTeeth";
import DashLayout from "@/antd-layout/DashLayout";

const page = () => {
  return (
    <DashLayout>
      <UserTeeth />
    </DashLayout>
  );
};

export default page;
