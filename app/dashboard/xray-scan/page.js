import DashLayout from "@/antd-layout/DashLayout";
import React from "react";
import XRayScan from "@/components/x-ray-scan";

const page = () => {
  return (
    <DashLayout>
      <XRayScan />
    </DashLayout>
  );
};

export default page;
