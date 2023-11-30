"use client";
import React, { useEffect, useState } from "react";

//components
import DayView from "./calendar-views/DayView";
import WeekView from "./calendar-views/WeekView";

//DATE PARAM IS CURRENT DATE STATE OF CALENDAR

const Content = ({
  date,
  reservations,
  setReservations,
  calendarView,
  gridData,
}) => {
  return (
    <>
      {/* DAY VIEW */}
      {calendarView === "Day" && (
        <DayView
          setLabels={setReservations}
          labels={reservations}
          date={date}
          gridData={gridData}
        />
      )}

      {/* WEEK VIEW */}
      {calendarView === "Week" && (
        <WeekView
          setLabels={setReservations}
          labels={reservations}
          date={date}
          gridData={gridData}
        />
      )}
    </>
  );
};

export default Content;
