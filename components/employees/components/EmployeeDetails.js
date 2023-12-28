"use client";
import React, { useState, useEffect } from "react";
//react swr
import useSWR from "swr";
import { fetcher } from "@/swr/fetcher";
//antd
import {
  Card,
  Button,
  Input,
  Select,
  message,
  Popover,
  Row,
  Col,
  DatePicker,
  Alert,
  Tag,
} from "antd";
import CustomInput from "@/components/shared/input/CustomInput";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

const EmployeeDetails = ({ employeeId }) => {
  //fetch service
  const {
    data: employeeData,
    error: employeeError,
    isLoading: employeeLoading,
    mutate: mutateGetEmployee,
  } = useSWR(
    `http://ec2-54-93-214-145.eu-central-1.compute.amazonaws.com/admin?id=${employeeId}`,
    fetcher
  );

  const [messageApi, contextHolder] = message.useMessage();

  //   service data that keeps changes
  const [activeEmployeeData, setActiveEmployeeData] = useState();

  useEffect(() => {
    if (employeeData) {
      let new_phone_number = employeeData[0].phone_number;
      let modified_num;
      if (!new_phone_number.startsWith("+")) {
        modified_num = "+385" + new_phone_number.substring(1);
      }
      setActiveEmployeeData({ ...employeeData[0], phone_number: modified_num });
    }
  }, [employeeData]);

  const onSaveButtonPress = () => {};

  return (
    <>
      {contextHolder}
      {activeEmployeeData && (
        <Card title="Informacije o Zaposleniku" bordered={false}>
          <div className="w-full flex h-full justify-start flex-col">
            <Row gutter={16} className="mb-4">
              <Col span={12} className="text-left">
                <div>Ime Zaposlenika</div>
                <CustomInput
                  placeholder={"Ivan Horvat"}
                  value={activeEmployeeData.name}
                />
              </Col>
              <Col span={12} className="text-left">
                <div>Email</div>
                <CustomInput
                  placeholder="example@gmail.com"
                  value={activeEmployeeData.email}
                />
              </Col>
            </Row>
            <Row gutter={16} className="mb-4">
              <Col span={12} className="text-left">
                <div>Broj Telefona</div>
                <PhoneInput
                  country={"hr"}
                  value={activeEmployeeData.phone_number}
                  onChange={(phone) => {
                    console.log(phone);
                  }}
                  inputStyle={{
                    width: "100%",
                  }}
                />
              </Col>
              <Col span={12} className="text-left">
                <div>Ovlasti</div>
                <Select className="w-full" />
              </Col>
            </Row>

            <Row gutter={16} className="mb-2">
              <Col span={24} className="flex flex-row justify-end">
                <Button className="mr-3" type="primary" danger>
                  Resetiraj
                </Button>
                <Button onClick={onSaveButtonPress} type="primary">
                  Spremi
                </Button>
              </Col>
            </Row>
          </div>
        </Card>
      )}
    </>
  );
};

export default EmployeeDetails;
