"use client";
import React, { useEffect, useState } from "react";
import moment from "moment";
//ant d
import { Row, Segmented, Select } from "antd";
import { SettingOutlined } from "@ant-design/icons";

//components
import PrimaryButton from "../buttons/PrimaryButton";
import PrimaryIconButton from "../buttons/PrimaryIconButton";

const fakeWorkers = [
  {
    value: "jack",
    label: "Jack",
  },
  {
    value: "lucy",
    label: "Lucy",
  },
  {
    value: "tom",
    label: "Tom",
  },
];

const Header = ({
  setDate,
  date,
  onNextButtonClick,
  onPrevButtonClick,
  todayButtonClick,
  setCalendarViewHandler,
  calendarView,
  setSettingsDrawerOpen,
  showAddReservationModal,
  employess,
  setSelectedEmployee,
  selectedEmployee,
  fetchReservationsForNewAdmin,
  setIsRentsRefetching
}) => {
  // console.log(selectedEmployee);
  const [daysInWeek, setDaysInWeek] = useState([]);
  //generate week
  useEffect(() => {
    const moment_date = moment(date, "YYYY-MM-DD");

    if (calendarView === "Week") {
      //start and end of week by given date
      const startOfWeek = moment_date.clone().startOf("isoWeek");
      const endOfWeek = startOfWeek.clone().add(6, "days");

      //generate week from those dates
      let weekDates = [];

      // Populate the array with dates for the whole week
      for (let d = startOfWeek; d <= endOfWeek; d.add(1, "days")) {
        // weekDates.push(d.format("YYYY-MM-DD"));
        weekDates.push({
          date: d.format("YYYY-MM-DD"),
          dayName: d.format("ddd"),
          dayNumber: d.format("D"),
        });
      }

      setDaysInWeek(weekDates);
    }
  }, [date, calendarView]);

  const onChangeWorkerHandler = () => {};

  //handle on day click on week view
  const onDayClickCircleHandler = (dayObj) => {
    setDate(moment(dayObj.date, "YYYY-MM-DD").format("YYYY-MM-DD"));
    setCalendarViewHandler("Day");
  };

  return (
    <>
      {/* FIRST ROW */}
      <Row className="w-full px-3 flex flex-row justify-between">
        {/* left side */}
        <div className="flex flex-row items-center">
          {/* button group */}
          <div className="inline-flex rounded-md shadow-sm" role="group">
            <button
              onClick={onPrevButtonClick}
              type="button"
              className="px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-l-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-blue-500 dark:focus:text-white"
            >
              Back
            </button>
            <button
              onClick={onNextButtonClick}
              type="button"
              className="px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-r-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-blue-500 dark:focus:text-white"
            >
              Next
            </button>
          </div>
          {/* today button */}
          <div className="mr-2" />
          <PrimaryButton onClick={todayButtonClick} title={"Today"} />
          <div className="mr-2" />
          <Segmented
            options={["Day", "Week", "List"]}
            value={calendarView}
            onChange={setCalendarViewHandler}
          />
        </div>

        {/* {right side} */}
        <div className="flex flex-row items-center">
          <Select
            showSearch
            placeholder="Odaberi Zaposlenika"
            optionFilterProp="children"
            value={selectedEmployee.name}
            options={(employess || []).map((worker) => ({
              ...worker,
              value: worker.name,
              label: worker.name,
            }))}
            onChange={(value, selectedOptions) => {
              setIsRentsRefetching(true);
              setSelectedEmployee(selectedOptions);
              fetchReservationsForNewAdmin(selectedOptions.id);
            }}
            filterOption={(input, option) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
          />
          <div className="ml-2">
            <PrimaryButton
              title={"Add Rent"}
              onClick={showAddReservationModal}
            />
          </div>
          <PrimaryIconButton
            onClick={() => setSettingsDrawerOpen(true)}
            icon={
              <SettingOutlined
                style={{ fontSize: 24 }}
                className="text-gray-700"
              />
            }
          />
        </div>
      </Row>
      {/* row for week or day dates (SECOND ROW) */}
      <Row className="w-full flex justify-center flex-row mt-2">
        {/* center */}
        {calendarView === "Week" ? (
          <div className="w-full flex flex-row">
            <div className="w-1/12"></div>
            <div className="w-11/12 flex flex-row">
              {daysInWeek.map((dayOfTheWeek) => (
                <div
                  key={dayOfTheWeek.date}
                  className="flex flex-row justify-center items-center"
                  style={{ width: "14.285%" }}
                >
                  {/* check if date is today */}
                  {dayOfTheWeek.date ===
                  moment().format("YYYY-MM-DD").toString() ? (
                    <div
                      onClick={() => onDayClickCircleHandler(dayOfTheWeek)}
                      className="rounded-full cursor-pointer py-1 px-1 flex flex-col bg-green-200 justify-center items-center hover:bg-green-100"
                      style={{ width: "50px" }}
                    >
                      <p>{dayOfTheWeek.dayNumber.toString()}</p>
                      <p>{dayOfTheWeek.dayName.toString()}</p>
                    </div>
                  ) : (
                    <div
                      onClick={() => onDayClickCircleHandler(dayOfTheWeek)}
                      className="rounded-full cursor-pointer py-1 px-1 flex flex-col justify-center items-center hover:bg-gray-100"
                      style={{ width: "50px" }}
                    >
                      <p>{dayOfTheWeek.dayNumber.toString()}</p>
                      <p>{dayOfTheWeek.dayName.toString()}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div>
            <p className="max-w-md text-3xl font-semibold leading-normal text-gray-900 dark:text-white">
              {moment(date).format("DD.MM.yyyy").toString()}
            </p>
          </div>
        )}
      </Row>
    </>
  );
};

export default Header;
