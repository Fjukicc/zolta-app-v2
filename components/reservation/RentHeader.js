"use client";
import React, { useState } from "react";
//ant d
import { Button, Select, Checkbox, DatePicker } from "antd";
//custom compnents
import { CustomInputWithIcon } from "../shared/input/CustomInput";
import moment from "moment";
import dayjs from "dayjs";

const { RangePicker } = DatePicker;
const dateFormat = "DD.MM.YYYY.";

const RentHeader = ({
  employeesData,
  setSearchOptions,
  searchOptions,
  setIsAddReservationModalOpen,
  mutateReservations,
  isIntervalCheckboxClicked,
  onIntervalCheckboxChange,
}) => {
  // when for one day is changed
  const onSingleDateChange = (date) => {
    setSearchOptions({
      ...searchOptions,
      fromDate: moment(date.toDate()).format("YYYY-MM-DD"),
      untilDate: null,
    });
    refetchReservations();
  };

  //when range is changed
  const onRangeDateChange = (date) => {
    setSearchOptions({
      ...searchOptions,
      fromDate: moment(date[0].toDate()).format("YYYY-MM-DD"),
      untilDate: moment(date[1].toDate()).format("YYYY-MM-DD"),
    });
    refetchReservations();
  };

  const refetchReservations = async () => {
    await mutateReservations();
  };

  return (
    <div className="h-16 flex flex-row justify-between w-full items-center">
      {/* left side (dropdown and search) */}
      <div className="flex flex-row items-center">
        {/* <Input placeholder="Basic usage" /> */}
        {/* <CustomInputWithIcon placeholder={"Search for rents"} value={searchOptions.searchText} onChange={onSearchForRentsTextChange}/> */}
        <Select
          className="ml-3 mr-3"
          value={searchOptions.selectedEmployee}
          placeholder="Odaberi Zaposlenika"
          options={(employeesData || []).map((emp) => ({
            ...emp,
            value: emp.name,
            label: emp.name,
          }))}
          onChange={(value, selectedOptions) => {
            setSearchOptions({
              ...searchOptions,
              selectedEmployee: selectedOptions,
            });
          }}
        />
        <Checkbox
          checked={isIntervalCheckboxClicked}
          onChange={onIntervalCheckboxChange}
        >
          Range Dates
        </Checkbox>
        {!isIntervalCheckboxClicked ? (
          <DatePicker
            allowClear={false}
            defaultValue={dayjs(
              moment(searchOptions.fromDate, "YYYY-MM-DD").toDate()
            )}
            format={dateFormat}
            onChange={onSingleDateChange}
          />
        ) : (
          <RangePicker
            allowClear={false}
            format={dateFormat}
            defaultValue={[
              dayjs(moment(searchOptions.fromDate, "YYYY-MM-DD").toDate()),
              dayjs(moment(searchOptions.untilDate, "YYYY-MM-DD").toDate()),
            ]}
            onChange={onRangeDateChange}
          />
        )}
      </div>
      {/* right side (add new rent button) */}
      <div>
        <Button
          onClick={() => setIsAddReservationModalOpen(true)}
          type="primary"
        >
          Dodaj Rezervaciju
        </Button>
      </div>
    </div>
  );
};

export default RentHeader;
