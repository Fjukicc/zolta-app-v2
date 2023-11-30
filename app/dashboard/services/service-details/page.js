import React from "react";
import DashLayout from "@/antd-layout/DashLayout";
//components
import ServiceDetails from "@/components/services/ServiceDetails";
import { Row, Col } from "antd";

const page = ({ searchParams }) => {
  const service_id = searchParams.service_id;
  return (
    <DashLayout>
      <Row gutter={16}>
        <Col span={12} className="p-4 ml-4">
          {service_id ? (
            <ServiceDetails service_id={service_id} />
          ) : (
            <h1>GREŠKA</h1>
          )}
        </Col>
        <Col span={12}></Col>
      </Row>
    </DashLayout>
  );
};

export default page;
