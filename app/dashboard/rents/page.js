import React from "react";
import Reservations from "@/components/reservation";
import DashLayout from "@/antd-layout/DashLayout";

const page = () => {
  return (
    <DashLayout>
      <Reservations />
    </DashLayout>
  );
};

export default page;
