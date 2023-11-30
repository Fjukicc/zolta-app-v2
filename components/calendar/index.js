"use client";
import React, { useState, useEffect, useRef } from "react";
import moment from "moment/moment";
// utils
import {
  increaseDay,
  decreaseDay,
  calculateCalendarHours,
  createReadebleHours,
} from "./bl";
//local components
import Header from "./Header";
import Content from "./Content";
//ant d
import { Card } from "antd";
//session
import { useSession } from "next-auth/react";
//drawers and modals
import CalendarSettingsDrawer from "./drawer/CalendarSettingsDrawer";
import AddRentModal from "../shared/shared-modals/AddRentModal";
//api
import { fetchAdminReservations } from "@/services/reservation";
//swr
import { fetcher } from "@/swr/fetcher";
import useSWR from "swr";

const Calendar = () => {
  //session
  const { data: session, status: sessionStatus } = useSession();

  //fetch employee data
  const {
    data: employeeData,
    error: employeeError,
    isLoading: employeeLoading,
  } = useSWR(
    session
      ? `http://ec2-54-93-214-145.eu-central-1.compute.amazonaws.com/admin?company_id=${session.user.company_id}`
      : null,
    fetcher
  );
  const employeeEffectCalled = useRef(false);

  // ADD RENT MODAL
  const [isAddReservationModalOpen, setIsAddReservationModalOpen] =
    useState(false);

  const showAddReservationModal = () => {
    setIsAddReservationModalOpen(true);
  };

  const [date, setDate] = useState(moment().format("YYYY-MM-DD"));
  // data to fill the grid
  const [gridData, setGridData] = useState();

  const [selectedEmployee, setSelectedEmployee] = useState();

  //set all labels (implement caching)
  const [reservations, setReservations] = useState();
  const [reservationsLoading, setReservationsLoading] = useState(true);

  //segmented (week, day, list)
  const [calendarView, setCalendarView] = useState("Day");
  const [windowWidth, setWindowWidth] = useState();

  //CALENDAR SETTINGS STATE
  //drawer calendar settings (if calendar settings are closed just update copy to current settings else post new settings to db and refetch settings)
  const [settingsDrawerOpen, setSettingsDrawerOpen] = useState(false);
  const [calendarSettings, setCalendarSettings] = useState({
    showWeekends: true,
  });
  const [calendarSettingsCopy, setCalendarSettingsCopy] =
    useState(calendarSettings);
  //CALENDAR SETTINGS STATE END

  // REINITIALIZE CALENDAR ON RESIZE
  // const handleResize = () => {
  //   setWindowWidth(window.innerWidth);
  //   fetchAllReservations();
  // };

  //listen on resize
  // useEffect(() => {
  //   window.addEventListener("resize", handleResize);
  //   return () => {
  //     window.removeEventListener("resize", handleResize);
  //   };
  // }, []);


  //set initial employee
  useEffect(() => {
    if (employeeData && !employeeEffectCalled.current) {
      var selected_employee;
      employeeData.forEach((e) => {
        if (e.id === session.user.id) {
          selected_employee = e;
        }
        setSelectedEmployee(selected_employee);
      });
      employeeEffectCalled.current = true;
    }
  }, [employeeData]);

  //fetch reservations onload
  useEffect(() => {
    const fetchAllReservations = async () => {
      if (selectedEmployee) {
        const data = await fetchAdminReservations({
          admin_id: selectedEmployee.id,
        });
        if (data.success) {
          setReservations(data.data);
          setReservationsLoading(false);
        }
      }
    };

    fetchAllReservations();
  }, [selectedEmployee]);

  //create grid for the calendar
  useEffect(() => {
    const hoursArray = calculateCalendarHours(9, 20);
    const readebleArray = createReadebleHours(hoursArray, 20);

    if (readebleArray) {
      setGridData(readebleArray);
    }
  }, []);

  //CALENDAR SETTINGS FUNCTIONS
  //fetch settings on initial load using useEffect and onSaveButtonClick
  const fetchCalendarSettings = () => {
    setCalendarSettings();
  };

  const onSaveCalendarSettings = () => {
    //push new settings to db and refetch
  };

  const onSettingsDrawerClose = () => {
    setSettingsDrawerOpen(false);
    setCalendarSettingsCopy(calendarSettings);
  };

  //set witch view (day, list, week)
  const setCalendarViewHandler = (prop) => {
    setCalendarView(prop);
  };
  //CALENDAR SETTING END

  //DAYS WEEK NAVIGATION FUNCTIONS
  const onNextButtonClick = () => {
    if (calendarView === "Day") {
      const new_date = increaseDay(date);
      setDate(new_date);
    } else if (calendarView === "Week") {
      const nextWeek = moment(date)
        .startOf("isoWeek")
        .add(1, "weeks")
        .format("YYYY-MM-DD");
      setDate(nextWeek);
    }
  };

  const onPrevButtonClick = () => {
    if (calendarView === "Day") {
      const new_date = decreaseDay(date);
      setDate(new_date);
    } else if (calendarView === "Week") {
      const prevWeek = moment(date)
        .endOf("isoWeek")
        .add(-1, "weeks")
        .format("YYYY-MM-DD");
      setDate(prevWeek);
    }
  };

  const todayButtonClick = () => {
    setDate(moment().format("YYYY-MM-DD"));
  };
  //DAYS WEEK NAVIGATION FUNCTIONS END

  //generate grid data

  //is component in loading state
  if (employeeLoading === true) {
    return <p className=" text-3xl text-black font-bold">Loading...</p>;
  }

  //is component in error state
  if (employeeError === true) {
    return (
      <p className=" text-3xl text-black font-bold">
        Error (check internet connection)...
      </p>
    );
  }

  return (
    <>
      <Card style={{ height: "100%" }}>
        <div className="w-full mt-4">
          {employeeData && selectedEmployee && (
            <Header
              employess={employeeData}
              setDate={setDate}
              date={date}
              onNextButtonClick={onNextButtonClick}
              onPrevButtonClick={onPrevButtonClick}
              todayButtonClick={todayButtonClick}
              calendarView={calendarView}
              setCalendarViewHandler={setCalendarViewHandler}
              setSettingsDrawerOpen={setSettingsDrawerOpen}
              onSettingsDrawerClose={onSettingsDrawerClose}
              showAddReservationModal={showAddReservationModal}
              selectedEmployee={selectedEmployee}
              setSelectedEmployee={setSelectedEmployee}
              setReservationsLoading={setReservationsLoading}
            />
          )}
        </div>
        <div className="w-full">
          {!reservationsLoading && (
            <Content
              setReservations={setReservations}
              reservations={reservations}
              date={date}
              calendarView={calendarView}
              gridData={gridData}
            />
          )}
        </div>
      </Card>
      <CalendarSettingsDrawer
        settingsDrawerOpen={settingsDrawerOpen}
        onSettingsDrawerClose={onSettingsDrawerClose}
        calendarSettingsCopy={calendarSettingsCopy}
        setCalendarSettingsCopy={setCalendarSettingsCopy}
      />
      {/* ADD RENT MODAL */}
      {employeeData && (
        <AddRentModal
          isAddReservationModalOpen={isAddReservationModalOpen}
          setIsAddReservationModalOpen={setIsAddReservationModalOpen}
          employess={employeeData}
        />
      )}
    </>
  );
};

export default Calendar;
