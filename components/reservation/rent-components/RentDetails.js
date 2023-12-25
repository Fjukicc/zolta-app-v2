"use client";
import React, { useState, useEffect } from "react";
//swr
import useSWR from "swr";
import { fetcher } from "@/swr/fetcher";
//ant d
import {
  Card,
  Tag,
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
//apis
import { updateReservation } from "@/services/reservation";

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
  const [isUserSelected, setIsUserSelected] = useState();

  //set rent data copy
  useEffect(() => {
    if (rentData) {
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

  //get selected services for rent
  useEffect(() => {
    const setSelectedServicesOnLoad = () => {
      if (servicesData && rentData) {
        let selected_services = [];
        // check which services from rent are included
        const result = servicesData.filter((service) =>
          rentData[0].services.some(
            (rent_service) => service.id === rent_service.id
          )
        );

        result.forEach((service) => {
          selected_services.push({
            ...service,
            value: service.name,
            label: service.name,
          });
        });
        setSelectedServices(selected_services);
      }
    };
    setSelectedServicesOnLoad();
  }, [rentData, servicesData]);

  const onSaveButtonClick = async () => {
    //if all fields exist
    if (
      selectedServices.length > 0 &&
      activeRentData.name &&
      selectedEmployee &&
      activeRentData.description &&
      activeRentData.date &&
      activeRentData.start_time &&
      activeRentData.end_time &&
      activeRentData.price
    ) {
      let new_service_ids = [];
      //generate an array of service ids for new reservation
      selectedServices.forEach((service) => {
        new_service_ids.push(service.id);
      });

      let update_rent = {
        id: rentId,
        company_id: session.user.company_id,
        admin_id: selectedEmployee.id,
        name: activeRentData.name,
        service_id: new_service_ids,
        description: activeRentData.description,
        date: activeRentData.date,
        start_time: activeRentData.start_time,
        end_time: activeRentData.end_time,
      };

      const result = await updateReservation(update_rent);
      console.log(result);
    }
  };

  const onResetButtonClick = () => {
    setActiveRentData(rentData[0]);
  };

  //set date for new reservation DATEPICKER
  const onChangeDatePicker = (date, dateString) => {
    setActiveRentData({
      ...activeRentData,
      date: moment(dateString, "DD.MM.YYYY.").format("YYYY-MM-DD").toString(),
    });
  };

  //change start time of the TIMEPICKER
  const onChangeStartTimePicker = (time, timeString) => {
    //map through picked services and calculate full durations
    var duration_calculation = 0;

    //calculate length of selected services
    selectedServices.map((service) => {
      duration_calculation += service.duration;
    });

    const service_time = parseInt(duration_calculation);

    const moment_start_time = moment(timeString, "HH:mm").format("HH:mm");
    const moment_end_time = moment(moment_start_time, "HH:mm")
      .add(service_time, "minute")
      .format("HH:mm");

    //update reservation object for adding to db add seconds for backend :( naš backend dev je tako odlucio :((
    setActiveRentData({
      ...activeRentData,
      start_time: timeString + ":00",
      end_time: moment_end_time + ":00",
    });
  };

  //change start time of the TIMEPICKER
  const onChangeEndTimePicker = (date, dateString) => {
    setActiveRentData({ ...activeRentData, end_time: dateString + ":00" });
  };

  return (
    <>
      {activeRentData &&
      selectedEmployee &&
      selectedServices &&
      servicesData ? (
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
                  value={selectedServices}
                  className="w-full"
                  showSearch
                  optionFilterProp="children"
                  mode="multiple"
                  onChange={(value, selectedOptions) => {
                    //selected options give us all options so we need to map thorugh the options to extract ids and set them to selected services
                    var serviceIdsFromSelectedOptions = [];
                    selectedOptions.forEach((service) => {
                      serviceIdsFromSelectedOptions.push(service.id);
                    });

                    //set selected services
                    setSelectedServices(selectedOptions);

                    if (activeRentData.start_time) {
                      //calculate all selected services duration
                      var duration = 0;
                      selectedOptions.forEach((service) => {
                        duration += service.duration;
                      });
                      //calculations for ending time input value
                      let new_end_date = moment(
                        activeRentData.start_time,
                        "HH:mm:ss"
                      );
                      new_end_date.add(duration, "minutes");
                      // setEndTime(new_end_date);
                      setActiveRentData({
                        ...activeRentData,
                        end_time: moment(new_end_date, "HH:mm:ss")
                          .format("HH:mm:ss")
                          .toString(),
                      });
                    }
                  }}
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
                <DatePicker
                  onChange={onChangeDatePicker}
                  value={dayjs(activeRentData.date)}
                  format={"DD.MM.YYYY."}
                  className="w-full"
                  allowClear={false}
                />
              </Col>
              <Col span={8} className="flex flex-col items-start">
                <div className="mb-1">Početno vrijeme</div>
                <TimePicker
                  onChange={onChangeStartTimePicker}
                  value={dayjs(activeRentData.start_time, format)}
                  format={format}
                  className="w-full"
                  allowClear={false}
                />
              </Col>
              <Col span={8} className="flex flex-col items-start">
                <div className="mb-1">Krajnje vrijeme</div>

                <TimePicker
                  value={dayjs(activeRentData.end_time, format)}
                  format={format}
                  className="w-full"
                  onChange={onChangeEndTimePicker}
                  allowClear={false}
                />
              </Col>
            </Row>

            <div style={{ color: "red", marginTop: 8 }}>
              Krajnje vrijeme će bit izračunato na bazi odabranih servisa
            </div>

            {/* save and reset buttons */}
            <Row gutter={16} className="flex justify-between mt-4 items-center">
              <div>
                {rentData[0].expired === true ? (
                  <Tag color="red">Rezervacija je Istekla</Tag>
                ) : (
                  <Tag color="green">Rezervacija je Aktivna</Tag>
                )}
              </div>
              <div>
                <Button
                  className="mr-3"
                  type="primary"
                  danger
                  onClick={onResetButtonClick}
                >
                  Resetriraj
                </Button>
                <Button
                  onClick={onSaveButtonClick}
                  disabled={
                    activeRentData.date && selectedServices.length > 0
                      ? false
                      : true
                  }
                  type="primary"
                >
                  Spremi
                </Button>
              </div>
            </Row>
          </div>
        </Card>
      ) : null}
    </>
  );
};

export default RentDetails;
