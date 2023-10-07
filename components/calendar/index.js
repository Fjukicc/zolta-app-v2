"use client";
import React, { useState, useEffect } from "react";
import moment from "moment/moment";
// utils
import { increaseDay, decreaseDay } from "./bl";
//local components
import Header from "./Header";
import Content from "./Content";
//ant d
import { Card } from "antd";
//fake data
import { fakeData } from "./bl";

const Calendar = () => {
  const [date, setDate] = useState(moment().format("YYYY-MM-DD"));
  //set all labels (implement caching)
  const [labels, setLabels] = useState();

  //segmented (week, day, list)
  const [calendarView, setCalendarView] = useState("Day");

  const setCalendarViewHandler = (prop) =>{
    setCalendarView(prop)
  }

  const onNextButtonClick = () => {
    const new_date = increaseDay(date);
    setDate(new_date);
  };

  const onPrevButtonClick = () => {
    const new_date = decreaseDay(date);
    setDate(new_date);
  };

  const todayButtonClick = () => {
    setDate(moment().format("YYYY-MM-DD"));
  };

  //fetch labels
  useEffect(() => {
    const response = fakeData;

    setLabels(response);
  }, []);

  return (
    <Card>
      <div className="h-128 w-full">
        <Header
          date={date}
          onNextButtonClick={onNextButtonClick}
          onPrevButtonClick={onPrevButtonClick}
          todayButtonClick={todayButtonClick}
          calendarView={calendarView}
          setCalendarViewHandler={setCalendarViewHandler}
        />
      </div>
      <div className="w-full">
        {labels && (
          <Content
            setLabels={setLabels}
            labels={labels}
            date={date}
            calendarView={calendarView}
          />
        )}
      </div>
    </Card>
  );
};

export default Calendar;
