import React from "react";
import DashLayout from "@/antd-layout/DashLayout";
//ant d
import { Row, Col } from "antd";
import EmployeeDetails from "@/components/employees/components/EmployeeDetails";
import EmployeeWorktime from "@/components/employees/components/EmployeeWorktime";
import EmployeeStatistics from "@/components/employees/components/EmployeeStatistics";

const page = ({ searchParams }) => {
  const employee_id = searchParams.employeeId;
  return (
    <DashLayout>
      <Row gutter={16} className="pl-2 pr-2">
        <Col span={12} className="p-4">
          <EmployeeDetails employeeId={employee_id} />
        </Col>
        <Col span={12} className="p-4">
          <EmployeeWorktime employeeId={employee_id}/>
        </Col>
      </Row>
      <Row gutter={16} className="pl-2 pr-2">
        <Col span={12} className="p-4"></Col>
        <Col span={12} className="p-4">
          <EmployeeStatistics />
        </Col>
      </Row>
    </DashLayout>
  );
};

export default page;
