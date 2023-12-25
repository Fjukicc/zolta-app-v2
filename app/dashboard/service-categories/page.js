import React from "react";
import DashLayout from "@/antd-layout/DashLayout";
//custom components
import ServicCategories from "@/components/service-categories";

const page = () => {
  return (
    <DashLayout>
      <ServicCategories />
    </DashLayout>
  );
};

export default page;
