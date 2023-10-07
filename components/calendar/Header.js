import React from "react";
import moment from "moment";
//ant d
import { Row, Segmented, Select } from "antd";

//components
import PrimaryButton from "../buttons/PrimaryButton";

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
  date,
  onNextButtonClick,
  onPrevButtonClick,
  todayButtonClick,
  setCalendarViewHandler,
  calendarView,
}) => {
  // handle create rent
  const createRentHandler = () => {};

  const onChangeWorkerHandler = () => {};
  return (
    <>
      {/* FIRST ROW */}
      <Row className="w-full p-3 flex flex-row justify-between">
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
        </div>

        {/* {right column} */}
        <div>
          <Segmented
            options={["Day", "Week", "List"]}
            value={calendarView}
            onChange={setCalendarViewHandler}
          />
        </div>
      </Row>

      {/* SECOND ROW */}
      <Row className="w-full p-3 flex flex-row justify-between">
        {/* Left Side */}
          <Select
            className="w-40"
            onChange={onChangeWorkerHandler}
            value={fakeWorkers[0]}
            options={fakeWorkers}
          />

        {/* center */}
        {calendarView === "Week" ? (
          <div>Week View Logic</div>
        ) : (
          <div>
            <p className="max-w-md text-3xl font-semibold leading-normal text-gray-900 dark:text-white">
              {moment(date).format("DD.MM.yyyy").toString()}
            </p>
          </div>
        )}

        {/* right side */}
        <div>
          <PrimaryButton
            title={"Add Reservation"}
            onClick={createRentHandler}
          />
        </div>
      </Row>
    </>
  );
};

export default Header;
