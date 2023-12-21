import React from "react";
import DashLayout from "@/antd-layout/DashLayout";
import { Row, Col } from "antd";
import RentDetails from "@/components/reservation/rent-components/RentDetails";

const page = ({searchParams}) => {
  const rent_id = searchParams.rent_id;
  return (
    <DashLayout>
      <Row gutter={16}>
        <Col span={12} className="p-4 ml-4">
            <RentDetails rentId={rent_id}/>
        </Col>
        <Col span={12}></Col>
      </Row>
    </DashLayout>
  );
};

export default page;
