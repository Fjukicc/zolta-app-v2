"use client";
import React, { useEffect, useState } from "react";
//moment js
import moment from "moment";

//components
import DayView from "./calendar-views/DayView";
import WeekView from "./calendar-views/WeekView";
import ListView from "./calendar-views/view-label/ListView";

//DATE PARAM IS CURRENT DATE STATE OF CALENDAR

const Content = ({ date, reservations, calendarView, gridData }) => {
  //for time line state that is shown on calendar
  const [dateTimeState, setDateTimeState] = useState(moment().format("H:mm"));

  //update time every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setDateTimeState(moment().format("H:mm"));
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* DAY VIEW */}
      {calendarView === "Day" && (
        <DayView
          dateTimeState={dateTimeState}
          labels={reservations}
          date={date}
          gridData={gridData}
        />
      )}

      {/* WEEK VIEW */}
      {calendarView === "Week" && (
        <WeekView
          dateTimeState={dateTimeState}
          labels={reservations}
          date={date}
          gridData={gridData}
        />
      )}

      {calendarView === "List" && (
        <ListView reservations={reservations} currentDate={date}/>
      )}
    </>
  );
};

export default Content;
