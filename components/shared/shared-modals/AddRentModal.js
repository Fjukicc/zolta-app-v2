"use client";
import React, { useState, useEffect } from "react";
import { Modal, Input, TimePicker, message, DatePicker, Select } from "antd";
//moment js
import moment from "moment";
//session
import { useSession } from "next-auth/react";
//employess endpoint
import { fetchEmployess } from "@/services/employess";
import { fetchServices } from "@/services/services";
import { addNewReservation } from "@/services/reservation";
//components
import PrimaryButton from "@/components/buttons/PrimaryButton";
import CustomInput from "../input/CustomInput";

const { TextArea } = Input;
//format time in time picker
const format = "HH:mm";

const AddRentModal = ({
  isAddReservationModalOpen,
  setIsAddReservationModalOpen,
  employess,
}) => {
  //session
  const { data: session, status: sessionStatus } = useSession();

  //message notification for success
  const [messageApi, contextHolder] = message.useMessage();

  //helper states for creating rent
  const [selectedService, setSelectedService] = useState([]);
  const [selectedWorker, setSelectedWorker] = useState("");
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [date, setDate] = useState(null);

  //label that is show on calendar for reservation
  const [newReservation, setNewReservation] = useState({
    reservationAdminId: null,
    serviceId: [],
    name: "",
    description: "",
    reservationDate: null,
    startTime: null,
    endTime: null,
  });

  //ERROR STATE
  const [addNewReservationError, setAddNewReservationError] = useState(false);
  const [inputReservationError, setInputReservationError] = useState(false);

  //state employess and services for dropdown data
  // const [employess, setEmployess] = useState(null);
  const [employessError, setEmployessError] = useState(false);

  const [services, setServices] = useState(null);
  const [servicesError, setServicesError] = useState(false);

  //fetch services
  useEffect(() => {
    const fetchServicesFunction = async () => {
      if (
        sessionStatus === "authenticated" &&
        session?.user?.company_id &&
        !services
      ) {
        const companyId = session.user.company_id;
        const data = await fetchServices(companyId);
        if (data.success) {
          setServices(data.data);
          setServicesError(false);
        } else {
          setServicesError(true);
        }
      }
    };

    fetchServicesFunction();
  }, [session, sessionStatus, services]);

  //set initial worker
  useEffect(() => {
    let selected_employee;
    employess.forEach((e) => {
      if (e.id === session.user.id) {
        selected_employee = {
          ...e,
          value: e.name,
          label: e.name,
        };
      }
      setSelectedWorker(selected_employee);
    });
  }, [session, sessionStatus, employess]);

  const setRentName = (name) => {
    setNewReservation({
      ...newReservation,
      name: name,
    });
  };

  //reset data (empty modal on ok click or on edit click)
  const resetLabel = () => {
    setNewReservation({
      reservationAdminId: null,
      companyId: null,
      serviceId: [],
      name: "",
      description: "",
      reservationDate: "",
      startTime: "",
      endTime: "",
    });
    setSelectedService([]);
    setSelectedWorker("");
    setDate(null);
    setStartTime(null);
    setEndTime(null);
    setAddNewReservationError(false);
    setInputReservationError(false);
    setEmployessError(false);
  };

  //on add new reservation modal cancel
  const handleModalCancel = () => {
    //empty modal inputs and pickers
    resetLabel();

    //close modal
    setIsAddReservationModalOpen(false);
  };

  //   handle on ok click modal
  const handleModalOk = () => {
    if (
      newReservation.reservationAdminId === null ||
      newReservation.serviceId === null ||
      newReservation.name === "" ||
      newReservation.description === "" ||
      newReservation.reservationDate === null ||
      newReservation.startTime === null ||
      newReservation.endTime === null
    ) {
      setInputReservationError(true);
      setAddNewReservationError(false);
    } else {
      //create reservation function
      createReservationHandler();
    }
  };

  //function that creates reservation
  const createReservationHandler = async () => {
    if (!session) {
      return;
    }
    const data = {
      company_id: parseInt(session.user.company_id),
      admin_id: parseInt(selectedWorker.id),
      reservation_admin_id: parseInt(newReservation.reservationAdminId),
      service_id: newReservation.serviceId,
      name: newReservation.name,
      description: newReservation.description,
      start_time: newReservation.startTime,
      end_time: newReservation.endTime,
      date: newReservation.reservationDate,
    };
    const response = await addNewReservation(data);
    if (response.success) {
      //close modal
      setIsAddReservationModalOpen(false);
      //empty modal inputs and pickers
      resetLabel();
      onSuccessfullRentCreate();
    } else {
      setAddNewReservationError(true);
    }
  };

  //set date for new reservation DATEPICKER
  const onChangeDatePicker = (date, dateString) => {
    setNewReservation({ ...newReservation, reservationDate: dateString });
    setDate(date);
  };

  //change start time of the TIMEPICKER
  const onChangeStartTimePicker = (time, timeString) => {
    //map through picked services and calculate full durations
    var duration_calculation = 0;

    selectedService.map((service) => {
      duration_calculation += service.duration;
    });

    const service_time = parseInt(duration_calculation);

    const moment_start_time = moment(timeString, "HH:mm").format("HH:mm");
    const moment_end_time = moment(moment_start_time, "HH:mm")
      .add(service_time, "minute")
      .format("HH:mm");

    //update reservation object for adding to db add seconds for backend :( naš backend dev je tako odlucio :((
    setNewReservation({
      ...newReservation,
      startTime: timeString + ":00",
      endTime: moment_end_time + ":00",
    });

    //set starting time input value
    setStartTime(time);

    //calculations for ending time input value
    let new_end_date = moment(timeString, "HH:mm");
    new_end_date.add(service_time, "minutes");

    //set ending time input value
    setEndTime(new_end_date);
  };

  //change start time of the TIMEPICKER
  const onChangeEndTimePicker = (date, dateString) => {
    setNewReservation({ ...newReservation, endTime: dateString + ":00" });
    setEndTime(date);
  };

  const onSuccessfullRentCreate = () => {
    messageApi.open({
      type: "success",
      content: "Uspješno ste kreirali rezervaciju",
    });
  };
  return (
    <>
      {contextHolder}
      <Modal
        title="Nova Rezervacija"
        open={isAddReservationModalOpen}
        onCancel={handleModalCancel}
        onOk={handleModalOk}
      >
        <div className="mt-2" />

        {/* Name of a person that is making the reservation */}
        <div className="mb-2">
          <div>Puno ime naručivatelja:</div>
          <CustomInput
            placeholder="Ime osobe koja se naručuje"
            value={newReservation.name}
            onChange={setRentName}
          />
        </div>

        {/* All services to select */}
        <div className=" mb-2">
          <div>Odaberi servis:</div>
          <Select
            showSearch
            style={{ width: "100%" }}
            optionFilterProp="children"
            mode="multiple"
            value={selectedService}
            placeholder="Odaberi Servis"
            options={(services || []).map((service) => ({
              ...service,
              value: service.name,
              label: service.name,
            }))}
            onChange={(value, selectedOptions) => {
              //selected options give us all options so we need to map thorugh the options to extract ids and set them to selected services
              var serviceIdsFromSelectedOptions = [];
              selectedOptions.forEach((service) => {
                serviceIdsFromSelectedOptions.push(service.id);
              });

              //set extracted is to new reservation
              setNewReservation({
                ...newReservation,
                serviceId: serviceIdsFromSelectedOptions,
              });

              //set selected services
              setSelectedService(selectedOptions);
              if (startTime) {
                //calculate all selected services duration
                var duration = 0;
                selectedOptions.forEach((service) => {
                  duration += service.duration;
                });
                //calculations for ending time input value
                let new_end_date = moment(newReservation.startTime, "HH:mm");
                new_end_date.add(duration, "minutes");
                setEndTime(new_end_date);
              }
            }}
            filterOption={(input, option) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
          />
        </div>

        {/* select employee */}
        <div className="mb-2">
          <div>Odaberi zaposlenika:</div>
          <Select
            showSearch
            placeholder="Odaberi Zaposlenika"
            style={{ width: "100%" }}
            optionFilterProp="children"
            value={selectedWorker}
            options={(employess || []).map((worker) => ({
              ...worker,
              value: worker.name,
              label: worker.name,
            }))}
            onChange={(value, selectedOptions) => {
              setNewReservation({
                ...newReservation,
                reservationAdminId: selectedOptions.id,
              });
              setSelectedWorker(selectedOptions);
            }}
            filterOption={(input, option) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
          />
        </div>

        {/* additional note */}
        <div className="mb-2">
          <div>Vaša Nota</div>
          <TextArea
            placeholder="Dodatna noda o rezervaciji"
            rows={4}
            value={newReservation.description}
            onChange={(newValue) =>
              setNewReservation({
                ...newReservation,
                description: newValue.target.value,
              })
            }
          />
        </div>

        {/* date picker */}
        <div className="mb-2">
          <div>Odaberi datum za rezervaciju</div>
          <DatePicker
            placeholder="Odaberi Datum"
            value={date}
            onChange={onChangeDatePicker}
            disabledDate={(current) => {
              return moment().add(-1, "days") > current;
            }}
          />
        </div>

        {/* time pickers */}
        <div className=" flex flex-row justify-start">
          <div className="flex flex-col mr-6">
            <div>Početno vrijeme:</div>
            <TimePicker
              placeholder="Početno Vrijeme"
              disabled={
                newReservation.reservationDate && selectedService ? false : true
              }
              value={startTime}
              minuteStep={5}
              format={format}
              onChange={onChangeStartTimePicker}
            />
          </div>
          <div className="flex flex-col">
            <div>Krajnje vrijeme:</div>
            <TimePicker
              placeholder="Krajnje Vrijeme"
              disabled={newReservation.reservationDate ? false : true}
              // disabledHours
              // disabledMinutes
              value={endTime}
              minuteStep={5}
              format={format}
              onChange={onChangeEndTimePicker}
            />
          </div>
        </div>
        <div style={{ color: "red", marginTop: 8 }}>
          Krajnje vrijeme će bit izračunato na bazi odabranih servisa
        </div>
        {/* ERRORS */}
        {addNewReservationError ? (
          <div
            style={{
              textAlign: "center",
              fontSize: 16,
              color: "red",
              marginTop: 16,
            }}
          >
            Nemozemo dodati novu rezervaciju
          </div>
        ) : (
          ""
        )}
        {inputReservationError ? <div>Molimo vas popunite sva polja!</div> : ""}
      </Modal>
    </>
  );
};

export default AddRentModal;
