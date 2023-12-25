import React from "react";
import DashLayout from "@/antd-layout/DashLayout";
import { Row, Col } from "antd";
import RentDetails from "@/components/reservation/rent-components/RentDetails";
import RentActions from "@/components/reservation/rent-components/RentActions";

const page = ({searchParams}) => {
  const rent_id = searchParams.rent_id;
  return (
    <DashLayout>
      <Row gutter={16} className="pl-2 pr-2">
        <Col span={12} className="p-4">
            <RentDetails rentId={rent_id}/>
        </Col>
        <Col span={12} className="p-4">
          <RentActions/>
        </Col>
      </Row>
    </DashLayout>
  );
};

export default page;
