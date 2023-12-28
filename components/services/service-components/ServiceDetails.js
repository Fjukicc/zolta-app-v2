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
  message,
  Checkbox,
  Popover,
  Row,
  Col,
  DatePicker,
  Alert,
  Tag,
} from "antd";
//icons
import {
  ClockCircleOutlined,
  EuroCircleOutlined,
  QuestionCircleOutlined,
  PercentageOutlined,
} from "@ant-design/icons";
//moment js
import moment from "moment";
import dayjs from "dayjs";
//custom components
import CustomInput, {
  CustomInputWithIcon,
} from "../../shared/input/CustomInput";
import { updateService } from "@/services/services";

//TEXT AREA
const { TextArea } = Input;

const ServiceDetails = ({ service_id }) => {
  //fetch service
  const {
    data: serviceData,
    error: serviceError,
    isLoading: serviceLoading,
    mutate: mutateGetServices,
  } = useSWR(
    `http://ec2-54-93-214-145.eu-central-1.compute.amazonaws.com/service/?id=${service_id}`,
    fetcher
  );

  const [messageApi, contextHolder] = message.useMessage();

  //   service data that keeps changes
  const [activeServiceData, setActiveServiceData] = useState();
  const [isServiceDiscounted, setIsServiceDiscounted] = useState();
  const [showDiscountedPrice, setShowDiscountedPrice] = useState();

  //set service data
  useEffect(() => {
    if (serviceData) {
      setActiveServiceData(serviceData[0]);
    }
  }, [serviceData]);

  //set is servise already discounted
  useEffect(() => {
    if (serviceData) {
      if (
        serviceData[0].discount_endtime === null &&
        serviceData[0].discount_percentage === null
      ) {
        setIsServiceDiscounted(false);
        setShowDiscountedPrice(false);
      } else {
        setIsServiceDiscounted(true);
        setShowDiscountedPrice(true);
      }
    }
  }, [serviceData]);

  //add discount to service checkbox
  const onAddDiscountCheckboxClick = (e) => {
    if (e.target.checked === false) {
      setActiveServiceData({
        ...activeServiceData,
        discount_endtime: null,
        discount_percentage: null,
      });
    }
    setIsServiceDiscounted(e.target.checked);
  };

  //on discount date change
  const onChangeDiscountDatePicker = (date, dateString) => {
    setActiveServiceData({
      ...activeServiceData,
      discount_endtime: moment(dateString, "DD.MM.YYYY.")
        .format("YYYY-MM-DD")
        .toString(),
    });
  };

  const onSaveButtonPress = async () => {
    // check if user want service to be discounted
    let service_for_updating = {};
    if (isServiceDiscounted === true) {
      service_for_updating = {
        id: service_id,
        service_category_id: activeServiceData.service_category_id,
        company_id: activeServiceData.company_id,
        name: activeServiceData.name,
        description: activeServiceData.description,
        price: parseInt(activeServiceData.price),
        duration: activeServiceData.duration,
      };
    } else if (isServiceDiscounted === false) {
      service_for_updating = {
        id: service_id,
        service_category_id: activeServiceData.service_category_id,
        company_id: activeServiceData.company_id,
        name: activeServiceData.name,
        description: activeServiceData.description,
        price: parseInt(activeServiceData.price),
        duration: activeServiceData.duration,
        discount_percentage: parseInt(activeServiceData.discount_percentage),
        discount_endtime: activeServiceData.discount_endtime,
      };
    }
    const result = await updateService(service_for_updating);
    if (result.success === true) {
      await mutateGetServices();
      setActiveServiceData(result.data);
      successUpdateService();
    } else if (result.success === false) {
      errorUpdateService();
    }
  };

  //messages for updating service
  const successUpdateService = () => {
    messageApi.open({
      type: "success",
      content: "Uspješno ste ažurirali servis :)",
    });
  };
  const errorUpdateService = () => {
    messageApi.open({
      type: "error",
      content: "Problem u ažuriranju servisa",
    });
  };

  return (
    <>
      {contextHolder}
      {activeServiceData &&
        (isServiceDiscounted === true || isServiceDiscounted === false) && (
          <Card title="Informacije o servisu" bordered={false}>
            <div className="w-full flex h-full justify-start flex-col">
              <Row gutter={16} className="mb-4">
                <Col span={12}>
                  {/* service name */}
                  <div className="w-full flex items-start flex-col">
                    <label>Ime Servisa</label>
                    <CustomInput
                      value={activeServiceData.name}
                      onChange={(text) => {
                        setActiveServiceData({
                          ...activeServiceData,
                          name: text,
                        });
                      }}
                    />
                  </div>
                </Col>
                <Col span={12}>
                  {/* service description */}
                  <div className="w-full flex items-start flex-col">
                    <label>Opis Servisa</label>
                    <TextArea
                      rows={4}
                      value={activeServiceData.description}
                      placeholder="Opis proizvoda"
                      onChange={(e) => {
                        setActiveServiceData({
                          ...activeServiceData,
                          description: e.target.value,
                        });
                      }}
                    />
                  </div>
                </Col>
              </Row>
              <Row gutter={16} className="mb-4">
                <Col span={12}>
                  {/* price */}
                  <div className="flex flex-row justify-start">
                    Cijena Servisa
                  </div>
                  <CustomInputWithIcon
                    value={activeServiceData.price}
                    onChange={(text) => {
                      setActiveServiceData({
                        ...activeServiceData,
                        price: text,
                      });
                    }}
                    placeholder={"Cijena"}
                    typeNumber={true}
                    icon={
                      <EuroCircleOutlined
                        style={{
                          position: "absolute",
                          top: "50%",
                          right: "10px",
                          transform: "translateY(-50%)",
                          cursor: "pointer",
                        }}
                      />
                    }
                  />
                </Col>
                <Col span={12}>
                  <div className="flex flex-row justify-start">
                    Trajanje (min){" "}
                    <Popover
                      title={"Trajanje Servisa"}
                      content={"Trajanje servisa upišite u minutama"}
                    >
                      <QuestionCircleOutlined />
                    </Popover>
                  </div>
                  <CustomInputWithIcon
                    value={activeServiceData.duration}
                    onChange={(text) => {
                      setActiveServiceData({
                        ...activeServiceData,
                        duration: text,
                      });
                    }}
                    placeholder={"npr. 50"}
                    typeNumber={true}
                    icon={
                      <ClockCircleOutlined
                        style={{
                          position: "absolute",
                          top: "50%",
                          right: "10px",
                          transform: "translateY(-50%)",
                          cursor: "pointer",
                        }}
                      />
                    }
                  />
                </Col>
              </Row>
              <Row gutter={16} className="mb-4">
                <Col span={12} className="flex justify-start">
                  <Checkbox
                    value={isServiceDiscounted}
                    onChange={onAddDiscountCheckboxClick}
                  >
                    Dodaj Popust
                  </Checkbox>
                </Col>
              </Row>
              {isServiceDiscounted === true && (
                <Row gutter={16} className="mb-4">
                  <Col span={12}>
                    <div className="flex flex-row justify-start">
                      Postotak Popusta
                    </div>
                    <CustomInputWithIcon
                      value={
                        activeServiceData.discount_percentage
                          ? activeServiceData.discount_percentage
                          : 0
                      }
                      onChange={(text) => {
                        setActiveServiceData({
                          ...activeServiceData,
                          discount_percentage: text,
                        });
                      }}
                      placeholder={"Cijena"}
                      typeNumber={true}
                      icon={
                        <PercentageOutlined
                          style={{
                            position: "absolute",
                            top: "50%",
                            right: "10px",
                            transform: "translateY(-50%)",
                            cursor: "pointer",
                          }}
                        />
                      }
                    />
                  </Col>
                  <Col span={12}>
                    <div className="flex flex-row justify-start">
                      Trajanje Popusta
                    </div>
                    <DatePicker
                      placeholder="Dodaj Datum"
                      format={"DD.MM.YYYY."}
                      value={
                        activeServiceData.discount_endtime
                          ? dayjs(
                              moment(
                                activeServiceData.discount_endtime,
                                "YYYY-MM-DD"
                              ).toDate()
                            )
                          : null
                      }
                      onChange={onChangeDiscountDatePicker}
                      disabledDate={(current) => {
                        return moment().add(-1, "days") > current;
                      }}
                      className="w-full"
                    />
                  </Col>
                </Row>
              )}
            </div>
            {isServiceDiscounted === true && (
              <Alert
                message="Dodat ćete popust na proizvod"
                type="warning"
                className="mb-6"
              />
            )}
            <Row gutter={16} className="mb-4">
              <Col span={24} className="flex flex-row justify-between">
                <Tag
                  color="red"
                  style={{
                    visibility: showDiscountedPrice === false ? "hidden" : null,
                  }}
                >{`Cijena s Popustom: ${activeServiceData.discount_price}`}</Tag>
                <div>
                  <Button className="mr-3" type="primary" danger>
                    Resetiraj
                  </Button>
                  <Button onClick={onSaveButtonPress} type="primary">
                    Spremi
                  </Button>
                </div>
              </Col>
            </Row>
          </Card>
        )}
    </>
  );
};

export default ServiceDetails;
