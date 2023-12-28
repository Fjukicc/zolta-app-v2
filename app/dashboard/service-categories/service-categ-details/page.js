import React from "react";
import DashLayout from "@/antd-layout/DashLayout";
import SCDetails from "@/components/service-categories/components/SCDetails";
//ant d
import { Row, Col } from "antd";

const page = ({ searchParams }) => {
  const category_id = searchParams.category_id;
  return (
    <DashLayout>
      <Row gutter={16} className="pl-2 pr-2">
        {/* service details */}
        <Col span={12} className="p-4">
          <SCDetails category_id={category_id} />
        </Col>
        <Col span={12}>{/* service statistics */}</Col>
      </Row>
    </DashLayout>
  );
};

export default page;
