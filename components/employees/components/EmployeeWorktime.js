"use client";
import React, { useState, useEffect } from "react";
//api
import { getEmployeeWorktime } from "@/services/employess";
//ant d
import { Alert, Card, Row, Col, message, Tag } from "antd";

const EmployeeWorktime = ({ employeeId }) => {
  const [messageApi, contextHolder] = message.useMessage();

  const [employeeWorktime, setEmployeeWorktime] = useState(null);
  const [employeeWorktimeError, setEmployeeWorktimeError] = useState(false);

  //fetch employee worktime
  useEffect(() => {
    const fetchEmployeeWorktime = async () => {
      const result = await getEmployeeWorktime(employeeId);
      if (result.success) {
        setEmployeeWorktime(result.data);
        setEmployeeWorktimeError(false);
      } else if (!result.success) {
        setEmployeeWorktimeError(true);
      }
    };
    fetchEmployeeWorktime();
  }, []);


  return (
    <>
      {contextHolder}
      {employeeWorktime !== null && (
        <Card title="Radno Vrijeme" bordered={false}>
          <div className="w-full flex h-full justify-start flex-col">
            {employeeWorktime.length < 1 && (
              <Row gutter={16} className="mb-4">
                <Col span={24}>
                  <Tag color="red">Niste Dodali Radno Vrijeme! Zaposlenik će moći zaprimati sve rezervacije u radnom vremenu objekta.</Tag>
                </Col>
              </Row>
            )}
          </div>
        </Card>
      )}
    </>
  );
};

export default EmployeeWorktime;
