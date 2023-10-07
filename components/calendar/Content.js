"use client";
import React, { useEffect, useState } from "react";
//bl
import { calculateCalendarHours, createReadebleHours } from "./bl";
//components
import DayView from "./calendar-views/DayView";
import WeekView from "./calendar-views/WeekView";

//DATE PARAM IS CURRENT DATE STATE OF CALENDAR

const Content = ({ date, labels, setLabels, calendarView }) => {

  // data to fill the grid
  const [gridData, setGridData] = useState();

  //create grid
  useEffect(() => {
    const hoursArray = calculateCalendarHours(9, 20);
    const readebleArray = createReadebleHours(hoursArray, 20);

    if (readebleArray) {
      setGridData(readebleArray);
    }
  }, []);
  return (
    <>
      {/* DAY VIEW */}
      {labels && calendarView === "Day" && (
        <DayView
          setLabels={setLabels}
          labels={labels}
          date={date}
          gridData={gridData}
        />
      )}

      {/* WEEK VIEW */}
      {labels && calendarView === "Week" && (
        <WeekView
          setLabels={setLabels}
          labels={labels}
          date={date}
          gridData={gridData}
        />
      )}
    </>
  );
};

export default Content;
