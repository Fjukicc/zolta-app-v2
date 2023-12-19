"use client";
import React, { useState, useEffect } from "react";
//swr
import useSWR from "swr";
import { fetcher } from "@/swr/fetcher";
//ant d
import { Table, Button, Tag } from "antd";
//icons
import { FaUser, FaClock, FaCalendar } from "react-icons/fa";
//moment js
import moment from "moment";
//session
import { useSession } from "next-auth/react";
//components
import RentHeader from "./RentHeader";
import AddRentModal from "../shared/shared-modals/AddRentModal";

const { Column } = Table;

const Reservations = () => {
  //session
  const { data: session, status: sessionStatus } = useSession();

  //selected employee
  const [selectedEmployee, setSelectedEmployee] = useState();
  //modal
  const [isAddReservationModalOpen, setIsAddReservationModalOpen] =
    useState(false);
  //are rent refetching
  const [isRentsRefetching, setIsRentsRefetching] = useState(false);
  const [searchRent, setSearchRent] = useState("");

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

  //fetch reservations
  const {
    data: rentsData,
    error: rentsError,
    isLoading: rentsLoading,
    mutate: mutateReservations,
  } = useSWR(
    selectedEmployee
      ? `http://ec2-54-93-214-145.eu-central-1.compute.amazonaws.com/reservation?admin_id=${selectedEmployee.id}`
      : null,
    fetcher
  );

  //handle updating calendar if new rent is created and switch calendar to current user and week
  const handleNewReservationForAdmin = async (selected_worker_id, date) => {
    var new_employee = {};

    employeeData.forEach((emp) => {
      if (emp.id === selected_worker_id) {
        new_employee = {
          ...emp,
          value: emp.name,
          label: emp.name,
        };
      }
    });

    setSelectedEmployee(new_employee);
    const toNormalDate = date.toDate();

    if (calendarView === "Week") {
      const nextWeek = moment(toNormalDate)
        .startOf("isoWeek")
        .format("YYYY-MM-DD");
      setDate(nextWeek);
    } else {
      // setDate(moment(date).format("YYYY-MM-DD"));
      const newDate = moment(toNormalDate, "YYYY-MM-DD").format("YYYY-MM-DD");
      setDate(newDate);
    }
    const newUrl = `http://ec2-54-93-214-145.eu-central-1.compute.amazonaws.com/reservation?admin_id=${selected_worker_id}`;
    await mutateReservations(newUrl);

    setIsRentsRefetching(false);
  };

  //set initial worker
  useEffect(() => {
    const setInitialWorker = () => {
      if (
        sessionStatus === "authenticated" &&
        !employeesLoading &&
        employeesData
      ) {
        let selected_employee;
        employeesData.forEach((e) => {
          if (e.id === session.user.id) {
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
    setInitialWorker();
  }, [session, sessionStatus, employeesData]);

  console.log(rentsData);

  return (
    <div className=" w-full min-h-full pl-6 pr-6 pt-1">
      {/* header for rents */}
      <RentHeader
        setSearchRent={setSearchRent}
        searchRent={searchRent}
        employeesData={employeesData}
        setSelectedEmployee={setSelectedEmployee}
        selectedEmployee={selectedEmployee}
        setIsAddReservationModalOpen={setIsAddReservationModalOpen}
      />
      {/* content */}
      <div className="w-full">
        {" "}
        <Table
          pagination={false}
          size="large"
          dataSource={rentsData}
          rowKey="id"
          className="w-full"
        >
          {/* Rent date */}
          <Column
            title={"Date"}
            dataIndex="date"
            key="date"
            render={(text, record, index) => {
              return (
                <div className="flex items-center">
                  <FaCalendar size={16} className="mr-3" />
                  <div className="font-medium text-md">
                    {moment(record.date, "YYYY-MM-DD")
                      .format("DD.MM.YYYY.")
                      .toString()}
                  </div>
                </div>
              );
            }}
          />
          {/* Timeframe or rent */}
          <Column
            title={"Period"}
            dataIndex="period"
            key="period"
            render={(text, record, index) => {
              return (
                <div className="flex items-center">
                  <FaClock size={16} className="mr-3" />
                  <div className="font-medium text-md">
                    {moment(record.start_time, "hh:mm:ss").format("hh:mm")} -{" "}
                    {moment(record.end_time, "hh:mm:ss").format("hh:mm")}
                  </div>
                </div>
              );
            }}
          />
          {/* Employee name */}
          <Column
            title={"Ime Zaposlenika"}
            dataIndex="name_of_provider"
            key="name_of_provider"
            render={(text, record, index) => {
              return (
                <div className="flex items-center">
                  <FaUser size={16} className="mr-2" />{" "}
                  <div className="font-medium text-md">{record.admin_name}</div>
                </div>
              );
            }}
          />
          {/* user that is appointed */}
          <Column
            title={"Naručena Osoba"}
            dataIndex="name_of_user"
            key="name_of_user"
            render={(text, record, index) => {
              return (
                <div className="flex items-center">
                  <div className="font-medium text-md">{record.name}</div>
                </div>
              );
            }}
          />
          {/* services */}
          <Column
            title={"Servisi"}
            dataIndex="service"
            key="service"
            render={(text, record, index) => {
              return (
                <div className="flex items-center">
                  {/* <FaFileMedical size={18} className="mr-2" /> */}
                  <div className="flex flex-row">
                    {record.service_name.map((service, index) => (
                      <Tag color="blue" key={index}>
                        {service}
                      </Tag>
                    ))}
                  </div>
                </div>
              );
            }}
          />
          {/* status */}
          <Column
            title={"Status"}
            dataIndex="status"
            key="status"
            render={(text, record, index) => {
              return (
                <div className="flex items-center">
                  {record.status === "Active" && (
                    <Tag color="success">Aktivna</Tag>
                  )}
                  {record.status === "Inactive" && (
                    <Tag color="error">Neaktivna</Tag>
                  )}
                </div>
              );
            }}
          />
          {/* <Button type="link" block>
      Link
    </Button> */}
          <Column
            title={"Akcije"}
            dataIndex="actions"
            key="action"
            render={(text, record, index) => {
              return (
                <div className="flex items-center">
                  <Button type="link">Uredi</Button>
                  <Button
                    type="link"
                    className="text-red-500 hover:text-red-500"
                  >
                    Izbriši
                  </Button>
                </div>
              );
            }}
          />
        </Table>
      </div>
      {employeesData && (
        <AddRentModal
          isAddReservationModalOpen={isAddReservationModalOpen}
          setIsAddReservationModalOpen={setIsAddReservationModalOpen}
          employess={employeesData}
          handleNewReservationForAdminCalendar={handleNewReservationForAdmin}
          setIsRentsRefetching={setIsRentsRefetching}
        />
      )}
    </div>
  );
};

export default Reservations;
