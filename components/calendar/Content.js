"use client";
import React, { useEffect, useState } from "react";

//components
import DayView from "./calendar-views/DayView";
import WeekView from "./calendar-views/WeekView";

//DATE PARAM IS CURRENT DATE STATE OF CALENDAR

const Content = ({
  date,
  reservations,
  calendarView,
  gridData,
}) => {
  return (
    <>
      {/* DAY VIEW */}
      {calendarView === "Day" && (
        <DayView
          labels={reservations}
          date={date}
          gridData={gridData}
        />
      )}

      {/* WEEK VIEW */}
      {calendarView === "Week" && (
        <WeekView
          labels={reservations}
          date={date}
          gridData={gridData}
        />
      )}
    </>
  );
};

export default Content;
