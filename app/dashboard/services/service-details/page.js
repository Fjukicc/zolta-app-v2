import React from "react";
import DashLayout from "@/antd-layout/DashLayout";
//components
import ServiceDetails from "@/components/services/service-components/ServiceDetails";
//ant d
import { Row, Col } from "antd";

const page = ({ searchParams }) => {
  const service_id = searchParams.service_id;
  return (
    <DashLayout>
      <Row gutter={16} className="pl-2 pr-2">
        {/* service details */}
        <Col span={12} className="p-4">
          <ServiceDetails service_id={service_id} />
        </Col>
        <Col span={12}>
          {/* service statistics */}
        </Col>
      </Row>
    </DashLayout>
  );
};

export default page;
