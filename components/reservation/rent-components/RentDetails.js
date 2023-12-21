"use client";
import React, { useState, useEffect } from "react";
//swr
import useSWR from "swr";
import { fetcher } from "@/swr/fetcher";
//ant d
import {
  Card,
  Button,
  Input,
  Select,
  DatePicker,
  TimePicker,
  Row,
  Col,
} from "antd";
import CustomInput from "@/components/shared/input/CustomInput";
//session
import { useSession } from "next-auth/react";
import moment from "moment";
import dayjs from "dayjs";


const { TextArea } = Input;

const format = "HH:mm";

const RentDetails = ({ rentId }) => {
  //session
  const { data: session, status: sessionStatus } = useSession();

  //fetch rent
  const {
    data: rentData,
    error: rentError,
    isLoading: rentLoading,
  } = useSWR(
    `http://ec2-54-93-214-145.eu-central-1.compute.amazonaws.com/reservation?id=${rentId}`,
    fetcher
  );

  //fetch employess
  const {
    data: employeesData,
    error: employeesError,
    isLoading: employeesLoading,
  } = useSWR(
    session
      ? `http://ec2-54-93-214-145.eu-central-1.compute.amazonaws.com/admin?company_id=${session.user.company_id}`
      : null,
    fetcher,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  //fetch services
  const {
    data: servicesData,
    error: serviceError,
    isLoading: servicesLoading,
  } = useSWR(
    session
      ? `http://ec2-54-93-214-145.eu-central-1.compute.amazonaws.com/service?company_id=${session.user.company_id}`
      : null,
    fetcher,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  //   service data that keeps changes
  const [activeRentData, setActiveRentData] = useState();
  const [selectedEmployee, setSelectedEmployee] = useState();
  const [selectedServices, setSelectedServices] = useState([]);

  //set rent data copy
  useEffect(() => {
    if (rentData) {
      console.log(rentData[0]);
      setActiveRentData(rentData[0]);
    }
  }, [rentData]);

  //get selected employee from rent data
  useEffect(() => {
    const setSelectedWorker = () => {
      if (rentData && employeesData) {
        let selected_employee;
        employeesData.forEach((e) => {
          if (e.id === rentData[0].admin_id) {
            selected_employee = {
              ...e,
              value: e.name,
              label: e.name,
            };
          }
        });
        setSelectedEmployee(selected_employee);
      }
    };
    setSelectedWorker();
  }, [rentData, employeesData]);

  const onResetButtonClick = () => {
    setActiveRentData(rentData[0]);
  };

  console.log(activeRentData);

  return (
    <>
      {activeRentData && selectedEmployee && servicesData ? (
        <Card title="Informacije o rezervaciji" bordered={false}>
          <div className="w-full flex h-full justify-start flex-col">
            {/* name and services */}
            <Row gutter={16} className="mb-4">
              <Col span={10} className="flex flex-col items-start">
                <div className="mb-1">Ime naručitelja</div>
                <CustomInput
                  placeholder={"Ime naručitelja"}
                  value={activeRentData.name}
                  onChange={(text) =>
                    setActiveRentData({ ...activeRentData, name: text })
                  }
                />
              </Col>
              <Col span={14} className="flex flex-col items-start">
                <div className="mb-1">Servisi</div>
                <Select
                  className="w-full"
                  showSearch
                  optionFilterProp="children"
                  mode="multiple"
                  // value={selectedService}
                  options={(servicesData || []).map((service) => ({
                    ...service,
                    value: service.name,
                    label: service.name,
                  }))}
                />
              </Col>
            </Row>

            {/* employee and desc */}
            <Row gutter={16} className="mb-4">
              <Col span={10} className="flex flex-col items-start">
                <div className="mb-1">Zaposlenik</div>
                <Select
                  className="w-full justify-start flex text-left"
                  value={selectedEmployee}
                  options={(employeesData || []).map((worker) => ({
                    ...worker,
                    value: worker.name,
                    label: worker.name,
                  }))}
                  onChange={(value, selectedOptions) => {
                    setActiveRentData({
                      ...activeRentData,
                      admin_id: selectedOptions.id,
                      admin_name: selectedOptions.name,
                    });
                    setSelectedEmployee(selectedOptions);
                  }}
                />
              </Col>
              <Col span={14} className="flex flex-col items-start">
                <div className="mb-1">Nota</div>
                <TextArea
                  onChange={(newValue) =>
                    setActiveRentData({
                      ...activeRentData,
                      description: newValue.target.value,
                    })
                  }
                  value={activeRentData.description}
                  placeholder="Dodatna noda o rezervaciji"
                  rows={4}
                />
              </Col>
            </Row>

            {/* date start and end time */}
            <Row gutter={16} className="mb-4">
              <Col span={8} className="flex flex-col items-start">
                <div className="mb-1">Datum</div>
                <DatePicker value={dayjs(activeRentData.date)} format={"DD.MM.YYYY."} className="w-full" />
              </Col>
              <Col span={8} className="flex flex-col items-start">
                <div className="mb-1">Početno vrijeme</div>
                <TimePicker value={dayjs(activeRentData.start_time, format)} format={format} className="w-full" />
              </Col>
              <Col span={8} className="flex flex-col items-start">
                <div className="mb-1">Krajnje vrijeme</div>

                <TimePicker value={dayjs(activeRentData.end_time, format)} format={format} className="w-full" />
              </Col>
            </Row>

            <div style={{ color: "red", marginTop: 8 }}>
              Krajnje vrijeme će bit izračunato na bazi odabranih servisa
            </div>

            {/* save and reset buttons */}
            <Row gutter={16} className="flex justify-end mt-4">
              <Button
                className="mr-3"
                type="primary"
                danger
                onClick={onResetButtonClick}
              >
                Resetriraj
              </Button>
              <Button type="primary">Spremi</Button>
            </Row>
          </div>
        </Card>
      ) : null}
    </>
  );
};

export default RentDetails;
