"use client";
import React, { useState } from "react";
//react swr
import useSWR from "swr";
import { fetcher } from "@/swr/fetcher";
//antd
import { Card, Button, Input, Select, message, Checkbox, Row, Col } from "antd";
//icons
import { EuroCircleOutlined, PercentageOutlined } from "@ant-design/icons";
//moment js
import moment from "moment";
import CustomInput from "../shared/input/CustomInput";

//TEXT AREA
const { TextArea } = Input;

const ServiceDetails = ({ service_id }) => {
  //service data
  const {
    data: serviceData,
    error,
    isLoading,
  } = useSWR(
    `http://ec2-54-93-214-145.eu-central-1.compute.amazonaws.com/service/${service_id}`,
    fetcher
  );

  //   service data that keeps changes

  const [activeServiceData, setActiveServiceData] = useState();

  React.useEffect(() => {
    setActiveServiceData(serviceData);
  }, [serviceData]);

  if (error) {
    return <h1>Greška</h1>;
  }

  return (
    <>
      {!isLoading ? (
        <Card title="Informacije o servisu" bordered={false}>
          <div className="w-full flex h-full justify-start flex-col">
            <Row gutter={16} className="mb-4">
              <Col span={12}>
                {/* service name */}
                <div className="w-full flex items-start flex-col">
                  <label className="mb-2">Ime Servisa</label>
                  <CustomInput
                    value={serviceData.name}
                    onChange={(e) => {
                      setActiveServiceData({
                        ...activeServiceData,
                        name: e.target.value,
                      });
                    }}
                  />
                </div>
              </Col>
              <Col span={12}>
                {/* price */}
                <div  className="w-full flex items-start flex-col">
                  <label className="mb-2">Cijena</label>
                  <CustomInput
                    value={serviceData.price}
                    onChange={(e) => {
                      setActiveServiceData({
                        ...activeServiceData,
                        price: e.target.value,
                      });
                    }}
                    // addonAfter={<EuroCircleOutlined />}
                  />
                </div>
              </Col>
            </Row>

            {/* service description */}
            <div className="w-full flex items-start flex-col">
              <label className="mb-2">Opis Servisa</label>
              <TextArea
                rows={3}
                value={serviceData.description}
                placeholder="Opis proizvoda"
                onChange={(e) => {
                  setActiveServiceData({
                    ...activeServiceData,
                    description: e.target.value,
                  });
                }}
              />
            </div>
          </div>
        </Card>
      ) : (
        <h1>Loading</h1>
      )}
    </>
  );
};

export default ServiceDetails;
