"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
//swr
import useSWR from "swr";
import { fetcher } from "@/swr/fetcher";
//ant d
import { Table, Button, Tag, Popconfirm, message } from "antd";
//icons
import { FaUser, FaClock, FaCalendar } from "react-icons/fa";
//moment js
import moment from "moment";
//session
import { useSession } from "next-auth/react";
//components
import RentHeader from "./RentHeader";
import AddRentModal from "../shared/shared-modals/AddRentModal";
import { deleteReservation } from "@/services/reservation";

const { Column } = Table;

const Reservations = () => {
  //session
  const { data: session, status: sessionStatus } = useSession();

  //for messages
  const [messageApi, contextHolder] = message.useMessage();

  //modal
  const [isAddReservationModalOpen, setIsAddReservationModalOpen] =
    useState(false);
  //are rent refetching
  const [isRentsRefetching, setIsRentsRefetching] = useState(false);

  const [isIntervalCheckboxClicked, setIsIntervakCheckboxClicked] =
    useState(false);

  const [searchOptions, setSearchOptions] = useState({
    fromDate: moment(),
    untilDate: null,
    selectedEmployee: null,
  });

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
    searchOptions.selectedEmployee
      ? searchOptions.untilDate === null
        ? `http://ec2-54-93-214-145.eu-central-1.compute.amazonaws.com/reservation?admin_id=${
            searchOptions.selectedEmployee.id
          }&range_start_date=${moment(searchOptions.fromDate)
            .format("YYYY-MM-DD")
            .toString()}&range_end_date=${moment(searchOptions.fromDate)
            .add(1, "day")
            .format("YYYY-MM-DD")
            .toString()}`
        : `http://ec2-54-93-214-145.eu-central-1.compute.amazonaws.com/reservation?admin_id=${
            searchOptions.selectedEmployee.id
          }&range_start_date=${moment(searchOptions.fromDate)
            .format("YYYY-MM-DD")
            .toString()}&range_end_date=${moment(searchOptions.untilDate)
            .format("YYYY-MM-DD")
            .toString()}`
      : null,
    fetcher
  );

  //handle updating calendar if new rent is created and switch calendar to current user and week
  const handleNewReservationForAdmin = async (selected_worker_id, date) => {
    var new_employee = {};

    employeesData.forEach((emp) => {
      if (emp.id === selected_worker_id) {
        new_employee = {
          ...emp,
          value: emp.name,
          label: emp.name,
        };
      }
    });

    setSearchOptions({
      ...searchOptions,
      selectedEmployee: new_employee,
      untilDate: null,
      fromDate: moment(date.toDate()).format("YYYY-MM-DD"),
    });
    setIsIntervakCheckboxClicked(false);
    await mutateReservations();
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
        setSearchOptions({
          ...searchOptions,
          selectedEmployee: selected_employee,
        });
      }
    };
    setInitialWorker();
  }, [session, sessionStatus, employeesData]);

  //is checkbox for multiple dates checked
  const onIntervalCheckboxChange = (e) => {
    setIsIntervakCheckboxClicked(e.target.checked);
    if (e.target.checked === true) {
      setSearchOptions({
        ...searchOptions,
        untilDate: moment(searchOptions.fromDate, "YYYY-MM-DD").add(1, "week"),
      });
    } else {
      setSearchOptions({
        ...searchOptions,
        untilDate: null,
      });
    }
  };

  //delete rent
  const onDeleteReservationClick = async (record) => {
    const rent_id = record.id;
    const response = await deleteReservation(rent_id);
    if (response.success) {
      successRentDelete(record);
      await mutateReservations();
    } else {
      errorRentDelete();
    }
  };

  const successRentDelete = (record) => {
    messageApi.open({
      type: "success",
      content: `Uspješno izbrisana rezervacija, ${moment(
        record.date,
        "YYYY-MM-DD"
      )
        .format("DD.MM.YYYY.")
        .toString()}, od ${moment(record.start_time, "hh:mm:ss").format(
        "HH:mm"
      )} do ${moment(record.end_time, "hh:mm:ss").format("HH:mm")}`,
    });
  };

  const errorRentDelete = () => {
    messageApi.open({
      type: "Greška",
      content: "Nismo uspjeli izbrisati rezervaciju",
    });
  };

  return (
    <div className=" w-full min-h-full pl-6 pr-6 pt-1">
      {contextHolder}
      {/* header for rents */}
      <RentHeader
        employeesData={employeesData}
        searchOptions={searchOptions}
        setSearchOptions={setSearchOptions}
        setIsAddReservationModalOpen={setIsAddReservationModalOpen}
        mutateReservations={mutateReservations}
        onIntervalCheckboxChange={onIntervalCheckboxChange}
        isIntervalCheckboxClicked={isIntervalCheckboxClicked}
      />
      {/* content */}
      <div className="w-full">
        {" "}
        <Table
          pagination={false}
          size="large"
          dataSource={rentsData}
          rowKey="id"
          className="w-full pb-8"
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
                    {moment(record.start_time, "hh:mm:ss").format("HH:mm")} -{" "}
                    {moment(record.end_time, "hh:mm:ss").format("HH:mm")}
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
                  <Link
                    href={{
                      pathname: "/dashboard/rents/rent-details",
                      query: {
                        rent_id: record.id,
                      },
                    }}
                  >
                    <Button type="link">Uredi</Button>
                  </Link>
                  <Popconfirm
                    title="Brisanje Rezervacije"
                    description="Jeste li sigurni da želite izbrisati rezervaciju?"
                    okText="Da"
                    cancelText="Ne"
                    onConfirm={(e) => onDeleteReservationClick(record)}
                  >
                    <Button
                      type="link"
                      className="text-red-500 hover:text-red-500"
                    >
                      Izbriši
                    </Button>
                  </Popconfirm>
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
